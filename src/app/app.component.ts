import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { MenuData } from './models/menu-data';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public selectedIndex = -1;
  public appPages = MenuData;
  public labels = [];
  public darkmode = true;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit() {
    /*const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }*/
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    prefersDark.addListener((e) => this.darkModeToggle(e.matches));
    this.darkModeToggle(prefersDark.matches);
  }

  darkModeToggle(shouldCheck) {
    this.darkmode = shouldCheck;
    document.body.classList.toggle('dark', this.darkmode);
  }
}
