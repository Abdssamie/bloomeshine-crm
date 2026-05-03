import { NavigationMenuItemType, defineNavigationMenuItem } from 'twenty-sdk/define';
import { NAV, VIEW } from 'src/constants/universal-identifiers';

export default defineNavigationMenuItem({ universalIdentifier: NAV.deliverables, type: NavigationMenuItemType.VIEW, name: 'Deliverables', viewUniversalIdentifier: VIEW.deliverables, folderUniversalIdentifier: NAV.folder, position: 50 });
