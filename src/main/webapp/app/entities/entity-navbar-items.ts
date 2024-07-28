import NavbarItem from 'app/layouts/navbar/navbar-item.model';

export const EntityNavbarItems: NavbarItem[] = [
  {
    name: 'Artist',
    route: '/artist',
    translationKey: 'global.menu.entities.artist',
  },
  {
    name: 'Genre',
    route: '/genre',
    translationKey: 'global.menu.entities.genre',
  },
  {
    name: 'Track',
    route: '/track',
    translationKey: 'global.menu.entities.track',
  },
  {
    name: 'Album',
    route: '/album',
    translationKey: 'global.menu.entities.album',
  },
];
