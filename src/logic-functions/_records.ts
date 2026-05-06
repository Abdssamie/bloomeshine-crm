import { CoreApiClient } from 'twenty-client-sdk/core';

import { OBJECT } from 'src/constants/universal-identifiers';
import { fieldId } from 'src/objects/_helpers';
import type {
  ContractRecord,
  DealRecord,
  PdfTemplateRecord,
} from 'src/logic-functions/_shared';

export const getDeal = async (client: CoreApiClient, dealId: string) => {
  const result = (await client.query({
    deal: {
      __args: { filter: { id: { eq: dealId } } },
      id: true,
      name: true,
      brandPrice: true,
      creatorPayout: true,
      agencyMargin: true,
      invoiceNumber: true,
      invoiceDueDate: true,
      paymentTerms: true,
      deliverablesSummary: { markdown: true },
      usageRights: { markdown: true },
      exclusivity: { markdown: true },
      revisionPolicy: { markdown: true },
      campaign: {
        id: true,
        title: true,
        currencyCode: true,
        startDate: true,
        endDate: true,
        brand: {
          id: true,
          name: true,
          website: { primaryLinkUrl: true },
          billingAddress: true,
          contactName: true,
          contactEmail: {
            primaryEmail: true,
          },
        },
      },
      creator: {
        id: true,
        displayName: true,
        legalName: true,
        contactEmail: {
          primaryEmail: true,
        },
        profileUrl: { primaryLinkUrl: true },
      },
    },
  } as any)) as { deal?: DealRecord };

  if (!result.deal) {
    throw new Error(`Deal ${dealId} not found`);
  }

  return result.deal;
};

export const getContract = async (
  client: CoreApiClient,
  contractId: string,
) => {
  const result = (await client.query({
    contract: {
      __args: { filter: { id: { eq: contractId } } },
      id: true,
      title: true,
      contractType: true,
      status: true,
      signerType: true,
      signerNameOverride: true,
      signerEmailOverride: {
        primaryEmail: true,
      },
      version: true,
      notes: { markdown: true },
      deal: {
        id: true,
        name: true,
        brandPrice: true,
        creatorPayout: true,
        agencyMargin: true,
        paymentTerms: true,
        deliverablesSummary: { markdown: true },
        timelines: { markdown: true },
        usageRights: { markdown: true },
        exclusivity: { markdown: true },
        revisionPolicy: { markdown: true },
        campaign: {
          id: true,
          title: true,
          currencyCode: true,
          brand: {
            id: true,
            name: true,
            contactName: true,
            contactEmail: {
              primaryEmail: true,
            },
          },
        },
        creator: {
          id: true,
          displayName: true,
          legalName: true,
          contactEmail: {
            primaryEmail: true,
          },
        },
      },
    },
  } as any)) as { contract?: ContractRecord };

  if (!result.contract) {
    throw new Error(`Contract ${contractId} not found`);
  }

  return result.contract;
};

const recordsFromConnection = (value: any): PdfTemplateRecord[] => {
  if (Array.isArray(value)) {
    return value;
  }

  if (Array.isArray(value?.edges)) {
    return value.edges.map((edge: any) => edge.node).filter(Boolean);
  }

  if (Array.isArray(value?.nodes)) {
    return value.nodes;
  }

  return [];
};

export const getPdfTemplate = async (
  client: CoreApiClient,
  templateId: string,
) => {
  const result = (await client.query({
    pdfTemplate: {
      __args: { filter: { id: { eq: templateId } } },
      id: true,
      name: true,
      kind: true,
      isActive: true,
      htmlSource: true,
      cssSource: true,
    },
  } as any)) as { pdfTemplate?: PdfTemplateRecord };

  if (!result.pdfTemplate) {
    throw new Error(`PDF template ${templateId} not found`);
  }

  return result.pdfTemplate;
};

export const getActivePdfTemplate = async (
  client: CoreApiClient,
  kind: 'INVOICE' | 'CONTRACT',
) => {
  const result = (await client.query({
    pdfTemplates: {
      __args: {
        filter: {
          kind: { eq: kind },
          isActive: { eq: true },
        },
      },
      edges: {
        node: {
          id: true,
          name: true,
          kind: true,
          isActive: true,
          htmlSource: true,
          cssSource: true,
        },
      },
    },
  } as any)) as { pdfTemplates?: unknown };

  return recordsFromConnection(result.pdfTemplates)[0] ?? null;
};

export const findPdfTemplateByName = async (
  client: CoreApiClient,
  name: string,
) => {
  const result = (await client.query({
    pdfTemplates: {
      __args: {
        filter: {
          name: { eq: name },
        },
      },
      edges: {
        node: {
          id: true,
          name: true,
          kind: true,
          isActive: true,
        },
      },
    },
  } as any)) as { pdfTemplates?: unknown };

  return recordsFromConnection(result.pdfTemplates)[0] ?? null;
};

export const updateDeal = async (
  client: CoreApiClient,
  id: string,
  data: Record<string, unknown>,
) =>
  client.mutation({
    updateDeal: {
      __args: { id, data },
      id: true,
    },
  } as any);

export const updateContract = async (
  client: CoreApiClient,
  id: string,
  data: Record<string, unknown>,
) =>
  client.mutation({
    updateContract: {
      __args: { id, data },
      id: true,
    },
  } as any);

export const updatePdfTemplate = async (
  client: CoreApiClient,
  id: string,
  data: Record<string, unknown>,
) =>
  client.mutation({
    updatePdfTemplate: {
      __args: { id, data },
      id: true,
    },
  } as any);

export const createPdfTemplate = async (
  client: CoreApiClient,
  data: Record<string, unknown>,
) =>
  client.mutation({
    createPdfTemplate: {
      __args: { data },
      id: true,
    },
  } as any);

export const invoiceFileFieldId = () => fieldId(OBJECT.deal, 'invoiceFile');
export const draftFileFieldId = () => fieldId(OBJECT.contract, 'draftFile');
export const signedFileFieldId = () => fieldId(OBJECT.contract, 'signedFile');
export const pdfTemplatePreviewFileFieldId = () =>
  fieldId(OBJECT.pdfTemplate, 'previewFile');
