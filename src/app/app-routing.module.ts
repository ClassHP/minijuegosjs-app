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
  },
  {
    path: 'tetris',
    loadChildren: () => import('./pages/tetris/tetris.module').then( m => m.TetrisPageModule)
  },
  {
    path: 'infinite1',
    loadChildren: () => import('./pages/infinite1/infinite1.module').then( m => m.Infinite1PageModule)
  },
  {
    path: 'crosswords',
    loadChildren: () => import('./pages/crosswords/crosswords.module').then( m => m.CrosswordsPageModule)
  },
  {
    path: 'jigsaw',
    loadChildren: () => import('./pages/jigsaw/jigsaw.module').then( m => m.JigsawPageModule)
  },
  {
    path: 'wordsearch',
    loadChildren: () => import('./pages/wordsearch/wordsearch.module').then( m => m.WordsearchPageModule)
  },
  {
    path: 'paint',
    loadChildren: () => import('./pages/paint/paint.module').then( m => m.PaintPageModule)
  },
  {
    path: 'freecell',
    loadChildren: () => import('./pages/freecell/freecell.module').then( m => m.FreecellPageModule)
  },
  {
    path: 'solitaire',
    loadChildren: () => import('./pages/solitaire/solitaire.module').then( m => m.SolitairePageModule)
  },
  {
    path: 'sudoku',
    loadChildren: () => import('./pages/sudoku/sudoku.module').then( m => m.SudokuPageModule)
  },
  {
    path: 'sudoku/:id',
    loadChildren: () => import('./pages/sudoku/sudoku.module').then( m => m.SudokuPageModule)
  }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
