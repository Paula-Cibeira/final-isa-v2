import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'authority',
    data: { pageTitle: 'bootifulmusicApp.adminAuthority.home.title' },
    loadChildren: () => import('./admin/authority/authority.routes'),
  },
  {
    path: 'artist',
    data: { pageTitle: 'bootifulmusicApp.artist.home.title' },
    loadChildren: () => import('./artist/artist.routes'),
  },
  {
    path: 'genre',
    data: { pageTitle: 'bootifulmusicApp.genre.home.title' },
    loadChildren: () => import('./genre/genre.routes'),
  },
  {
    path: 'track',
    data: { pageTitle: 'bootifulmusicApp.track.home.title' },
    loadChildren: () => import('./track/track.routes'),
  },
  {
    path: 'album',
    data: { pageTitle: 'bootifulmusicApp.album.home.title' },
    loadChildren: () => import('./album/album.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
