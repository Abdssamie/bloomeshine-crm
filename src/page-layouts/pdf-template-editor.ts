import {
  PageLayoutTabLayoutMode,
  definePageLayout,
  type PageLayoutConfig,
} from 'twenty-sdk/define';

import {
  FRONT_COMPONENT,
  OBJECT,
  PAGE_LAYOUT,
} from 'src/constants/universal-identifiers';

const TAB = {
  editor: 'a4b730ff-2a6e-481e-8a9a-50ed6247bc2d',
} as const;

const WIDGET = {
  editor: 'a81b4f23-55ce-4ac4-9afb-3f28382a3c98',
} as const;

const relationId = (value: string) => value as never;

export default definePageLayout({
  universalIdentifier: PAGE_LAYOUT.pdfTemplateEditor,
  type: 'RECORD_PAGE',
  name: 'PDF Templates',
  objectUniversalIdentifier: OBJECT.pdfTemplate,
  tabs: [
    {
      universalIdentifier: TAB.editor,
      title: 'Editor',
      position: 0,
      icon: 'IconFileTypePdf',
      layoutMode: PageLayoutTabLayoutMode.GRID,
      widgets: [
        {
          universalIdentifier: WIDGET.editor,
          title: 'PDF Template Editor',
          type: 'FRONT_COMPONENT',
          gridPosition: { row: 0, column: 0, rowSpan: 12, columnSpan: 12 },
          configuration: {
            configurationType: 'FRONT_COMPONENT',
            frontComponentUniversalIdentifier: relationId(
              FRONT_COMPONENT.pdfTemplateEditor,
            ),
          },
        },
      ],
    },
  ],
} satisfies PageLayoutConfig);
