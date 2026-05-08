import {
  NavigationMenuItemType,
  defineNavigationMenuItem,
} from "twenty-sdk/define";
import { NAV, VIEW } from "src/constants/universal-identifiers";

export default defineNavigationMenuItem({
  universalIdentifier: NAV.creators,
  type: NavigationMenuItemType.VIEW,
  name: "Creators",
  viewUniversalIdentifier: VIEW.creators,
  position: 20,
});
