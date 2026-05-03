import { NavigationMenuItemType, defineNavigationMenuItem } from 'twenty-sdk/define';
import { NAV } from 'src/constants/universal-identifiers';

export default defineNavigationMenuItem({ universalIdentifier: NAV.contracts, type: NavigationMenuItemType.LINK, name: 'Contracts', icon: 'IconFileCertificate', link: '/objects/contracts', position: 110 });
