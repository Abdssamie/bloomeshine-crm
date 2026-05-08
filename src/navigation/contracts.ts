import {
  NavigationMenuItemType,
  defineNavigationMenuItem,
} from "twenty-sdk/define";
import { NAV, VIEW } from "src/constants/universal-identifiers";

export default defineNavigationMenuItem({
  universalIdentifier: NAV.contracts,
  type: NavigationMenuItemType.VIEW,
  name: "Contracts",
  viewUniversalIdentifier: VIEW.contracts,
  position: 70,
});
