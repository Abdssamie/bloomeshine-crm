import {
  NavigationMenuItemType,
  defineNavigationMenuItem,
} from "twenty-sdk/define";
import { NAV, VIEW } from "src/constants/universal-identifiers";

export default defineNavigationMenuItem({
  universalIdentifier: NAV.deals,
  type: NavigationMenuItemType.VIEW,
  name: "Deals",
  viewUniversalIdentifier: VIEW.deals,
  position: 90,
});
