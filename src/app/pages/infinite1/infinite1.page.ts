import { formatNumber } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ToolsService } from 'src/app/services/tools.service';

@Component({
  selector: 'app-infinite1',
  templateUrl: './infinite1.page.html',
  styleUrls: ['./infinite1.page.scss'],
})
export class Infinite1Page implements OnInit {

  matrix: number[][];
  colors: any[];
  colorSelected = 0;
  time: string;
  secons: number;
  interval;
  forms = [
    [[1],[1],[1],[1],[1]], //I
    [[1,0],[1,0],[1,0],[1,1]], //L
    [[0,1],[1,1],[0,1],[0,1]], //Y
    [[0,1],[1,1],[1,0],[1,0]], //N
    [[1,1,1],[0,1,0],[0,1,0]], //T
    [[0,1,1],[1,1,0],[0,1,0]], //F
    [[1,0,0],[1,0,0],[1,1,1]], //V
    [[1,0,0],[1,1,0],[0,1,1]], //W
    [[0,1,0],[1,1,1],[0,1,0]], //X
    [[1,1,0],[0,1,0],[0,1,1]], //Z
    [[1,1],[1,1],[1,0]], //P
    [[1,0,1],[1,1,1]], //U
  ];

  constructor(public toolsService: ToolsService) { }

  ngOnInit() {
    this.init();
    this.onClickHelp();
  }

  init() {    
    let row1, row2, col1, col2;
    do {
      row1 = Math.floor(Math.random() * 6);
      row2 = Math.floor(Math.random() * 6);
      col1 = Math.floor(Math.random() * 7);
      col2 = Math.floor(Math.random() * 7);
    } while(row1 == row2 && col1 == col2);
    this.matrix = new Array(6).fill(null).map((row, ir) => new Array(7).fill(-1));
    this.matrix[row1][col1] = -2;
    this.matrix[row2][col2] = -2;

    this.colors = [
      { color: 0, count: 5, form: -1 },
      { color: 1, count: 5, form: -1 },
      { color: 2, count: 5, form: -1 },
      { color: 3, count: 5, form: -1 },
      { color: 4, count: 5, form: -1 },
      { color: 5, count: 5, form: -1 },
      { color: 6, count: 5, form: -1 },
      { color: 7, count: 5, form: -1 },
    ];

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

  getMatrixVal(row: number, col: number) {
    let result = this.matrix[row][col];
    if (result == -1) {
    }
    return result;
  }

  getForm(colorIndex) {
    //const newMatrix = this.matrix.map((row) => row.map(col => col));
    var rowMin = 100,
      rowMax = -1,
      colMin = 100,
      colMax = -1;

    for (let row = 0; row < this.matrix.length; row++) {
      for (let col = 0; col < this.matrix[row].length; col++) {
        if (this.matrix[row][col] == colorIndex) {
          rowMin = rowMin > row ? row : rowMin;
          rowMax = rowMax < row ? row : rowMax;
          colMin = colMin > col ? col : colMin;
          colMax = colMax < col ? col : colMax;
        }
      }
    }
    
    var rowSize = (rowMax - rowMin) + 1;
    var colSize = (colMax - colMin) + 1;

    for (let formIndex = 0; formIndex < this.forms.length; formIndex++) {
      var form = this.forms[formIndex];
      for (let flip = 0; flip < 2; flip ++) {
        for (let rot = 0; rot < 4; rot ++) {
          var formSize = this.getMatrixSizeRot(form, rot);
          if (rowSize == formSize.row && colSize == formSize.col) {
            let compare = true;
            for (let row = 0; row < rowSize; row++) {
              for (let col = 0; col < colSize; col++) {
                let formVal = this.getMatrixValRot(form, row, col, rot, flip);
                let matVal = this.matrix[rowMin + row][colMin + col];
                if (formVal == 1 && matVal != colorIndex) {
                  compare = false;
                  break;
                }
              }
              if (!compare) {
                break;
              }
            }
            if (compare) {
              return formIndex;
            }
          }
        }
      }
    }
    return -1;
  }

  getMatrixSizeRot(matrix: number[][], rot: number) {
    if (rot % 2 == 0) {
      return { row: matrix.length, col: matrix[0].length };
    }
    return { row: matrix[0].length, col: matrix.length };    
  }

  getMatrixValRot(matrix: number[][], row: number, col: number, rot: number, flip: number) {    
    var rowSize = matrix.length - 1;
    var colSize = matrix[0].length - 1;
    if (rot == 0 && flip == 0) {      
      return matrix[row][col];
    }
    if (rot == 0 && flip == 1) {      
      return matrix[row][colSize - col];
    }
    if (rot == 1 && flip == 0) {      
      return matrix[col][row];
    }
    if (rot == 1 && flip == 1) {      
      return matrix[rowSize - col][row];
    }
    if (rot == 2 && flip == 0) {      
      return matrix[rowSize - row][colSize - col];
    }
    if (rot == 2 && flip == 1) {      
      return matrix[rowSize - row][col];
    }
    if (rot == 3 && flip == 0) {      
      return matrix[rowSize - col][colSize - row];
    }
    if (rot == 3 && flip == 1) {      
      return matrix[col][colSize - row];
    }
  }

  validateEnd() {
    for(let col of this.colors) {
      if (col.form < 0) {
        return;
      }
    }
    for(let col of this.colors) {      
      for(let col2 of this.colors) {
        if (col.color != col2.color && col.form == col2.form) {
          return;
        }
      }
    }
    this.pauseTimer();
    this.toolsService.presentAlert('¡Bien jugado!', 'Muy bien, completaste el puzle en ' + this.time).then(() => {
      this.init();
    });
  }

  onClickCell(rowI, colI) {
    let cell = this.matrix[rowI][colI];
    if (cell == -1 && this.colors[this.colorSelected].count > 0) {
      this.matrix[rowI][colI] = this.colors[this.colorSelected].color;
      this.colors[this.colorSelected].count --;
      if (this.colors[this.colorSelected].count == 0) {
        this.colors[this.colorSelected].form = this.getForm(this.colorSelected);
        this.colorSelected = (this.colorSelected + 1) > this.colors.length ? 0 : this.colorSelected + 1;
        this.validateEnd();
      }
    }
    if (cell >= 0) {
      this.colors[cell].count ++;
      this.colors[cell].form = -1;
      this.matrix[rowI][colI] = -1;
      this.colorSelected = cell;
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
