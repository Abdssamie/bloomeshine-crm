import * as React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Link,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  useParams
} from '@tanstack/react-router';

import './styles/app.css';

const defaultHtml = `<section class="document">
  <header class="masthead">
    <p class="eyebrow">Influencer Marketing Agreement</p>
    <h1>{{contract.title}}</h1>
    <p>Version {{contract.version}} · {{today}}</p>
  </header>

  <h2>Parties</h2>
  <table>
    <tr><th>Brand</th><td>{{brand.name}}</td></tr>
    <tr><th>Creator</th><td>{{creator.legalName}}</td></tr>
    <tr><th>Campaign</th><td>{{campaign.title}}</td></tr>
  </table>

  <h2>Commercial Terms</h2>
  <table>
    <tr><th>Brand Price</th><td>{{totals.brandPrice}}</td></tr>
    <tr><th>Creator Payout</th><td>{{totals.creatorPayout}}</td></tr>
    <tr><th>Payment Terms</th><td>{{deal.paymentTerms}}</td></tr>
  </table>

  <h2>Deliverables</h2>
  <p>{{text.deliverables}}</p>

  <h2>Usage Rights</h2>
  <p>{{text.usageRights}}</p>
</section>`;

const defaultCss = `body {
  color: #1d1b16;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 13px;
  line-height: 1.5;
  margin: 0;
}

.document {
  padding: 42px;
}

.masthead {
  border-bottom: 2px solid #1f5f56;
  margin-bottom: 28px;
  padding-bottom: 18px;
}

.eyebrow {
  color: #1f5f56;
  font-family: Arial, sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
}

h1 {
  font-size: 28px;
  line-height: 1.15;
  margin: 0 0 8px;
}

h2 {
  color: #1f5f56;
  font-size: 17px;
  margin: 24px 0 8px;
}

table {
  border-collapse: collapse;
  margin: 8px 0 18px;
  width: 100%;
}

th,
td {
  border: 1px solid #d5cec1;
  padding: 8px 10px;
  text-align: left;
  vertical-align: top;
}

th {
  background: #f3eee5;
  width: 34%;
}`;

const placeholders = [
  '{{today}}',
  '{{contract.title}}',
  '{{contract.version}}',
  '{{brand.name}}',
  '{{creator.legalName}}',
  '{{campaign.title}}',
  '{{deal.paymentTerms}}',
  '{{totals.brandPrice}}',
  '{{totals.creatorPayout}}',
  '{{text.deliverables}}',
  '{{text.usageRights}}',
];

type PdfTemplate = {
  id: string;
  name?: string | null;
  kind?: 'INVOICE' | 'CONTRACT' | null;
  isActive?: boolean | null;
  htmlSource?: string | null;
  cssSource?: string | null;
};

const escapeSource = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');

const highlightTemplateTokens = (value: string) =>
  value.replace(
    /(\{\{[^}]+\}\})/g,
    '<span class="token placeholder-token">$1</span>',
  );

const highlightHtml = (value: string) => {
  let highlighted = escapeSource(value);

  highlighted = highlighted.replace(
    /(&lt;\/?)([a-zA-Z][\w-]*)([^&]*?)(\/?&gt;)/g,
    (_match, opening: string, tag: string, attrs: string, closing: string) => {
      const highlightedAttrs = attrs.replace(
        /(\s)([a-zA-Z_:][-a-zA-Z0-9_:.]*)(=)("[^"]*"|'[^']*')/g,
        '$1<span class="token attr-token">$2</span>$3<span class="token string-token">$4</span>',
      );

      return `<span class="token bracket-token">${opening}</span><span class="token tag-token">${tag}</span>${highlightedAttrs}<span class="token bracket-token">${closing}</span>`;
    },
  );

  return highlightTemplateTokens(highlighted);
};

const highlightCss = (value: string) => {
  let highlighted = escapeSource(value);

  highlighted = highlighted.replace(
    /([.#]?[a-zA-Z][^{\n]+)(\s*\{)/g,
    '<span class="token selector-token">$1</span>$2',
  );
  highlighted = highlighted.replace(
    /([a-zA-Z-]+)(\s*:)/g,
    '<span class="token property-token">$1</span>$2',
  );
  highlighted = highlighted.replace(
    /(:\s*)([^;\n}]+)(;?)/g,
    '$1<span class="token value-token">$2</span>$3',
  );

  return highlightTemplateTokens(highlighted);
};

type HighlightedTextareaProps = {
  ariaLabel: string;
  language: 'html' | 'css';
  onChange: (value: string) => void;
  value: string;
};

const HighlightedTextarea = ({
  ariaLabel,
  language,
  onChange,
  value,
}: HighlightedTextareaProps) => {
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const highlightRef = React.useRef<HTMLPreElement | null>(null);

  const syncScroll = () => {
    if (!textareaRef.current || !highlightRef.current) {
      return;
    }

    highlightRef.current.scrollTop = textareaRef.current.scrollTop;
    highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
  };

  const highlightedSource =
    language === 'html' ? highlightHtml(value) : highlightCss(value);

  return (
    <div className="highlight-editor">
      <pre
        ref={highlightRef}
        aria-hidden="true"
        className="highlight-layer"
        dangerouslySetInnerHTML={{
          __html: `${highlightedSource}\n`,
        }}
      />
      <textarea
        ref={textareaRef}
        aria-label={ariaLabel}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onScroll={syncScroll}
        spellCheck={false}
      />
    </div>
  );
};

const Root = () => (
  <>
    <Outlet />
  </>
);

const TemplatesPage = () => {
  const [templates, setTemplates] = React.useState<PdfTemplate[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetch('/api/templates')
      .then((res) => res.json() as Promise<{ templates?: PdfTemplate[]; error?: string }>)
      .then((payload) => {
        if (payload.error) throw new Error(payload.error);
        setTemplates(payload.templates ?? []);
      })
      .catch((e) => setError(e.message))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <main className="app-shell help-page">
      <header className="topbar">
        <div>
          <p className="kicker">CRM PDF Templates</p>
          <h1>Select a Template</h1>
        </div>
        <Link to="/help" className="secondary-button">
          Help
        </Link>
      </header>
      {error && <div className="error-banner" style={{marginTop: 16}}>{error}</div>}
      {isLoading ? (
        <p style={{marginTop: 16}}>Loading templates...</p>
      ) : (
        <div className="template-list" style={{ marginTop: 24, display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {templates.map(t => (
            <Link key={t.id} to="/editor/$templateId" params={{ templateId: t.id }} style={{ textDecoration: 'none' }}>
              <div className="setup-grid article" style={{ background: '#fffaf1', border: '1px solid #d5cbbb', borderRadius: 8, padding: 16, color: '#3a352d', height: '100%' }}>
                <h3 style={{ margin: '0 0 8px', fontSize: 18 }}>{t.name || 'Unnamed Template'}</h3>
                <p style={{ margin: 0, fontSize: 13, color: '#6f675a' }}>
                  {t.kind} {t.isActive ? '• Active' : ''}
                </p>
              </div>
            </Link>
          ))}
          {templates.length === 0 && <p>No templates found.</p>}
        </div>
      )}
    </main>
  );
};

const EditorPage = () => {
  const { templateId } = useParams({ strict: false });
  const [title, setTitle] = React.useState('Default Contract');
  const [kind, setKind] = React.useState<'INVOICE' | 'CONTRACT'>('CONTRACT');
  const [isActive, setIsActive] = React.useState(false);
  const [html, setHtml] = React.useState(defaultHtml);
  const [css, setCss] = React.useState(defaultCss);
  const [activeEditorTab, setActiveEditorTab] = React.useState<'html' | 'css'>('html');
  const [pdfUrl, setPdfUrl] = useStateWithCleanup<string | null>(null);
  const [isLoadingTemplate, setIsLoadingTemplate] = useStoredFlag(false);
  const [isSaving, setIsSaving] = useStoredFlag(false);
  const [isDirty, setIsDirty] = React.useState(false);
  const [isRendering, setIsRendering] = useStoredFlag(false);
  const [error, setError] = useStoredFlag<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const applyTemplate = React.useCallback(
    (template: PdfTemplate) => {
      setTitle(template.name ?? '');
      setKind(template.kind === 'INVOICE' ? 'INVOICE' : 'CONTRACT');
      setIsActive(Boolean(template.isActive));
      setHtml(template.htmlSource ?? defaultHtml);
      setCss(template.cssSource ?? defaultCss);
      setIsDirty(false);
      setPdfUrl(null);
    },
    [setPdfUrl],
  );

  const loadTemplate = async (id: string) => {
    if (!id) return;
    setIsLoadingTemplate(true);
    setError(null);
    try {
      const response = await fetch(`/api/templates/${encodeURIComponent(id)}`);
      const payload = (await response.json()) as { template?: PdfTemplate; error?: string };
      if (!response.ok || !payload.template) {
        throw new Error(payload.error ?? 'Failed to load PDF template.');
      }
      applyTemplate(payload.template);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load.');
    } finally {
      setIsLoadingTemplate(false);
    }
  };

  React.useEffect(() => {
    if (templateId) {
      loadTemplate(templateId as string);
    }
  }, [templateId]);

  const updateTitle = (value: string) => {
    setTitle(value);
    setIsDirty(true);
  };

  const updateHtml = (value: string) => {
    setHtml(value);
    setIsDirty(true);
  };

  const updateCss = (value: string) => {
    setCss(value);
    setIsDirty(true);
  };

  const save = async () => {
    if (!templateId) return;
    setIsSaving(true);
    setError(null);
    try {
      const response = await fetch(`/api/templates/${encodeURIComponent(templateId as string)}`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name: title, kind, isActive, htmlSource: html, cssSource: css }),
      });
      const payload = (await response.json()) as { template?: PdfTemplate; error?: string };
      if (!response.ok || !payload.template) {
        throw new Error(payload.error ?? 'Failed to save PDF template.');
      }
      applyTemplate(payload.template);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Failed to save.');
    } finally {
      setIsSaving(false);
    }
  };

  const render = async () => {
    setIsRendering(true);
    setError(null);
    try {
      const response = await fetch('/api/render', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ title, html, css }),
      });
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          error?: string;
          details?: string;
        } | null;
        throw new Error([payload?.error, payload?.details].filter(Boolean).join(' ') || 'Render failed.');
      }
      const blob = await response.blob();
      setPdfUrl(URL.createObjectURL(blob));
    } catch (renderError) {
      setError(renderError instanceof Error ? renderError.message : 'Render failed.');
    } finally {
      setIsRendering(false);
    }
  };

  return (
    <div className="editor-shell">
      {error ? <div className="error-banner">{error}</div> : null}

      <header className="editor-topbar">
        <Link to="/" className="back-link">
          &larr; Back
        </Link>
        
        <input
          className="title-input"
          value={title}
          onChange={(event) => updateTitle(event.target.value)}
          placeholder="Template name"
        />

        <select
          className="minimal-select"
          value={kind}
          onChange={(event) => {
            setKind(event.target.value === 'INVOICE' ? 'INVOICE' : 'CONTRACT');
            setIsDirty(true);
          }}
        >
          <option value="INVOICE">Invoice</option>
          <option value="CONTRACT">Contract</option>
        </select>

        <label className="minimal-check">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(event) => {
              setIsActive(event.target.checked);
              setIsDirty(true);
            }}
          />
          <span>Active</span>
        </label>

        <div className="spacer" />

        <button type="button" onClick={save} disabled={!templateId || isSaving || isLoadingTemplate || !isDirty} className="primary-button">
          {isSaving ? 'Saving...' : 'Save to CRM'}
        </button>
        <button type="button" onClick={render} disabled={isRendering} className="primary-button">
          {isRendering ? 'Rendering...' : 'Render PDF'}
        </button>
        <button type="button" onClick={() => setIsSidebarOpen(v => !v)} className="secondary-button toggle-sidebar-btn">
          {isSidebarOpen ? 'Hide Placeholders' : 'Show Placeholders'}
        </button>
      </header>

      <div className={`layout ${isSidebarOpen ? '' : 'sidebar-closed'}`}>
        <section className="editor-panel">
          <div className="tabbed-editor">
            <div className="tab-list" role="tablist" aria-label="Template source">
              <button
                type="button"
                role="tab"
                aria-selected={activeEditorTab === 'html'}
                className={activeEditorTab === 'html' ? 'tab active' : 'tab'}
                onClick={() => setActiveEditorTab('html')}
              >
                HTML
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeEditorTab === 'css'}
                className={activeEditorTab === 'css' ? 'tab active' : 'tab'}
                onClick={() => setActiveEditorTab('css')}
              >
                CSS
              </button>
            </div>

            {activeEditorTab === 'html' ? (
              <div className="code-field">
                <HighlightedTextarea ariaLabel="HTML source" language="html" value={html} onChange={updateHtml} />
              </div>
            ) : (
              <div className="code-field">
                <HighlightedTextarea ariaLabel="CSS source" language="css" value={css} onChange={updateCss} />
              </div>
            )}
          </div>
        </section>

        <section className="preview-panel">
          <div className="pdf-frame">
            {pdfUrl ? (
              <iframe title="PDF preview" src={pdfUrl} />
            ) : (
              <div className="empty-preview">
                <span>PDF preview appears here after rendering.</span>
              </div>
            )}
          </div>
        </section>

        <aside className="sidebar-panel">
          <div className="sidebar-inner">
            <p className="kicker">Placeholders</p>
            <div className="placeholder-list">
              {placeholders.map((placeholder) => (
                <code key={placeholder}>{placeholder}</code>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

const HelpPage = () => (
  <main className="app-shell help-page">
    <header className="topbar">
      <div>
        <p className="kicker">Deployment</p>
        <h1>Cloudflare Worker Setup</h1>
      </div>
      <Link to="/" className="secondary-button">
        Templates
      </Link>
    </header>

    <section className="setup-grid">
      <article>
        <h2>Required variable</h2>
        <pre>{`# wrangler.jsonc
"vars": {
  "GOTENBERG_URL": "https://gotenberg.example.com"
}`}</pre>
        <p>GOTENBERG_URL is normal Worker configuration, not a secret.</p>
      </article>
      <article>
        <h2>Auth secrets</h2>
        <pre>{`yarn pdf:secret:auth:username
yarn pdf:secret:auth:password`}</pre>
        <p>Only the Gotenberg API basic auth username and password are secrets.</p>
      </article>
      <article>
        <h2>Deploy</h2>
        <pre>yarn deploy</pre>
        <p>The Worker serves the SPA and proxies /api/render to Gotenberg.</p>
      </article>
    </section>
  </main>
);

const rootRoute = createRootRoute({ component: Root });
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: TemplatesPage,
});
const editorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/editor/$templateId',
  component: EditorPage,
});
const helpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/help',
  component: HelpPage,
});

const router = createRouter({
  routeTree: rootRoute.addChildren([indexRoute, editorRoute, helpRoute]),
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function useStoredState(key: string, initialValue: string) {
  const [value, setValue] = React.useState(() => {
    if (typeof localStorage === 'undefined') {
      return initialValue;
    }

    return localStorage.getItem(key) ?? initialValue;
  });

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [key, value]);

  return [value, setValue] as const;
}

function useStoredFlag<T>(initialValue: T) {
  return React.useState<T>(initialValue);
}

function useStateWithCleanup<T extends string | null>(initialValue: T) {
  const [value, setValue] = React.useState<T>(initialValue);
  const previousValueRef = React.useRef<T>(initialValue);

  const setManagedValue = React.useCallback((nextValue: T) => {
    if (previousValueRef.current) {
      URL.revokeObjectURL(previousValueRef.current);
    }

    previousValueRef.current = nextValue;
    setValue(nextValue);
  }, []);

  React.useEffect(
    () => () => {
      if (previousValueRef.current) {
        URL.revokeObjectURL(previousValueRef.current);
      }
    },
    [],
  );

  return [value, setManagedValue] as const;
}

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
