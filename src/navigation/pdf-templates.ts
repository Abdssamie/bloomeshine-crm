import {
  NavigationMenuItemType,
  defineNavigationMenuItem,
} from 'twenty-sdk/define';

import { NAV, VIEW } from 'src/constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: NAV.pdfTemplates,
  type: NavigationMenuItemType.VIEW,
  name: 'PDF Templates',
  icon: 'IconFileTypePdf',
  viewUniversalIdentifier: VIEW.pdfTemplates,
  position: 100,
});
