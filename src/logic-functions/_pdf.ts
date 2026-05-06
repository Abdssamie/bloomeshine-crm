import { CoreApiClient } from "twenty-client-sdk/core";

import { env } from "src/logic-functions/_shared";

export const convertHtmlToPdf = async (html: string, filename: string) => {
  const gotenbergUrl = env("GOTENBERG_URL");
  const form = new FormData();

  form.append("files", new Blob([html], { type: "text/html" }), "index.html");

  const response = await fetch(`${gotenbergUrl}/forms/chromium/convert/html`, {
    method: "POST",
    body: form,
  });

  if (!response.ok) {
    throw new Error(
      `Gotenberg failed for ${filename}: ${
        response.status
      } ${await response.text()}`
    );
  }

  return Buffer.from(await response.arrayBuffer());
};

export const uploadPdf = async (
  client: CoreApiClient,
  pdf: Buffer,
  filename: string,
  fieldUniversalIdentifier: string
) =>
  client.uploadFile(pdf, filename, "application/pdf", fieldUniversalIdentifier);
