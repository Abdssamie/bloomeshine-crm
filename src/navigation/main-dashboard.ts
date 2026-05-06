import {
  NavigationMenuItemType,
  defineNavigationMenuItem,
} from "twenty-sdk/define";

import { NAV } from "src/constants/universal-identifiers";

export default defineNavigationMenuItem({
  universalIdentifier: NAV.mainDashboard,
  type: NavigationMenuItemType.PAGE_LAYOUT,
  name: "Dashboard",
  icon: "IconLayoutDashboard",
  position: 10,
});
