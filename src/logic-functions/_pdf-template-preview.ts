import {
  asLinks,
  convertHtmlToPdf,
  getPdfTemplate,
  pdfTemplatePreviewFileFieldId,
  updatePdfTemplate,
  uploadPdf,
} from 'src/logic-functions/_revenue-ops';
import type { CoreApiClient } from 'twenty-client-sdk/core';
import { contractHtml, invoiceHtml } from 'src/logic-functions/templates';

const sampleDeal = {
  id: 'sample-deal',
  name: 'Spring Creator Campaign',
  brandPrice: 2500,
  creatorPayout: 1500,
  agencyMargin: 1000,
  invoiceNumber: 'INV-PREVIEW',
  invoiceDueDate: '2026-05-20',
  paymentTerms: '50% upfront, 50% on campaign launch',
  deliverablesSummary: {
    markdown: '1 Instagram Reel, 3 Stories, usage for 30 days.',
  },
  usageRights: {
    markdown: 'Brand may reuse final content organically for 30 days.',
  },
  exclusivity: { markdown: 'No direct competitor promotion for 14 days.' },
  revisionPolicy: { markdown: 'One reasonable revision round is included.' },
  campaign: {
    title: 'Spring Launch',
    currencyCode: 'EUR',
    startDate: '2026-05-10',
    endDate: '2026-06-10',
    brand: {
      name: 'Acme Beauty',
      contactName: 'Sarah Client',
      contactEmail: { primaryEmail: 'sarah@example.com' },
    },
  },
  creator: {
    displayName: 'Maya Creator',
    legalName: 'Maya Creator LLC',
    contactEmail: { primaryEmail: 'maya@example.com' },
  },
};

const sampleContract = {
  id: 'sample-contract',
  title: 'Creator Agreement Preview',
  version: '1',
  contractType: 'LIGHT_AGREEMENT',
  signerType: 'CREATOR',
  deal: sampleDeal,
};

export const renderPdfTemplatePreview = async (
  client: CoreApiClient,
  templateId: string,
) => {
  const template = await getPdfTemplate(client, templateId);
  const kind = template.kind === 'CONTRACT' ? 'CONTRACT' : 'INVOICE';
  const html =
    kind === 'CONTRACT'
      ? contractHtml(sampleContract, template)
      : invoiceHtml(sampleDeal, template);
  const filename = `${template.name ?? kind.toLowerCase()}-preview.pdf`;
  const pdf = await convertHtmlToPdf(html, filename);
  const file = await uploadPdf(
    client,
    pdf,
    filename,
    pdfTemplatePreviewFileFieldId(),
  );

  await updatePdfTemplate(client, template.id, {
    previewUrl: asLinks('PDF Preview', file.url),
    lastPreviewedAt: new Date().toISOString(),
  });

  return { templateId: template.id, kind, fileUrl: file.url };
};
