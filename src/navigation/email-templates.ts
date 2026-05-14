import {
  NavigationMenuItemType,
  defineNavigationMenuItem,
} from 'twenty-sdk/define';

import { NAV, VIEW } from 'src/constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: NAV.emailTemplates,
  type: NavigationMenuItemType.VIEW,
  name: 'Email Templates',
  icon: 'IconMail',
  viewUniversalIdentifier: VIEW.emailTemplates,
  position: 80,
});
