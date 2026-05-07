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

const EditorPage = () => {
  const [title, setTitle] = useStoredState('ima-pdf-title', 'Default Contract');
  const [html, setHtml] = useStoredState('ima-pdf-html', defaultHtml);
  const [css, setCss] = useStoredState('ima-pdf-css', defaultCss);
  const [activeEditorTab, setActiveEditorTab] = React.useState<'html' | 'css'>(
    'html',
  );
  const [pdfUrl, setPdfUrl] = useStateWithCleanup<string | null>(null);
  const [isRendering, setIsRendering] = useStoredFlag(false);
  const [error, setError] = useStoredFlag<string | null>(null);

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

        throw new Error(
          [payload?.error, payload?.details].filter(Boolean).join(' ') ||
            'Render failed.',
        );
      }

      const blob = await response.blob();
      setPdfUrl(URL.createObjectURL(blob));
    } catch (renderError) {
      setError(
        renderError instanceof Error ? renderError.message : 'Render failed.',
      );
    } finally {
      setIsRendering(false);
    }
  };

  return (
    <main className="app-shell">
      {error ? <div className="error-banner">{error}</div> : null}

      <section className="layout">
        <section className="editor-panel">
          <label className="field">
            <span>Template name</span>
            <input value={title} onChange={(event) => setTitle(event.target.value)} />
          </label>

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
                <HighlightedTextarea
                  ariaLabel="HTML source"
                  language="html"
                  value={html}
                  onChange={setHtml}
                />
              </div>
            ) : (
              <div className="code-field">
                <HighlightedTextarea
                  ariaLabel="CSS source"
                  language="css"
                  value={css}
                  onChange={setCss}
                />
              </div>
            )}
          </div>
        </section>

        <aside className="preview-panel">
          <div className="preview-header">
            <div>
              <p className="kicker">Preview</p>
              <h2>Gotenberg output</h2>
            </div>
            {pdfUrl ? (
              <a href={pdfUrl} download={`${title || 'template'}.pdf`}>
                Download
              </a>
            ) : null}
            <Link to="/help" className="secondary-button">
              Setup
            </Link>
            <button onClick={render} disabled={isRendering}>
              {isRendering ? 'Rendering' : 'Render PDF'}
            </button>
          </div>

          <div className="pdf-frame">
            {pdfUrl ? (
              <iframe title="PDF preview" src={pdfUrl} />
            ) : (
              <div className="empty-preview">
                <span>PDF preview appears here after rendering.</span>
              </div>
            )}
          </div>

          <div className="placeholder-card">
            <p className="kicker">Placeholders</p>
            <div className="placeholder-list">
              {placeholders.map((placeholder) => (
                <code key={placeholder}>{placeholder}</code>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </main>
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
        Editor
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
  component: EditorPage,
});
const helpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/help',
  component: HelpPage,
});

const router = createRouter({
  routeTree: rootRoute.addChildren([indexRoute, helpRoute]),
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
