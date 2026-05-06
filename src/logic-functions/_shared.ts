import { CoreApiClient } from 'twenty-client-sdk/core';

type LinksValue = {
  primaryLinkLabel: string;
  primaryLinkUrl: string;
  secondaryLinks: unknown[];
};

export type DealRecord = Record<string, any>;
export type ContractRecord = Record<string, any>;
export type PdfTemplateRecord = Record<string, any>;

export const env = (name: string, fallback?: string) => {
  const value = process.env[name] ?? fallback;

  if (!value) {
    throw new Error(`${name} is required`);
  }

  return value.replace(/\/$/, '');
};

export const core = () => new CoreApiClient();

export const asLinks = (label: string, url: string): LinksValue => ({
  primaryLinkLabel: label,
  primaryLinkUrl: url,
  secondaryLinks: [],
});

export const textFromRichText = (value: any) =>
  typeof value === 'string'
    ? value
    : value?.markdown ?? value?.body?.markdown ?? value?.blocknote ?? '';

export const firstEmail = (value: any): string | null => {
  if (typeof value === 'string') {
    return value;
  }

  return (
    value?.primaryEmail ??
    value?.primaryEmailAddress ??
    value?.emails?.[0] ??
    value?.[0] ??
    null
  );
};

export const money = (value: unknown, currency = 'EUR') => {
  const amount = Number(value ?? 0);

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(Number.isFinite(amount) ? amount : 0);
};

export const escapeHtml = (value: unknown) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
