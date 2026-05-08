import {
  NavigationMenuItemType,
  defineNavigationMenuItem,
} from 'twenty-sdk/define';

import { NAV, VIEW } from 'src/constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: NAV.tasksKanban,
  type: NavigationMenuItemType.VIEW,
  name: 'Tasks',
  viewUniversalIdentifier: VIEW.tasksKanban,
  position: 55,
});
