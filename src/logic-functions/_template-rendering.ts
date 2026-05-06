import { escapeHtml } from 'src/logic-functions/_shared';

export const renderTemplate = (
  htmlBody: string,
  variables: Record<string, unknown>,
  css = '',
) => {
  validateTemplateVariables(htmlBody, variables);
  validateTemplateVariables(css, variables);

  const renderedBody = htmlBody.replace(
    /\{\{\s*([a-zA-Z0-9_.]+)\s*\}\}/g,
    (_match, key: string) => escapeHtml(readPath(variables, key)),
  );

  return `<!doctype html>
<html>
<head><meta charset="utf-8"><style>${css}</style></head>
<body>${renderedBody}</body>
</html>`;
};

const extractTemplateVariables = (template: string) =>
  Array.from(template.matchAll(/\{\{\s*([a-zA-Z0-9_.]+)\s*\}\}/g)).map(
    (match) => match[1],
  );

export const validateTemplateVariables = (
  template: string,
  variables: Record<string, unknown>,
) => {
  const unknownVariables = extractTemplateVariables(template).filter(
    (key) => !hasPath(variables, key),
  );

  if (unknownVariables.length > 0) {
    throw new Error(
      `Unknown PDF template variables: ${Array.from(new Set(unknownVariables)).join(', ')}`,
    );
  }
};

const hasPath = (source: Record<string, unknown>, path: string) =>
  path.split('.').every((key, index, keys) => {
    const parentPath = keys.slice(0, index).join('.');
    const parent = parentPath ? readPath(source, parentPath) : source;

    return !!parent && typeof parent === 'object' && key in parent;
  });

const readPath = (source: Record<string, unknown>, path: string) =>
  path.split('.').reduce<unknown>((value, key) => {
    if (!value || typeof value !== 'object') {
      return '';
    }

    return (value as Record<string, unknown>)[key] ?? '';
  }, source);
