import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-timbiriche',
  templateUrl: './timbiriche.page.html',
  styleUrls: ['./timbiriche.page.scss'],
})
export class TimbirichePage implements OnInit {

  table: any[][];
  score = [0, 0];
  player = 1;

  constructor(public alertController: AlertController) { }

  ngOnInit() {
    this.init();
  }

  init() {
    this.player = 1;
    this.score = [0, 0];
    this.table = new Array(6).fill(null).map((row, ir) => new Array(6).fill(null).map((col, ic) => {
      return {
        row: ir,
        column: ic,
        count: 0,
        over: {}
      };
    }));
    /*for (let row = 0; row < this.table.length; row++) {
      for (let column = 0; column < this.table[row].length; column++) {
        this.table[row][column].row = row;
        this.table[row][column].column = column;
        this.table[row][column].count = 0;
        this.table[row][column].over = {};
      }
    }*/
    console.log(this.table);
  }

  changePlayer() {
    if (this.player === 1) {
      this.player = 2;
    } else {
      this.player = 1;
    }
  }

  getNextCell(cell, offsetRow, offsetCol) {
    const row = cell.row + offsetRow;
    const col = cell.column + offsetCol;
    if (row >= 0 && row < this.table.length && col >= 0 && col < this.table[row].length) {
      return this.table[row][col];
    }
    return null;
  }

  playCell(cell, x, y) {
    const arrPos = [];
    arrPos['P-10'] = 'top';
    arrPos['P01'] = 'right';
    arrPos['P10'] = 'bottom';
    arrPos['P0-1'] = 'left';
    const pos = 'P' + x + '' + y;
    if (!cell[arrPos[pos]]) {
      cell[arrPos[pos]] = this.player;
      cell.count = cell.count + 1;
      const nextCell = this.getNextCell(cell, x, y);
      if (nextCell) {
        nextCell[arrPos['P' + x * -1 + '' + y * -1]] = this.player;
        nextCell.count = nextCell.count + 1;
      }

      let point = false;
      if (cell.top && cell.right && cell.bottom && cell.left) {
        cell.player = this.player;
        this.score[this.player - 1] += 1;
        point = true;
      }

      if (nextCell && nextCell.top && nextCell.right
        && nextCell.bottom && nextCell.left
      ) {
        nextCell.player = this.player;
        this.score[this.player - 1] += 1;
        point = true;
      }
      if (!point) {
        this.changePlayer();
      }
      if (this.player === 2) {
        setTimeout(() => {
          this.playBot();
        }, 500);
      }
      if(this.score[0] + this.score[1] === 6 * 6) {
        this.endGame();
      }
    }
  }

  onClickCell(event, cell) {
    console.log('onClickCell', event);
    if (this.player === 1) {
      if (event.offsetY < 10) {
        this.playCell(cell, -1, 0);
      } else if (event.offsetX > event.target.offsetWidth - 10) {
        this.playCell(cell, 0, 1);
      } else if (event.offsetY > event.target.offsetHeight - 10) {
        this.playCell(cell, 1, 0);
      } else if (event.offsetX < 10) {
        this.playCell(cell, 0, -1);
      }
    }
  }

  onMouseoutCell(event, cell) {
    console.log('onMouseoutCell', event);
    if (this.player === 1) {
      cell.over = {};
    }
  }

  onMousemoveCell(event, cell) {
    console.log('onMousemoveCell', event);
    if (this.player === 1) {
      if (!cell.player) {
        cell.over = {};
        const top = cell.top;
        const right = cell.right;
        const bottom = cell.bottom;
        const left = cell.left;
        if (!top && event.offsetY < 10) {
          cell.over.top = this.player;
        } else if (!right && event.offsetX > event.target.offsetWidth - 10) {
          cell.over.right = this.player;
        } else if (!bottom && event.offsetY > event.target.offsetHeight - 10) {
          cell.over.bottom = this.player;
        } else if (!left && event.offsetX < 10) {
          cell.over.left = this.player;
        }
      }
    }
  }

  playBot() {
    // console.log('playBot');
    // var puntuar = [];
    const good = [];
    const bad = [];
    // tslint:disable-next-line: prefer-for-of
    for (let row = 0; row < this.table.length; row++) {
      // tslint:disable-next-line: prefer-for-of
      for (let column = 0; column < this.table[row].length; column++) {
        const data = this.table[row][column];
        if (!data.player) {
          const count = data.count;
          if (count === 3) {
            // puntuar.push(table[row][column]);
            if (!data.top) {
              this.playCell(this.table[row][column], -1, 0);
              return;
            }
            if (!data.right) {
              this.playCell(this.table[row][column], 0, 1);
              return;
            }
            if (!data.bottom) {
              this.playCell(this.table[row][column], 1, 0);
              return;
            }
            if (!data.left) {
              this.playCell(this.table[row][column], 0, -1);
              return;
            }
          }
          if (count === 2) {
            bad.push(this.table[row][column]);
          }
          if (count < 2) {
            good.push(this.table[row][column]);
          }
        }
      }
    }
    // good.sort((a, b) => (parseInt(b.count) + Math.random()) - (parseInt(a.count) + Math.random()));
    // for (var cell of good) {
    if (good.length > 0) {
      const cell = good[Math.floor(Math.random() * good.length)];
      const data = cell;
      const play = [];
      if (!data.top) {
        const nextCell = this.getNextCell(cell, -1, 0);
        if (!nextCell || nextCell.count < 2) {
          play.push([-1, 0]);
        }
      }
      if (!data.right) {
        const nextCell = this.getNextCell(cell, 0, 1);
        if (!nextCell || nextCell.count < 2) {
          play.push([0, 1]);
        }
      }
      if (!data.bottom) {
        const nextCell = this.getNextCell(cell, 1, 0);
        if (!nextCell || nextCell.count < 2) {
          play.push([1, 0]);
        }
      }
      if (!data.left) {
        const nextCell = this.getNextCell(cell, 0, -1);
        if (!nextCell || nextCell.count < 2) {
          play.push([0, -1]);
        }
      }
      if(play.length > 0) {
        const p = play[Math.floor(Math.random() * play.length)];
        this.playCell(cell, p[0], p[1]);
        return;
      }
    }
    if(bad.length > 0) {
      const cell = bad[Math.floor(Math.random() * bad.length)];
      const data = cell;
      if (!data.top) {
        this.playCell(cell, -1, 0);
        return;
      }
      if (!data.right) {
        this.playCell(cell, 0, 1);
        return;
      }
      if (!data.bottom) {
        this.playCell(cell, 1, 0);
        return;
      }
      if (!data.left) {
        this.playCell(cell, 0, -1);
        return;
      }
    } else {
      this.endGame();
    }
  }

  async endGame() {
    await this.presentAlert('Final de la partida.', 'Gana el juegador #' + (this.score[0] > this.score[1] ? '1' : '2'));
    // this.init();
  }

  async presentAlert(header, message, subHeader = null) {
    const alert = await this.alertController.create({
      header,
      subHeader,
      message,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            // resolve('Ok');
          }
        }
      ]
    });

    await alert.present();
    await alert.onDidDismiss();
  }

}
