import "src/front-components/runtime-shim";

import { useEffect, useState } from "react";
import { defineFrontComponent } from "twenty-sdk/define";
import { enqueueSnackbar, useRecordId } from "twenty-sdk/front-component";
import { CoreApiClient } from "twenty-client-sdk/core";

import { FRONT_COMPONENT } from "src/constants/universal-identifiers";
import Editor from "src/front-components/simple-code-editor";

type LinksValue = {
  primaryLinkLabel?: string | null;
  primaryLinkUrl?: string | null;
};

type PdfTemplate = {
  id: string;
  name?: string | null;
  kind?: "INVOICE" | "CONTRACT" | string | null;
  isActive?: boolean | null;
  htmlSource?: string | null;
  cssSource?: string | null;
  previewUrl?: LinksValue | null;
  lastPreviewedAt?: string | null;
  notes?: { markdown?: string | null } | string | null;
};

type Draft = {
  name: string;
  kind: "INVOICE" | "CONTRACT";
  isActive: boolean;
  htmlSource: string;
  cssSource: string;
  notes: string;
};

type EditorTab = "htmlSource" | "cssSource";

const placeholders = [
  "{{today}}",
  "{{invoiceNumber}}",
  "{{brand.name}}",
  "{{brand.contactName}}",
  "{{campaign.title}}",
  "{{creator.displayName}}",
  "{{creator.legalName}}",
  "{{deal.name}}",
  "{{deal.paymentTerms}}",
  "{{totals.brandPrice}}",
  "{{totals.creatorPayout}}",
  "{{totals.agencyMargin}}",
  "{{text.deliverables}}",
  "{{text.usageRights}}",
  "{{text.exclusivity}}",
  "{{text.revisionPolicy}}",
];

const readNotes = (notes: PdfTemplate["notes"]) => {
  if (typeof notes === "string") {
    return notes;
  }

  return notes?.markdown ?? "";
};

const toDraft = (template: PdfTemplate): Draft => ({
  name: template.name ?? "",
  kind: template.kind === "CONTRACT" ? "CONTRACT" : "INVOICE",
  isActive: !!template.isActive,
  htmlSource: template.htmlSource ?? "",
  cssSource: template.cssSource ?? "",
  notes: readNotes(template.notes),
});

const getPreviewHref = (template: PdfTemplate | null) =>
  template?.previewUrl?.primaryLinkUrl ?? null;

const getAccessToken = async () => {
  const api = (
    globalThis as {
      frontComponentHostCommunicationApi?: {
        requestAccessTokenRefresh?: () => Promise<string>;
      };
    }
  ).frontComponentHostCommunicationApi;

  return api?.requestAccessTokenRefresh?.();
};

const createClient = async () => {
  const token = await getAccessToken();

  return new CoreApiClient({
    url: `${window.location.origin}/graphql`,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
};

const TemplateEditor = () => {
  const recordId = useRecordId();
  const [template, setTemplate] = useState<PdfTemplate | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [activeTab, setActiveTab] = useState<EditorTab>("htmlSource");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplate = async () => {
    if (!recordId) {
      throw new Error("Open a PDF Template record to edit it.");
    }

    const client = await createClient();
    const result = (await client.query({
      pdfTemplate: {
        __args: { filter: { id: { eq: recordId } } },
        id: true,
        name: true,
        kind: true,
        isActive: true,
        htmlSource: true,
        cssSource: true,
        previewUrl: true,
        lastPreviewedAt: true,
        notes: { markdown: true },
      },
    } as any)) as { pdfTemplate?: PdfTemplate };

    if (!result.pdfTemplate) {
      throw new Error("PDF template record was not found.");
    }

    setTemplate(result.pdfTemplate);
    setDraft(toDraft(result.pdfTemplate));
  };

  useEffect(() => {
    setIsLoading(true);
    fetchTemplate()
      .catch((loadError: unknown) => {
        setError(
          loadError instanceof Error ? loadError.message : "Load failed"
        );
      })
      .finally(() => setIsLoading(false));
  }, [recordId]);

  const updateDraft = <Key extends keyof Draft>(
    key: Key,
    value: Draft[Key]
  ) => {
    setDraft((current) => (current ? { ...current, [key]: value } : current));
  };

  const remoteInput = <Element extends HTMLElement>(
    handler: React.FormEventHandler<Element>
  ) =>
    ({
      oninput: handler,
    }) as Record<string, React.FormEventHandler<Element>>;

  const remoteChange = <Element extends HTMLElement>(
    handler: React.FormEventHandler<Element>
  ) =>
    ({
      onchange: handler,
    }) as Record<string, React.FormEventHandler<Element>>;

  const saveTemplate = async () => {
    if (!template || !draft) {
      return null;
    }

    setIsSaving(true);
    setError(null);

    try {
      const client = await createClient();

      await client.mutation({
        updatePdfTemplate: {
          __args: {
            id: template.id,
            data: {
              name: draft.name,
              kind: draft.kind,
              isActive: draft.isActive,
              htmlSource: draft.htmlSource,
              cssSource: draft.cssSource,
              notes: { markdown: draft.notes },
            },
          },
          id: true,
        },
      } as any);

      await fetchTemplate();
      await enqueueSnackbar({
        message: "Template saved",
        variant: "success",
      });

      return template.id;
    } catch (saveError) {
      const message =
        saveError instanceof Error ? saveError.message : "Save failed";
      setError(message);
      await enqueueSnackbar({ message, variant: "error" });

      return null;
    } finally {
      setIsSaving(false);
    }
  };

  const renderPreview = async () => {
    const templateId = await saveTemplate();

    if (!templateId) {
      return;
    }

    setIsRendering(true);
    setError(null);

    try {
      const token = await getAccessToken();
      const response = await fetch("/s/pdf-template-preview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ templateId }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      await fetchTemplate();
      await enqueueSnackbar({
        message: "Preview rendered",
        variant: "success",
      });
    } catch (previewError) {
      const message =
        previewError instanceof Error ? previewError.message : "Render failed";
      setError(message);
      await enqueueSnackbar({ message, variant: "error" });
    } finally {
      setIsRendering(false);
    }
  };

  if (isLoading) {
    return (
      <div style={styles.emptyState}>
        <div style={styles.emptyTitle}>Loading PDF template</div>
      </div>
    );
  }

  if (!draft || !template) {
    return (
      <div style={styles.emptyState}>
        <div style={styles.emptyTitle}>PDF template unavailable</div>
        <div style={styles.emptyCopy}>{error ?? "Open a template record."}</div>
      </div>
    );
  }

  const previewHref = getPreviewHref(template);
  const activeSource = draft[activeTab];

  return (
    <div style={styles.shell}>
      {error ? <div style={styles.error}>{error}</div> : null}

      <div style={styles.metaBar}>
        <div style={styles.metaGrid}>
          <label style={styles.label}>
            Name
            <input
              value={draft.name}
              {...remoteInput<HTMLInputElement>((event) =>
                updateDraft("name", event.currentTarget.value)
              )}
              style={styles.input}
            />
          </label>
          <label style={styles.label}>
            Kind
            <select
              value={draft.kind}
              {...remoteChange<HTMLSelectElement>((event) =>
                updateDraft(
                  "kind",
                  event.currentTarget.value === "CONTRACT"
                    ? "CONTRACT"
                    : "INVOICE"
                )
              )}
              style={styles.input}
            >
              <option value="INVOICE">Invoice</option>
              <option value="CONTRACT">Contract</option>
            </select>
          </label>
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={draft.isActive}
              {...remoteChange<HTMLInputElement>((event) =>
                updateDraft("isActive", event.currentTarget.checked)
              )}
            />
            Active template
          </label>
        </div>

        <button
          type="button"
          onClick={saveTemplate}
          disabled={isSaving || isRendering}
          style={{
            ...styles.button,
          }}
        >
          {isSaving ? "Saving" : "Save"}
        </button>
      </div>

      <section style={styles.workspace}>
        <div style={styles.editorPanel}>
          <div style={styles.tabBar}>
            <button
              type="button"
              onClick={() => setActiveTab("htmlSource")}
              style={{
                ...styles.tabButton,
                ...(activeTab === "htmlSource" ? styles.tabButtonActive : {}),
              }}
            >
              HTML
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("cssSource")}
              style={{
                ...styles.tabButton,
                ...(activeTab === "cssSource" ? styles.tabButtonActive : {}),
              }}
            >
              CSS
            </button>
          </div>

          <Editor
            value={activeSource}
            onValueChange={(value) => updateDraft(activeTab, value)}
            padding={16}
            textareaId={`pdf-template-${activeTab}`}
            style={styles.codeEditor}
          />
        </div>

        <aside style={styles.sidePanel}>
          <div style={styles.previewHeader}>
            <div>
              <div style={styles.eyebrow}>Preview</div>
              <div style={styles.previewDate}>
                {template.lastPreviewedAt
                  ? new Date(template.lastPreviewedAt).toLocaleString()
                  : "Not rendered yet"}
              </div>
            </div>
            <div style={styles.previewActions}>
              {previewHref ? (
                <a href={previewHref} target="_blank" style={styles.link}>
                  Open PDF
                </a>
              ) : null}
              <button
                type="button"
                onClick={renderPreview}
                disabled={isSaving || isRendering}
                style={styles.primaryButton}
              >
                {isRendering ? "Rendering" : "Render Preview"}
              </button>
            </div>
          </div>

          <div style={styles.previewBox}>
            {previewHref ? (
              <iframe
                title="PDF preview"
                src={previewHref}
                style={styles.iframe}
              />
            ) : (
              <div style={styles.emptyCopy}>
                Render a preview to generate a Gotenberg PDF for this template.
              </div>
            )}
          </div>

          <div style={styles.placeholderPanel}>
            <div style={styles.eyebrow}>Placeholders</div>
            <div style={styles.placeholderList}>
              {placeholders.map((placeholder) => (
                <code key={placeholder} style={styles.placeholder}>
                  {placeholder}
                </code>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
};

const styles = {
  shell: {
    background: "#f7f3ec",
    color: "#1b1b18",
    display: "flex",
    flexDirection: "column" as const,
    fontFamily: "ui-sans-serif, system-ui, sans-serif",
    gap: 16,
    minHeight: 780,
    padding: 24,
  },
  eyebrow: {
    color: "#716b60",
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: 0,
    textTransform: "uppercase" as const,
  },
  button: {
    background: "#fffaf1",
    border: "1px solid #cfc7b8",
    borderRadius: 8,
    color: "#1b1b18",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 700,
    minHeight: 38,
    padding: "0 16px",
  },
  buttonDisabled: {
    cursor: "default",
    opacity: 0.45,
  },
  primaryButton: {
    background: "#205c53",
    border: "1px solid #205c53",
    borderRadius: 8,
    color: "#fff",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 800,
    minHeight: 38,
    padding: "0 16px",
  },
  error: {
    background: "#fff1f0",
    border: "1px solid #d94a38",
    borderRadius: 8,
    color: "#8a2418",
    padding: 12,
  },
  metaBar: {
    alignItems: "end",
    display: "grid",
    gap: 12,
    gridTemplateColumns: "minmax(0, 1fr) auto",
  },
  metaGrid: {
    alignItems: "end",
    display: "grid",
    gap: 12,
    gridTemplateColumns: "minmax(240px, 1fr) 180px 150px",
    minWidth: 0,
  },
  label: {
    color: "#3a372f",
    display: "grid",
    fontSize: 12,
    fontWeight: 800,
    gap: 6,
    minWidth: 0,
  },
  checkboxLabel: {
    alignItems: "center",
    color: "#3a372f",
    display: "flex",
    fontSize: 13,
    fontWeight: 800,
    gap: 8,
    minHeight: 38,
    whiteSpace: "nowrap" as const,
  },
  input: {
    background: "#fffdf8",
    border: "1px solid #cfc7b8",
    borderRadius: 8,
    color: "#1b1b18",
    font: "inherit",
    minHeight: 38,
    minWidth: 0,
    padding: "0 10px",
  },
  workspace: {
    display: "grid",
    flex: 1,
    gap: 16,
    gridTemplateColumns: "minmax(0, 1fr) minmax(340px, 38%)",
    minHeight: 610,
  },
  editorPanel: {
    background: "#fffaf1",
    border: "1px solid #d7d0c3",
    borderRadius: 8,
    display: "grid",
    gridTemplateRows: "48px minmax(0, 1fr)",
    minWidth: 0,
    overflow: "hidden",
  },
  tabBar: {
    alignItems: "center",
    background: "#ebe4d8",
    borderBottom: "1px solid #d7d0c3",
    display: "flex",
    gap: 6,
    padding: 8,
  },
  tabButton: {
    background: "transparent",
    border: "1px solid transparent",
    borderRadius: 7,
    color: "#5f594f",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 800,
    minHeight: 30,
    padding: "0 14px",
  },
  tabButtonActive: {
    background: "#fffaf1",
    borderColor: "#cfc7b8",
    color: "#1b1b18",
  },
  codeEditor: {
    background: "#fffdf8",
    color: "#1b1b18",
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
    fontSize: 13,
    lineHeight: 1.55,
    minHeight: "100%",
    height: "100%",
    overflow: "auto",
  },
  sidePanel: {
    display: "grid",
    gap: 12,
    gridTemplateRows: "auto minmax(320px, 1fr) auto",
    minWidth: 0,
  },
  previewHeader: {
    alignItems: "center",
    display: "flex",
    gap: 12,
    justifyContent: "space-between",
  },
  previewActions: {
    alignItems: "center",
    display: "flex",
    flexShrink: 0,
    gap: 8,
  },
  previewDate: {
    color: "#3a372f",
    fontSize: 12,
    marginTop: 2,
  },
  link: {
    color: "#205c53",
    fontSize: 13,
    fontWeight: 800,
    textDecoration: "none",
  },
  previewBox: {
    alignItems: "center",
    background: "#fffdf8",
    border: "1px solid #d6cfc3",
    borderRadius: 8,
    display: "flex",
    justifyContent: "center",
    overflow: "hidden",
  },
  iframe: {
    border: 0,
    height: "100%",
    width: "100%",
  },
  placeholderPanel: {
    background: "#fffaf1",
    border: "1px solid #d6cfc3",
    borderRadius: 8,
    padding: 12,
  },
  placeholderList: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: 6,
    marginTop: 10,
    maxHeight: 112,
    overflow: "auto",
  },
  placeholder: {
    background: "#e5ded2",
    borderRadius: 5,
    color: "#1b1b18",
    fontSize: 11,
    padding: "4px 6px",
  },
  emptyState: {
    alignItems: "center",
    background: "#f7f3ec",
    color: "#1b1b18",
    display: "grid",
    justifyItems: "center",
    minHeight: 420,
    padding: 24,
    textAlign: "center" as const,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 800,
  },
  emptyCopy: {
    color: "#6f6a60",
    fontSize: 13,
    maxWidth: 360,
  },
};

export default defineFrontComponent({
  universalIdentifier: FRONT_COMPONENT.pdfTemplateEditor,
  name: "PDF Template Editor",
  description: "Edit and render Gotenberg-backed PDF templates.",
  isHeadless: false,
  component: TemplateEditor,
});
