import {
  NavigationMenuItemType,
  defineNavigationMenuItem,
} from "twenty-sdk/define";
import { NAV, VIEW } from "src/constants/universal-identifiers";

export default defineNavigationMenuItem({
  universalIdentifier: NAV.brands,
  type: NavigationMenuItemType.VIEW,
  name: "Brands",
  viewUniversalIdentifier: VIEW.brands,
  position: 10,
});
