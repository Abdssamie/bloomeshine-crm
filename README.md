This is a [Twenty](https://twenty.com) application bootstrapped with [`create-twenty-app`](https://www.npmjs.com/package/create-twenty-app).

## Getting Started

Run `yarn twenty help` to list all available commands.

## Learn More

- [Twenty Apps documentation](https://docs.twenty.com/developers/extend/apps/getting-started)
- [twenty-sdk CLI reference](https://www.npmjs.com/package/twenty-sdk)
- [Discord](https://discord.gg/cx5n4Jzs57)

## Revenue Ops Automations

This app includes Twenty logic functions for invoice PDF generation, contract generation/signing, Documenso webhook sync, and overdue invoice audit.

Required environment variables for the logic functions:

```env
GOTENBERG_URL=http://gotenberg:3000
DOCUMENSO_URL=https://sign.example.com
DOCUMENSO_API_KEY=...
DOCUMENSO_WEBHOOK_SECRET=...
```

Documenso should own signer email delivery. Configure SMTP in Documenso, not in Twenty.

Webhook URL:

```txt
https://your-twenty-server.com/s/documenso-webhook
```

## PDF Templates

Use the `PDF Templates` page to edit Gotenberg HTML/CSS templates for invoices and contracts. Paste raw code into `HTML Source` and `CSS Source`.

Create one active template per kind:

- `Kind = Invoice`, `Active = true`
- `Kind = Contract`, `Active = true`

Run the `Seed PDF Templates` logic function to create built-in `Default Invoice` and `Default Contract` records automatically.

Run the `Preview PDF Template` logic function with a `templateId` to render a sample PDF through Gotenberg and save the preview URL back to the template.

Generation logic:

- `Generate Invoice PDF` uses the active invoice template.
- `Generate And Send Contract` uses the active contract template.
- If no active template exists, the built-in fallback template is used.

Useful placeholders:

```txt
{{today}}
{{invoiceNumber}}
{{brand.name}}
{{brand.contactName}}
{{campaign.title}}
{{creator.displayName}}
{{creator.legalName}}
{{deal.name}}
{{deal.paymentTerms}}
{{totals.brandPrice}}
{{totals.creatorPayout}}
{{totals.agencyMargin}}
{{text.deliverables}}
{{text.usageRights}}
{{text.exclusivity}}
{{text.revisionPolicy}}
```

Unknown placeholders are rejected before rendering. For example, `{{brand.company}}` fails because the available field is `{{brand.name}}`.
