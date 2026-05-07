import {
  NavigationMenuItemType,
  defineNavigationMenuItem,
} from "twenty-sdk/define";

import { NAV, PAGE_LAYOUT } from "src/constants/universal-identifiers";

export default defineNavigationMenuItem({
  universalIdentifier: NAV.mainDashboard,
  type: NavigationMenuItemType.PAGE_LAYOUT,
  name: "Dashboard",
  icon: "IconLayoutDashboard",
  pageLayoutUniversalIdentifier: PAGE_LAYOUT.mainDashboard,
  position: 10,
});
