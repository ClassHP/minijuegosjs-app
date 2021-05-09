import { formatNumber } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ToolsService } from 'src/app/services/tools.service';

@Component({
  selector: 'app-color-puzzle',
  templateUrl: './color-puzzle.page.html',
  styleUrls: ['./color-puzzle.page.scss'],
})
export class ColorPuzzlePage implements OnInit {

  matrix: number[][];
  colors: any[];
  colorSelected = 0;
  time: string;
  secons: number;
  interval;

  constructor(public toolsService: ToolsService) { }

  ngOnInit() {
    this.init();
    this.onClickHelp();
  }

  init() {    
    this.colors = [];
    let comb = [0, 1]
    let i = 0;
    for (let i1=0; i1 < comb.length; i1++) {
      for (let i2=0; i2 < comb.length; i2++) {
        for (let i3=0; i3 < comb.length; i3++) {
          this.colors.push({ id: i, rgb: [comb[i1], comb[i2], comb[i3]] });
          i++;
        }
      }
    }

    this.matrix = new Array(6).fill(null).map((row, ir) => new Array(6).fill(0).map(() => {
      return Math.floor(Math.random() * this.colors.length);
    }));

    this.time = '00:00';
    this.secons = 0;
    this.pauseTimer();
    this.startTimer();
  }

  pauseTimer() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  startTimer() {
    this.interval = setInterval(() => {
      this.secons ++;
      let min = Math.floor(this.secons / 60);
      this.time = '' + formatNumber(min, 'en-US', '2.0') + ':' + formatNumber(this.secons - min * 60, 'en-US', '2.0');
    }, 1000);
  }

  getRGB(row: number, col: number) {
    let result = this.matrix[row][col];
    var color = this.colors[result].rgb;
    //let rgb = color;
    let rgb = [1 - color[0], 1 - color[1], 1 - color[2]];
    return `rgb(${Math.floor(rgb[0]*255)},${Math.floor(rgb[1]*255)},${Math.floor(rgb[2]*255)})`;
  }

  validateEnd() {
    this.pauseTimer();
    this.toolsService.presentAlert('¡Bien jugado!', 'Muy bien, completaste el puzle en ' + this.time).then(() => {
      this.init();
    });
  }

  getNextColor(id1, id2) {
    let col1 = this.colors[id1];
    let col2 = this.colors[id2];
    let sum = [
      col1.rgb[0] / 2 + col2.rgb[0] / 2 , 
      col1.rgb[1] / 2 + col2.rgb[1] / 2,
      col1.rgb[2] / 2 + col2.rgb[2] / 2
    ];
    sum[0] = sum[0] > 1 ? sum[0] - 1 : sum[0];
    sum[1] = sum[1] > 1 ? sum[1] - 1 : sum[1];
    sum[2] = sum[2] > 1 ? sum[2] - 1 : sum[2];
    let next = this.colors.find((item) => {
      return item.rgb[0] == sum[0] && item.rgb[1] == sum[1] && item.rgb[2] == sum[2];
    });
    if (!next) {
      next = { id: this.colors.length, rgb: sum};
      this.colors.push(next);
    }
    return next;
  }

  onClickCell(rowI, colI) {
    let cell = this.matrix[rowI][colI];
    for(let i1=-1; i1 < 2; i1++) {
      for(let i2=-1; i2 < 2; i2++) {
        if(i1 != 0 || i2 != 0) {
          if (rowI + i1 >= 0 && rowI + i1 < this.matrix.length) {
            if (colI + i2 >= 0 && colI + i2 < this.matrix[0].length) {
              let next = this.getNextColor(cell, this.matrix[rowI + i1][colI + i2]);
              this.matrix[rowI + i1][colI + i2] = next.id;
            }
          }
        }
      }
    }
  }

  onClickColor(colI) {
    this.colorSelected = colI;
  }

  async onClickHelp() {
    this.pauseTimer();
    await this.toolsService.presentAlert(
      'Información del juego', 
      'Intenta llenar el tablero con 5 cuadros adyacentes (horizontal o verticalmente) de un mismo color, sin repetir las formas resultantes de 5 cuadros. Hay un total de 12 formas diferentes de colocar 5 cuadros (horizontal o verticalmente) una al lado de la otra y ninguna de ellas puede repetirse, no se permiten las formas reflejadas ni las diagonales'
    );    
    this.startTimer();
  }

}
