import { defineLogicFunction } from 'twenty-sdk/define';

import { LOGIC_FUNCTION } from 'src/constants/universal-identifiers';
import { core, updateDeal } from 'src/logic-functions/_revenue-ops';

const today = () => new Date().toISOString().slice(0, 10);

const handler = async () => {
  const client = core();
  const result = (await client.query({
    deals: {
      __args: {
        first: 100,
        filter: {
          invoiceStatus: { in: ['GENERATED', 'SENT'] },
          invoiceDueDate: { lt: today() },
        },
      },
      edges: {
        node: {
          id: true,
          invoiceStatus: true,
          invoiceDueDate: true,
        },
      },
    },
  } as any)) as { deals?: { edges?: { node: { id: string } }[] } };

  const overdueDeals = result.deals?.edges?.map(({ node }) => node) ?? [];

  await Promise.all(
    overdueDeals.map((deal) =>
      updateDeal(client, deal.id, { invoiceStatus: 'OVERDUE' }),
    ),
  );

  return { overdueDeals: overdueDeals.length };
};

export default defineLogicFunction({
  universalIdentifier: LOGIC_FUNCTION.dailyRevenueOpsAudit,
  name: 'Daily Revenue Ops Audit',
  description: 'Mark generated or sent invoices overdue when the due date passes.',
  timeoutSeconds: 20,
  cronTriggerSettings: {
    pattern: '0 8 * * *',
  },
  handler,
});

