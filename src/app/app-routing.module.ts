import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'tic-tac-toe',
    loadChildren: () => import('./tic-tac-toe/tic-tac-toe.module').then( m => m.TicTacToePageModule)
  },
  {
    path: 'timbiriche',
    loadChildren: () => import('./timbiriche/timbiriche.module').then( m => m.TimbirichePageModule)
  },
  {
    path: 'burro',
    loadChildren: () => import('./pages/burro/burro.module').then( m => m.BurroPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
