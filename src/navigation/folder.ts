import { NavigationMenuItemType, defineNavigationMenuItem } from 'twenty-sdk/define';

import { NAV } from 'src/constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: NAV.folder,
  type: NavigationMenuItemType.FOLDER,
  name: 'IMA CRM',
  icon: 'IconTargetArrow',
  position: 10,
});
