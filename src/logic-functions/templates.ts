import {
  DealRecord,
  ContractRecord,
  PdfTemplateRecord,
  escapeHtml,
  money,
  renderTemplate,
  textFromRichText,
} from 'src/logic-functions/_revenue-ops';

const baseStyles = `
  body { color: #111827; font-family: Arial, sans-serif; font-size: 13px; line-height: 1.45; margin: 40px; }
  h1 { font-size: 28px; margin: 0 0 24px; }
  h2 { border-bottom: 1px solid #e5e7eb; font-size: 15px; margin: 26px 0 10px; padding-bottom: 6px; }
  table { border-collapse: collapse; width: 100%; }
  th, td { border-bottom: 1px solid #e5e7eb; padding: 10px 0; text-align: left; vertical-align: top; }
  th { color: #6b7280; font-size: 11px; text-transform: uppercase; }
  .grid { display: grid; gap: 24px; grid-template-columns: 1fr 1fr; }
  .muted { color: #6b7280; }
  .total { font-size: 18px; font-weight: 700; }
  .signature { border-top: 1px solid #111827; margin-top: 56px; padding-top: 8px; width: 280px; }
`;

export const defaultInvoiceTemplate = {
  htmlSource: `<h1>Invoice {{invoiceNumber}}</h1>

<div class="grid">
  <section>
    <div class="muted">Bill To</div>
    <strong>{{brand.name}}</strong><br>
    {{brand.contactName}}
  </section>
  <section>
    <div class="muted">Invoice Details</div>
    <div>Issued: {{today}}</div>
    <div>Due: {{deal.invoiceDueDate}}</div>
    <div>Terms: {{deal.paymentTerms}}</div>
  </section>
</div>

<h2>Campaign</h2>
<table>
  <tr><th>Campaign</th><td>{{campaign.title}}</td></tr>
  <tr><th>Deal</th><td>{{deal.name}}</td></tr>
  <tr><th>Creator</th><td>{{creator.displayName}}</td></tr>
</table>

<h2>Charges</h2>
<table>
  <thead><tr><th>Description</th><th>Amount</th></tr></thead>
  <tbody>
    <tr>
      <td>Influencer marketing campaign fee</td>
      <td>{{totals.brandPrice}}</td>
    </tr>
    <tr>
      <td class="total">Total</td>
      <td class="total">{{totals.brandPrice}}</td>
    </tr>
  </tbody>
</table>`,
  cssSource: baseStyles,
};

export const defaultContractTemplate = {
  htmlSource: `<h1>{{contract.title}}</h1>
<p class="muted">Version {{contract.version}}</p>

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

<h2>Exclusivity</h2>
<p>{{text.exclusivity}}</p>

<h2>Revision Policy</h2>
<p>{{text.revisionPolicy}}</p>

<div class="signature">Signer signature</div>`,
  cssSource: baseStyles,
};

const templateText = (value: unknown) =>
  typeof value === 'string' ? value.trim() : '';

export const invoiceVariables = (deal: DealRecord) => {
  const campaign = deal.campaign ?? {};
  const brand = campaign.brand ?? {};
  const creator = deal.creator ?? {};
  const currency = campaign.currencyCode ?? 'EUR';
  const invoiceNumber = deal.invoiceNumber ?? `INV-${deal.id.slice(0, 8)}`;

  return {
    today: new Date().toISOString().slice(0, 10),
    invoiceNumber,
    currency,
    deal,
    campaign,
    brand,
    creator,
    totals: {
      brandPrice: money(deal.brandPrice, currency),
      creatorPayout: money(deal.creatorPayout, currency),
      agencyMargin: money(deal.agencyMargin, currency),
    },
  };
};

export const contractVariables = (contract: ContractRecord) => {
  const deal = contract.deal ?? {};
  const campaign = deal.campaign ?? {};
  const brand = campaign.brand ?? {};
  const creator = deal.creator ?? {};
  const currency = campaign.currencyCode ?? 'EUR';

  return {
    today: new Date().toISOString().slice(0, 10),
    currency,
    contract,
    deal,
    campaign,
    brand,
    creator,
    totals: {
      brandPrice: money(deal.brandPrice, currency),
      creatorPayout: money(deal.creatorPayout, currency),
      agencyMargin: money(deal.agencyMargin, currency),
    },
    text: {
      deliverables: textFromRichText(deal.deliverablesSummary),
      usageRights: textFromRichText(deal.usageRights),
      exclusivity: textFromRichText(deal.exclusivity),
      revisionPolicy: textFromRichText(deal.revisionPolicy),
    },
  };
};

export const invoiceHtml = (
  deal: DealRecord,
  template?: PdfTemplateRecord | null,
) => {
  const variables = invoiceVariables(deal);
  const htmlBody = templateText(template?.htmlSource);

  if (htmlBody) {
    return renderTemplate(
      htmlBody,
      variables,
      templateText(template?.cssSource),
    );
  }

  const { campaign, brand, creator, currency, invoiceNumber } = variables;

  return `<!doctype html>
<html>
<head><meta charset="utf-8"><style>${baseStyles}</style></head>
<body>
  <h1>Invoice ${escapeHtml(invoiceNumber)}</h1>
  <div class="grid">
    <section>
      <div class="muted">Bill To</div>
      <strong>${escapeHtml(brand.name)}</strong><br>
      ${escapeHtml(brand.contactName ?? '')}
    </section>
    <section>
      <div class="muted">Invoice Details</div>
      <div>Issued: ${escapeHtml(new Date().toISOString().slice(0, 10))}</div>
      <div>Due: ${escapeHtml(deal.invoiceDueDate ?? '')}</div>
      <div>Terms: ${escapeHtml(deal.paymentTerms ?? '')}</div>
    </section>
  </div>

  <h2>Campaign</h2>
  <table>
    <tr><th>Campaign</th><td>${escapeHtml(campaign.title)}</td></tr>
    <tr><th>Deal</th><td>${escapeHtml(deal.name)}</td></tr>
    <tr><th>Creator</th><td>${escapeHtml(creator.displayName ?? creator.legalName)}</td></tr>
  </table>

  <h2>Charges</h2>
  <table>
    <thead><tr><th>Description</th><th>Amount</th></tr></thead>
    <tbody>
      <tr>
        <td>Influencer marketing campaign fee</td>
        <td>${escapeHtml(money(deal.brandPrice, currency))}</td>
      </tr>
      <tr>
        <td class="total">Total</td>
        <td class="total">${escapeHtml(money(deal.brandPrice, currency))}</td>
      </tr>
    </tbody>
  </table>
</body>
</html>`;
};

export const contractHtml = (
  contract: ContractRecord,
  template?: PdfTemplateRecord | null,
) => {
  const variables = contractVariables(contract);
  const htmlBody = templateText(template?.htmlSource);

  if (htmlBody) {
    return renderTemplate(
      htmlBody,
      variables,
      templateText(template?.cssSource),
    );
  }

  const { deal, campaign, brand, creator, currency } = variables;

  return `<!doctype html>
<html>
<head><meta charset="utf-8"><style>${baseStyles}</style></head>
<body>
  <h1>${escapeHtml(contract.title)}</h1>
  <p class="muted">Version ${escapeHtml(contract.version ?? '1')}</p>

  <h2>Parties</h2>
  <table>
    <tr><th>Brand</th><td>${escapeHtml(brand.name)}</td></tr>
    <tr><th>Creator</th><td>${escapeHtml(creator.legalName ?? creator.displayName)}</td></tr>
    <tr><th>Campaign</th><td>${escapeHtml(campaign.title)}</td></tr>
  </table>

  <h2>Commercial Terms</h2>
  <table>
    <tr><th>Brand Price</th><td>${escapeHtml(money(deal.brandPrice, currency))}</td></tr>
    <tr><th>Creator Payout</th><td>${escapeHtml(money(deal.creatorPayout, currency))}</td></tr>
    <tr><th>Payment Terms</th><td>${escapeHtml(deal.paymentTerms ?? '')}</td></tr>
  </table>

  <h2>Deliverables</h2>
  <p>${escapeHtml(textFromRichText(deal.deliverablesSummary))}</p>

  <h2>Usage Rights</h2>
  <p>${escapeHtml(textFromRichText(deal.usageRights))}</p>

  <h2>Exclusivity</h2>
  <p>${escapeHtml(textFromRichText(deal.exclusivity))}</p>

  <h2>Revision Policy</h2>
  <p>${escapeHtml(textFromRichText(deal.revisionPolicy))}</p>

  <div class="signature">Signer signature</div>
</body>
</html>`;
};
