import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { ToolsService } from 'src/app/services/tools.service';

@Component({
  selector: 'app-tetris',
  templateUrl: './tetris.page.html',
  styleUrls: ['./tetris.page.scss'],
})
export class TetrisPage implements OnInit, OnDestroy {
  private width = 9;
  private height = 17;
  private maxSpeed = 50;
  score = 0;
  matrix: number[][];
  currentShape: { row: number, col: number, shape: number[][] };
  shapes = [
    [[1], [1], [1], [1]],
    [[2, 2, 2], [0, 2, 0]],
    [[0, 3, 0], [0, 3, 0], [0, 3, 3]],
    [[0, 4, 0], [0, 4, 0], [4, 4, 0]],
    [[5, 5, 0], [0, 5, 5]],
    [[0, 6, 6], [6, 6, 0]],
    [[7, 7], [7, 7]],
  ];
  nextShape: number[][];
  speed = 700;
  intervalGame;

  constructor(public toolsService: ToolsService) { }

  ngOnInit() {
    this.init();
  }

  init() {
    this.score = 0;
    this.matrix = new Array(this.height).fill(null).map((row, ir) => new Array(this.width).fill(0));
    this.currentShape = { row: 0, col: 0, shape: [] };
    this.nextShape = this.shapes[Math.floor(Math.random() * this.shapes.length)];
    this.changeShape();
    this.start(this.speed);
  }

  start(speed) {
    this.stop();
    this.intervalGame = setInterval(() => {
      this.gameFrame();
    }, speed);
  }

  stop() {
    if (this.intervalGame) {
      clearInterval(this.intervalGame);
      this.intervalGame = null;
    }
  }

  changeShape() {
    this.currentShape.shape = this.nextShape;
    this.currentShape.row = - (this.currentShape.shape.length - 1);
    this.currentShape.col = Math.floor((this.matrix[0].length - this.currentShape.shape[0].length) / 2);
    this.nextShape = this.shapes[Math.floor(Math.random() * this.shapes.length)];
  }

  validMove(newRow, newCol, shape) {
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col] !== 0) {
          if (newRow + row >= this.matrix.length) {
            return false;
          }
          if (newCol + col < 0 || newCol + col >= this.matrix[0].length) {
            return false;
          }
          if (newRow + row >= 0 && this.matrix[newRow + row][newCol + col] !== 0) {
            return false;
          }
        }
      }
    }
    return true;
  }

  move(mov) {
    if (this.validMove(this.currentShape.row, this.currentShape.col + mov, this.currentShape.shape)) {
      this.currentShape.col += mov;
    }
  }

  spin() {
    const shape = this.currentShape.shape;
    const newShape = [];
    for (let col = 0; col < shape[0].length; col++) {
      newShape[col] = [];
      for (let row = 0; row < shape.length; row++) {
        newShape[col][row] = shape[shape.length - row - 1][col];
      }
    }
    if (this.validMove(this.currentShape.row, this.currentShape.col, newShape)) {
      this.currentShape.shape = newShape;
    }
  }

  down(status: boolean) {
    if (this.intervalGame) {
      if (status) {
        this.start(this.maxSpeed);
      } else {
        this.start(this.speed);
      }
    }
  }

  mergeMatrix(matrix1: number[][], matrix2: number[][], rowOffser: number, colOffset: number) {
    const newMatrix = matrix1.map((row) => row.map(col => col));

    for (let row = 0; row < matrix2.length; row++) {
      for (let col = 0; col < matrix2[row].length; col++) {
        if (matrix2[row][col] !== 0) {
          newMatrix[rowOffser + row][colOffset + col] = matrix2[row][col];
        }
      }
    }
    return newMatrix;
  }

  gameFrame() {
    // Se valida si se puede mover el objeto hacia abajo
    if (this.validMove(this.currentShape.row + 1, this.currentShape.col, this.currentShape.shape)) {
      this.currentShape.row++;
    } else {
      if (this.currentShape.row < 0) {
        this.stop();
        this.toolsService.presentAlert('Game Over', `Fin del juego, ¡intentalo de nuevo!`).then(() => {
          this.init();
        });
        return;
      }
      this.matrix = this.mergeMatrix(this.matrix, this.currentShape.shape, this.currentShape.row, this.currentShape.col);
      this.changeShape();
      this.down(false);
    }
    let rowScoreCount = 0;
    // Se recorre la matriz de abajo hacia arriba
    for (let i = this.matrix.length - 1; i >= 0; i--) {
      let rowScore = true;
      // Recorremos las filas para verificar si todas estan vacías
      // tslint:disable-next-line: prefer-for-of
      for (let j = 0; j < this.matrix[i].length; j++) {
        if (this.matrix[i][j] === 0) {
          rowScore = false;
          // Esto fuerza a que termine el ciclo actual
          // break;
        }
      }
      // Si todos los valores de la fila son distintos de cero
      if (rowScore) {
        // Se elimina la fila
        this.matrix.splice(i, 1);
        i++;
        // Se agrega una fila nueva al principio
        this.matrix.splice(0, 0, new Array(this.width).fill(0));
        // Aumenta la cantidad de filas encontradas
        rowScoreCount++;
      }
    }
    this.score += rowScoreCount * rowScoreCount;
  }

  getMatrixVal(row: number, col: number) {
    let result = this.matrix[row][col];
    if (row >= this.currentShape.row && row < this.currentShape.row + this.currentShape.shape.length
      && col >= this.currentShape.col && col < this.currentShape.col + this.currentShape.shape[0].length
      && this.currentShape.shape[row - this.currentShape.row][col - this.currentShape.col] !== 0) {
      result = this.currentShape.shape[row - this.currentShape.row][col - this.currentShape.col];
    }
    return result;
  }

  @HostListener('document:keydown', ['$event'])
  documentKeyDown(ev: KeyboardEvent) {
    // console.log('documentKeyDown', ev.key);
    if (ev.key === 'ArrowDown') {
      if (ev.repeat) {
        return false;
      }
      this.down(true);
    }
    if (ev.key === 'ArrowLeft') {
      this.move(-1);
    }
    if (ev.key === 'ArrowRight') {
      this.move(1);
    }
    if (ev.key === 'ArrowUp') {
      this.spin();
    }
  }

  @HostListener('document:keyup', ['$event'])
  documentKeyUp(ev: KeyboardEvent) {
    console.log('documentKeyUp', ev);
    if (ev.key === 'ArrowDown') {
      this.down(false);
    }
  }

  ngOnDestroy() {
    this.stop();
  }

}
