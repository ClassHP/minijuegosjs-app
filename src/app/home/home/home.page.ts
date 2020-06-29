import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  minijuegos = [
    { 
      category: 'Clasico', 
      title: 'Tic tac toe', 
      image: 'assets/images/tic_tac_toe.png',
      descrip: 'Tres en línea, Ceros y Cruces, tres en raya, Michi, Triqui, Cuadritos, juego del gato, Gato, Tatetí, Totito, Triqui traka, Equis Cero, la vieja.',
      href: '/tic-tac-toe'
    },
    { 
      category: 'Clasico', 
      title: 'Timbiriche', 
      image: 'assets/images/timbiriche.png',
      descrip: 'Colchón , cuadrito, cajas o puntito.',
      href: '/timbiriche'
    },
  ]

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onClickItem(item) {
    this.router.navigate([item.href]);
  }

}
