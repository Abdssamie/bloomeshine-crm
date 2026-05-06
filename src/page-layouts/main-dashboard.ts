import {
  AggregateOperations,
  PageLayoutTabLayoutMode,
  definePageLayout,
  PageLayoutConfig,
} from "twenty-sdk/define";

import { OBJECT, PAGE_LAYOUT } from "src/constants/universal-identifiers";
import { fieldId } from "src/objects/_helpers";

const WIDGET = {
  overview: "fb469678-b308-40c1-872a-9e1ddf157aef",
  pipelineValue: "b2adcac7-6aea-4519-b2cc-a00c67b1274a",
  expectedMargin: "e880b9d7-8052-4ee8-b4a8-80ddb5618695",
  overdueRevenue: "d7f6a5b4-c3d2-4e1f-a0b9-c8d7e6f5a4b3",
  openDeals: "abaca420-2a94-4e0f-8d29-bc3854e631fb",
  creators: "cce41edf-aa61-4e71-9aef-0018a9ae8440",
  dealWorkflow: "cec85977-90b5-4363-b118-464382bb2110",
  shortlistStatus: "b1c2d3e4-f5a6-4b7c-8d9e-0f1a2b3c4d5e",
  invoices: "80fe4c6d-aba4-40d6-80e1-b2738bf41aee",
  contracts: "5aa39c91-8f31-4b5f-a496-d5f9124926f3",
} as const;

const TAB = {
  overview: "f04d14c9-9ceb-4bf0-9fc4-4f89bda5220b",
} as const;

const relationId = (value: string) => value as never;

export default definePageLayout({
  universalIdentifier: PAGE_LAYOUT.mainDashboard,
  type: "STANDALONE_PAGE",
  name: "Main Dashboard",
  tabs: [
    {
      universalIdentifier: TAB.overview,
      title: "Overview",
      position: 0,
      icon: "IconLayoutDashboard",
      layoutMode: PageLayoutTabLayoutMode.GRID,
      widgets: [
        {
          universalIdentifier: WIDGET.pipelineValue,
          title: "Pipeline Value",
          type: "GRAPH",
          objectUniversalIdentifier: OBJECT.deal,
          gridPosition: { row: 0, column: 0, rowSpan: 3, columnSpan: 3 },
          configuration: {
            configurationType: "AGGREGATE_CHART",
            aggregateFieldMetadataUniversalIdentifier: relationId(
              fieldId(OBJECT.deal, "brandPrice")
            ),
            aggregateOperation: AggregateOperations.SUM,
            label: "Pipeline",
            prefix: "EUR ",
          },
        },
        {
          universalIdentifier: WIDGET.expectedMargin,
          title: "Expected Margin",
          type: "GRAPH",
          objectUniversalIdentifier: OBJECT.deal,
          gridPosition: { row: 0, column: 3, rowSpan: 3, columnSpan: 3 },
          configuration: {
            configurationType: "AGGREGATE_CHART",
            aggregateFieldMetadataUniversalIdentifier: relationId(
              fieldId(OBJECT.deal, "agencyMargin")
            ),
            aggregateOperation: AggregateOperations.SUM,
            label: "Margin",
            prefix: "EUR ",
          },
        },
        {
          universalIdentifier: WIDGET.overdueRevenue,
          title: "Overdue Revenue",
          type: "GRAPH",
          objectUniversalIdentifier: OBJECT.deal,
          gridPosition: { row: 0, column: 6, rowSpan: 3, columnSpan: 3 },
          configuration: {
            configurationType: "AGGREGATE_CHART",
            aggregateFieldMetadataUniversalIdentifier: relationId(
              fieldId(OBJECT.deal, "brandPrice")
            ),
            aggregateOperation: AggregateOperations.SUM,
            label: "Overdue",
            prefix: "EUR ",
          },
        },
        {
          universalIdentifier: WIDGET.openDeals,
          title: "Deals",
          type: "GRAPH",
          objectUniversalIdentifier: OBJECT.deal,
          gridPosition: { row: 0, column: 9, rowSpan: 3, columnSpan: 3 },
          configuration: {
            configurationType: "AGGREGATE_CHART",
            aggregateFieldMetadataUniversalIdentifier: relationId(
              fieldId(OBJECT.deal, "name")
            ),
            aggregateOperation: AggregateOperations.COUNT,
            label: "Deals",
          },
        },
        {
          universalIdentifier: WIDGET.dealWorkflow,
          title: "Deal Workflow",
          type: "GRAPH",
          objectUniversalIdentifier: OBJECT.deal,
          gridPosition: { row: 2, column: 0, rowSpan: 4, columnSpan: 6 },
          configuration: {
            configurationType: "PIE_CHART",
            aggregateFieldMetadataUniversalIdentifier: relationId(
              fieldId(OBJECT.deal, "name")
            ),
            aggregateOperation: AggregateOperations.COUNT,
            groupByFieldMetadataUniversalIdentifier: relationId(
              fieldId(OBJECT.deal, "workflowStatus")
            ),
            displayLegend: true,
            showCenterMetric: true,
          },
        },
        {
          universalIdentifier: WIDGET.shortlistStatus,
          title: "Shortlist Approval",
          type: "GRAPH",
          objectUniversalIdentifier: OBJECT.deal,
          gridPosition: { row: 2, column: 6, rowSpan: 4, columnSpan: 6 },
          configuration: {
            configurationType: "PIE_CHART",
            aggregateFieldMetadataUniversalIdentifier: relationId(
              fieldId(OBJECT.deal, "name")
            ),
            aggregateOperation: AggregateOperations.COUNT,
            groupByFieldMetadataUniversalIdentifier: relationId(
              fieldId(OBJECT.deal, "shortlistStatus")
            ),
            displayLegend: true,
            showCenterMetric: true,
          },
        },
        {
          universalIdentifier: WIDGET.invoices,
          title: "Invoice Status",
          type: "GRAPH",
          objectUniversalIdentifier: OBJECT.deal,
          gridPosition: { row: 6, column: 0, rowSpan: 4, columnSpan: 6 },
          configuration: {
            configurationType: "PIE_CHART",
            aggregateFieldMetadataUniversalIdentifier: relationId(
              fieldId(OBJECT.deal, "name")
            ),
            aggregateOperation: AggregateOperations.COUNT,
            groupByFieldMetadataUniversalIdentifier: relationId(
              fieldId(OBJECT.deal, "invoiceStatus")
            ),
            displayLegend: true,
            showCenterMetric: true,
          },
        },
        {
          universalIdentifier: WIDGET.contracts,
          title: "Contract Status",
          type: "GRAPH",
          objectUniversalIdentifier: OBJECT.contract,
          gridPosition: { row: 6, column: 6, rowSpan: 4, columnSpan: 6 },
          configuration: {
            configurationType: "PIE_CHART",
            aggregateFieldMetadataUniversalIdentifier: relationId(
              fieldId(OBJECT.contract, "title")
            ),
            aggregateOperation: AggregateOperations.COUNT,
            groupByFieldMetadataUniversalIdentifier: relationId(
              fieldId(OBJECT.contract, "status")
            ),
            displayLegend: true,
            showCenterMetric: true,
          },
        },
      ],
    },
  ],
} satisfies PageLayoutConfig);
