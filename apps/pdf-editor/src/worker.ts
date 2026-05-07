import { CoreApiClient } from 'twenty-client-sdk/core';
import type { CoreSchema } from 'twenty-client-sdk/core';

export interface Env {
  ASSETS: Fetcher;
  GOTENBERG_URL?: string;
  GOTENBERG_API_BASIC_AUTH_USERNAME?: string;
  GOTENBERG_API_BASIC_AUTH_PASSWORD?: string;
  TWENTY_API_URL?: string;
  TWENTY_API_KEY?: string;
}

type RenderBody = {
  html?: unknown;
  css?: unknown;
  title?: unknown;
};

type SaveTemplateBody = {
  name?: unknown;
  kind?: unknown;
  isActive?: unknown;
  htmlSource?: unknown;
  cssSource?: unknown;
};

type PdfTemplate = {
  id: string;
  name?: string | null;
  kind?: 'INVOICE' | 'CONTRACT' | null;
  isActive?: boolean | null;
  htmlSource?: string | null;
  cssSource?: string | null;
  previewUrl?: {
    primaryLinkLabel?: string | null;
    primaryLinkUrl?: string | null;
  } | null;
  lastPreviewedAt?: string | null;
};

const json = (body: unknown, init?: ResponseInit) =>
  new Response(JSON.stringify(body), {
    ...init,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      ...init?.headers,
    },
  });

const readJson = async <T>(request: Request): Promise<T> => {
  try {
    return (await request.json()) as T;
  } catch {
    throw new Error('Request body must be JSON.');
  }
};

const toDocument = (title: string, html: string) => `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(title)}</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>${html}</body>
</html>`;

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

const createTraceId = () => `ima-pdf-${crypto.randomUUID()}`;

const crmUnavailable = () =>
  json(
    {
      error:
        'CRM sync is not configured. Set TWENTY_API_URL and TWENTY_API_KEY on the Worker.',
    },
    { status: 500 },
  );

const crmClient = (env: Env) => {
  if (!env.TWENTY_API_URL || !env.TWENTY_API_KEY) {
    throw new Error('CRM sync is not configured.');
  }

  return new CoreApiClient({
    url: `${env.TWENTY_API_URL.replace(/\/$/, '')}/graphql`,
    headers: {
      authorization: `Bearer ${env.TWENTY_API_KEY}`,
    },
    fetch,
  });
};

const pdfTemplateFields = {
  id: true,
  name: true,
  kind: true,
  isActive: true,
  htmlSource: true,
  cssSource: true,
  previewUrl: {
    primaryLinkLabel: true,
    primaryLinkUrl: true,
  },
  lastPreviewedAt: true,
} satisfies CoreSchema.PdfTemplateGenqlSelection;

const listTemplates = async (env: Env) => {
  if (!env.TWENTY_API_URL || !env.TWENTY_API_KEY) {
    return crmUnavailable();
  }

  try {
    const data = await crmClient(env).query({
      pdfTemplates: {
        edges: {
          node: pdfTemplateFields,
        },
      },
    });
    
    console.log('[DEBUG] Twenty API listTemplates raw response data:', JSON.stringify(data, null, 2));

    const templates =
      data.pdfTemplates?.edges?.map((edge) => edge.node).filter(Boolean) ?? [];

    console.log('[DEBUG] Twenty API parsed templates count:', templates.length);

    return json({ templates });
  } catch (error) {
    console.error('[DEBUG] Twenty API listTemplates error:', error);
    throw error;
  }
};

const getTemplate = async (env: Env, id: string) => {
  if (!env.TWENTY_API_URL || !env.TWENTY_API_KEY) {
    return crmUnavailable();
  }

  try {
    const data = await crmClient(env).query({
      pdfTemplate: {
        __args: { filter: { id: { eq: id } } },
        ...pdfTemplateFields,
      },
    });

    console.log(`[DEBUG] Twenty API getTemplate(${id}) raw response:`, JSON.stringify(data, null, 2));

    if (!data.pdfTemplate) {
      console.log(`[DEBUG] Twenty API getTemplate(${id}) returned empty/not found.`);
      return json({ error: 'PDF template not found.' }, { status: 404 });
    }

    return json({ template: data.pdfTemplate });
  } catch (error) {
    console.error(`[DEBUG] Twenty API getTemplate(${id}) error:`, error);
    throw error;
  }
};

const saveTemplate = async (request: Request, env: Env, id: string) => {
  if (!env.TWENTY_API_URL || !env.TWENTY_API_KEY) {
    return crmUnavailable();
  }

  const body = await readJson<SaveTemplateBody>(request);
  const data: CoreSchema.PdfTemplateUpdateInput = {};

  if (typeof body.name === 'string') data.name = body.name;
  if (body.kind === 'INVOICE' || body.kind === 'CONTRACT') data.kind = body.kind;
  if (typeof body.isActive === 'boolean') data.isActive = body.isActive;
  if (typeof body.htmlSource === 'string') data.htmlSource = body.htmlSource;
  if (typeof body.cssSource === 'string') data.cssSource = body.cssSource;

  if (Object.keys(data).length === 0) {
    return json({ error: 'No template changes were provided.' }, { status: 400 });
  }

  const result = await crmClient(env).mutation({
    updatePdfTemplate: {
      __args: { id, data },
      ...pdfTemplateFields,
    },
  });

  return json({ template: result.updatePdfTemplate });
};

const unauthorized = () =>
  new Response('Authentication required.', {
    status: 401,
    headers: {
      'www-authenticate': 'Basic realm="IMA PDF Editor", charset="UTF-8"',
      'cache-control': 'no-store',
    },
  });

const getExpectedAuthorization = (env: Env) => {
  if (
    !env.GOTENBERG_API_BASIC_AUTH_USERNAME ||
    !env.GOTENBERG_API_BASIC_AUTH_PASSWORD
  ) {
    return null;
  }

  return `Basic ${btoa(
    `${env.GOTENBERG_API_BASIC_AUTH_USERNAME}:${env.GOTENBERG_API_BASIC_AUTH_PASSWORD}`,
  )}`;
};

const isAuthorized = (request: Request, env: Env) => {
  const expectedAuthorization = getExpectedAuthorization(env);

  if (!expectedAuthorization) {
    return false;
  }

  return request.headers.get('authorization') === expectedAuthorization;
};

const renderPdf = async (request: Request, env: Env) => {
  const body = await readJson<RenderBody>(request);
  const html = typeof body.html === 'string' ? body.html : '';
  const css = typeof body.css === 'string' ? body.css : '';
  const title = typeof body.title === 'string' ? body.title : 'IMA PDF';

  if (!html.trim()) {
    return json({ error: 'HTML is required.' }, { status: 400 });
  }

  if (!env.GOTENBERG_URL || env.GOTENBERG_URL.includes('example.com')) {
    return json(
      {
        error:
          'GOTENBERG_URL is not configured. Set it in wrangler.jsonc or Cloudflare Worker variables.',
      },
      { status: 500 },
    );
  }

  const form = new FormData();
  form.append(
    'files',
    new File([toDocument(title, html)], 'index.html', {
      type: 'text/html;charset=utf-8',
    }),
  );
  form.append(
    'files',
    new File([css], 'style.css', { type: 'text/css;charset=utf-8' }),
  );
  form.set('marginTop', '0.45');
  form.set('marginBottom', '0.45');
  form.set('marginLeft', '0.45');
  form.set('marginRight', '0.45');
  form.set('paperWidth', '8.27');
  form.set('paperHeight', '11.7');
  form.set('printBackground', 'true');

  const traceId = createTraceId();
  const headers: HeadersInit = {
    'Gotenberg-Output-Filename': 'ima-template-preview',
    'Gotenberg-Trace': traceId,
  };

  const expectedAuthorization = getExpectedAuthorization(env);

  if (expectedAuthorization) {
    headers.authorization = expectedAuthorization;
  }

  const gotenbergResponse = await fetch(
    `${env.GOTENBERG_URL.replace(/\/$/, '')}/forms/chromium/convert/html`,
    {
      method: 'POST',
      headers,
      body: form,
    },
  );

  if (!gotenbergResponse.ok) {
    const upstreamTrace =
      gotenbergResponse.headers.get('Gotenberg-Trace') ?? traceId;

    return json(
      {
        error: 'Gotenberg render failed.',
        status: gotenbergResponse.status,
        trace: upstreamTrace,
        details: await gotenbergResponse.text(),
      },
      { status: 502 },
    );
  }

  return new Response(gotenbergResponse.body, {
    headers: {
      'content-type': 'application/pdf',
      'content-disposition': 'inline; filename="ima-template-preview.pdf"',
      'cache-control': 'no-store',
      'Gotenberg-Trace': gotenbergResponse.headers.get('Gotenberg-Trace') ?? traceId,
    },
  });
};

export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/health') {
      return json({
        ok: true,
        gotenbergConfigured: !!env.GOTENBERG_URL,
        crmConfigured: !!(env.TWENTY_API_URL && env.TWENTY_API_KEY),
        gotenbergAuthConfigured: !!(
          env.GOTENBERG_API_BASIC_AUTH_USERNAME &&
          env.GOTENBERG_API_BASIC_AUTH_PASSWORD
        ),
        gotenbergUrl: env.GOTENBERG_URL
          ? new URL(env.GOTENBERG_URL).origin
          : null,
      });
    }

    if (!isAuthorized(request, env)) {
      return unauthorized();
    }

    if (url.pathname === '/api/render' && request.method === 'POST') {
      try {
        return await renderPdf(request, env);
      } catch (error) {
        return json(
          {
            error: error instanceof Error ? error.message : 'Render failed.',
          },
          { status: 500 },
        );
      }
    }

    if (url.pathname === '/api/templates' && request.method === 'GET') {
      try {
        return await listTemplates(env);
      } catch (error) {
        return json(
          {
            error:
              error instanceof Error
                ? error.message
                : 'Failed to load PDF templates.',
          },
          { status: 500 },
        );
      }
    }

    const templateMatch = url.pathname.match(/^\/api\/templates\/([^/]+)$/);
    if (templateMatch && request.method === 'GET') {
      try {
        return await getTemplate(env, decodeURIComponent(templateMatch[1]));
      } catch (error) {
        return json(
          {
            error:
              error instanceof Error
                ? error.message
                : 'Failed to load PDF template.',
          },
          { status: 500 },
        );
      }
    }

    if (templateMatch && request.method === 'PUT') {
      try {
        return await saveTemplate(
          request,
          env,
          decodeURIComponent(templateMatch[1]),
        );
      } catch (error) {
        return json(
          {
            error:
              error instanceof Error
                ? error.message
                : 'Failed to save PDF template.',
          },
          { status: 500 },
        );
      }
    }

    return env.ASSETS.fetch(request);
  },
};
