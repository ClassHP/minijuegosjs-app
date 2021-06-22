import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuData } from 'src/app/models/menu-data';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  minijuegos = MenuData;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onClickItem(item) {
    this.router.navigate([item.href]);
  }

}
