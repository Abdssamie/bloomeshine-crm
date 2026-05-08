export interface Env {
  ASSETS: Fetcher;
  GOTENBERG_URL?: string;
  GOTENBERG_API_BASIC_AUTH_USERNAME?: string;
  GOTENBERG_API_BASIC_AUTH_PASSWORD?: string;
}

type RenderBody = {
  html?: unknown;
  css?: unknown;
  title?: unknown;
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

const generatePdfResponse = async (title: string, html: string, css: string, env: Env) => {
  if (!html.trim()) {
    throw new Error('HTML is required.');
  }

  if (!env.GOTENBERG_URL || env.GOTENBERG_URL.includes('example.com')) {
    throw new Error('GOTENBERG_URL is not configured.');
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
    const upstreamTrace = gotenbergResponse.headers.get('Gotenberg-Trace') ?? traceId;
    const details = await gotenbergResponse.text();
    throw new Error(`Gotenberg render failed (Status ${gotenbergResponse.status}). Trace: ${upstreamTrace}. Details: ${details}`);
  }

  return { gotenbergResponse, traceId };
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

  try {
    const { gotenbergResponse, traceId } = await generatePdfResponse(title, html, css, env);

    return new Response(gotenbergResponse.body, {
      headers: {
        'content-type': 'application/pdf',
        'content-disposition': 'inline; filename="ima-template-preview.pdf"',
        'cache-control': 'no-store',
        'Gotenberg-Trace': gotenbergResponse.headers.get('Gotenberg-Trace') ?? traceId,
      },
    });
  } catch (error) {
    return json(
      {
        error: error instanceof Error ? error.message : 'Gotenberg render failed.',
      },
      { status: 500 },
    );
  }
};

export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/health') {
      return json({
        ok: true,
        gotenbergConfigured: !!env.GOTENBERG_URL,
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

    return env.ASSETS.fetch(request);
  },
};
