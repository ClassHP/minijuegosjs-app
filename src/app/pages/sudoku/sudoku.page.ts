import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Location } from '@angular/common';

interface SudokuCell {
  row: number;
  col: number;
  block: number;
  value: number;
  lock: boolean;
  solution: number;
  notes?: boolean[];
}

interface Sudoku {
  cells: SudokuCell[][];
  marks: { rows: boolean[][], cols: boolean[][], blocks: boolean[][] };
  cols: SudokuCell[][];
  blocks: SudokuCell[][];
  id?: string;
}

@Component({
  selector: 'app-sudoku',
  templateUrl: './sudoku.page.html',
  styleUrls: ['./sudoku.page.scss'],
})
export class SudokuPage implements OnInit {
  public sudoku: Sudoku = null;
  public selected = { row: -1, col: -1, value: -1, block: -1 };
  public enableNote = false;
  private difficulty = 2;
  public showerror = false;
  public endgame = false;
  private id: string;
  
  constructor(
    private alertController: AlertController,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router
  ) { 
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
  }

  ngOnInit() {
    this.init();
  }

  init() {
    this.selected = { row: -1, col: -1, value: -1, block: -1 };
    this.enableNote = false;
    this.showerror = false;
    this.endgame = false;
    if(!this.id) {
      this.presentAlertRadioDifficulty().then(() => {
        this.sudoku = this.getSudoku(this.difficulty);
        this.location.replaceState(this.router.createUrlTree(['sudoku/' + this.sudoku.id]).toString());
      });
    } else {
      this.sudoku = this.getSudokuById(this.id);
      this.id = null;
    }
  }

  getSudoku(difficulty: number) : Sudoku {
    let sudoku = this.getRandomSudokuValid();
    this.prepareSudoku(sudoku, difficulty);
    return sudoku;
  }

  prepareSudoku(sudoku: Sudoku, difficulty: number) {
    let count = 0;
    let availables: { row: number, col: number, block: number, cell: SudokuCell }[] = [];
    do {
      availables = [];
      this.forEachSudoku(sudoku, (row, rowi, col, coli, blocki) => {
        if(!col.lock && col.value > 0) {
          availables.push({ row: rowi, col: coli, block: blocki, cell: col });
        }
      });
      if(availables.length > 0) {
        let cell = this.getRandomArray(availables);
        let value = cell.cell.value;
        cell.cell.value = 0;
        sudoku.marks.rows[cell.row][value - 1] = false;
        sudoku.marks.cols[cell.col][value - 1] = false;
        sudoku.marks.blocks[cell.block][value - 1] = false;        
        this.fillNotes(sudoku, difficulty);
        if(cell.cell.notes.filter(v => v).length > 1) {
          cell.cell.value = value;
          cell.cell.lock = true;
          sudoku.marks.rows[cell.row][value - 1] = true;
          sudoku.marks.cols[cell.col][value - 1] = true;
          sudoku.marks.blocks[cell.block][value - 1] = true;   
        } else {          
          count ++; 
        }
      }
    } while (availables.length > 0 && (count < 50 || difficulty > 2));
    sudoku.id = '';
    this.forEachSudoku(sudoku, (row, rowi, col, coli, blocki) => {
      col.notes = null;
      col.lock = col.value != 0;
      sudoku.id += col.value.toString();
    });
    //this.fillNotes(sudoku, 3, false);
    console.log(count);
  }

  fillNotes(sudoku: Sudoku, difficulty: number) {
    this.forEachSudoku(sudoku, (row, rowi, col, coli, blocki) => {
      col.notes = null;
      if(col.value == 0) {
        col.notes = new Array<boolean>(9).fill(false).map((v, i) => {
          return (!sudoku.marks.rows[rowi][i] && !sudoku.marks.cols[coli][i] 
            && !sudoku.marks.blocks[blocki][i]) || i == col.value - 1;
        });
      }
    });
    if(difficulty > 1) {
      var repeat = false;
      do {
        repeat = false;
        this.forEachSudoku(sudoku, (row, rowi, col, coli, blocki) => {
          if(col.notes && col.notes.filter(v => v).length > 1) {
            let value = -1;
            let countNotes = 0;
            col.notes.forEach((note, notei) => {
              if(note) {
                countNotes ++;
                let clean = false;
                let count = 0;
                this.forEachSudoku(sudoku, (row2, rowi2, col2, coli2, blocki2) => {
                  if(col2.notes && (rowi != rowi2 || coli != coli2)) {
                    if(rowi == rowi2 || coli == coli2 || blocki == blocki2) {
                      if(col2.notes[notei] && col2.notes.filter(v => v).length == 1) {
                        clean = true;
                        repeat = true;
                      }
                      if(col2.notes[notei]) {
                        count ++;
                      }
                    }
                  }
                });
                col.notes[notei] = !clean;
                if(count == 0) {
                  value = notei;
                }
              }
            });
            if(difficulty > 2 && countNotes > 0 && value != -1) {
              col.notes = new Array<boolean>(9).fill(false).map((v, i) => i == value);
              repeat = true;
            }
          }
        });     
        if(difficulty > 2) {   
          let goups = [sudoku.cells, sudoku.cols, sudoku.blocks];
          goups.forEach((cells) => {
            cells.forEach((row, rowi) => {
              let duplicates: SudokuCell[] = [];
              row.forEach((col, coli) => {
                if(col.notes) {
                  let code = col.notes.map(m => m ? '1' : '0').join('');
                  row.forEach((col2, coli2) => {
                    if(coli < coli2 && col2.notes) {
                      let code2 = col2.notes.map(m => m ? '1' : '0').join('');
                      if(code == code2) {
                        duplicates.push(col2);
                      }
                    }
                  });
                }
              });
              if(duplicates.length > 0) {
                duplicates.forEach(cell => {
                  if(cell.notes.filter(v => v).length == 2) {
                    row.forEach((col, coli) => {
                      if(col.notes && col.notes.map(m => m ? '1' : '0').join('') != cell.notes.map(m => m ? '1' : '0').join('')) {
                        col.notes.forEach((n, i) => {
                          if(n && cell.notes[i]) {
                            repeat = true;
                            col.notes[i] = false;
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          });
          sudoku.blocks.forEach((block, blocki) => {
            for(let i = 0; i < 9; i++) {
              let cells = block.filter(cell => cell.notes && cell.notes[i]);
              if(cells.length > 1) {
                if(cells.filter(cell => cell.row != cells[0].row).length == 0) {
                  sudoku.cells[cells[0].row].forEach(cell => {
                    if(cell.block != blocki && cell.notes && cell.notes[i]) {
                      repeat = true;
                      cell.notes[i] = false;
                    }
                  });
                } else if(cells.filter(cell => cell.col != cells[0].col).length == 0) {
                  sudoku.cols[cells[0].col].forEach(cell => {
                    if(cell.block != blocki && cell.notes && cell.notes[i]) {
                      repeat = true;
                      cell.notes[i] = false;
                    }
                  });
                }
              }
            }
          });
        }
      } while(repeat);
    }
  }

  forEachSudoku(sudoku: Sudoku, callbackfn: (
    row: SudokuCell[], rowi: number, col: SudokuCell, coli: number, blocki: number
  ) => void) {
    sudoku.cells.forEach((row, rowi) => row.forEach((col, coli) => {
      callbackfn(row, rowi, col, coli, this.getBlockIndex(rowi, coli));
    }));
  }

  getRandomSudokuValid() : Sudoku {
    let sudoku;
    do {
      sudoku = this.getRandomSudoku();
    } while(sudoku == null);
    return sudoku;
  }

  getSudokuById(id: string) : Sudoku {
    let cells = new Array<SudokuCell[]>(9).fill([]).map(() => new Array<SudokuCell>(9));
    let cellsCols = new Array<SudokuCell[]>(9).fill([]).map(() => new Array<SudokuCell>(9));
    let cellsBlocks = new Array<SudokuCell[]>(9).fill([]).map(() => new Array<SudokuCell>());
    let rows = new Array<boolean[]>(9).fill([]).map(() => new Array<boolean>(9).fill(false));
    let cols = new Array<boolean[]>(9).fill([]).map(() => new Array<boolean>(9).fill(false));
    let blocks = new Array<boolean[]>(9).fill([]).map(() => new Array<boolean>(9).fill(false));
    let index = 0;
    for(let row = 0; row < cells.length; row++) {
      for(let col = 0; col < cells[row].length; col++) {
        let block = this.getBlockIndex(row, col);
        let value = parseInt(id[index], 10) - 1;
        index++;
        if(value > 0) {
          rows[row][value] = cols[col][value] = blocks[block][value] = true;
        }
        cells[row][col] = { row, col, block, value: value + 1, solution: value + 1, lock: value != -1 };
        cellsCols[col][row] = cells[row][col];
        cellsBlocks[block].push(cells[row][col]);
      }
    }
    return { cells: cells, marks: { rows, cols, blocks }, cols: cellsCols, blocks: cellsBlocks };
  }

  getRandomSudoku() : Sudoku {
    let cells = new Array<SudokuCell[]>(9).fill([]).map(() => new Array<SudokuCell>(9));
    let cellsCols = new Array<SudokuCell[]>(9).fill([]).map(() => new Array<SudokuCell>(9));
    let cellsBlocks = new Array<SudokuCell[]>(9).fill([]).map(() => new Array<SudokuCell>());
    let rows = new Array<boolean[]>(9).fill([]).map(() => new Array<boolean>(9).fill(false));
    let cols = new Array<boolean[]>(9).fill([]).map(() => new Array<boolean>(9).fill(false));
    let blocks = new Array<boolean[]>(9).fill([]).map(() => new Array<boolean>(9).fill(false));
    for(let row = 0; row < cells.length; row++) {
      for(let col = 0; col < cells[row].length; col++) {
        let block = this.getBlockIndex(row, col);
        let availables = [];
        for(let i = 0; i < 9; i++) {
          if(!rows[row][i] && !cols[col][i] && !blocks[block][i]) {
            availables.push(i);
          }
        }     
        if(availables.length == 0) {
          return null;
        }
        let value = this.getRandomArray(availables);
        rows[row][value] = cols[col][value] = blocks[block][value] = true;
        cells[row][col] = { row, col, block, value: value + 1, solution: value + 1, lock: false };
        cellsCols[col][row] = cells[row][col];
        cellsBlocks[block].push(cells[row][col]);
      }
    }
    return { cells: cells, marks: { rows, cols, blocks }, cols: cellsCols, blocks: cellsBlocks };
  }

  getBlockIndex(row, col) {
    return Math.floor(row / 3) * 3 + Math.floor(col / 3);
  }

  getRandomArray<T>(array: T[]) {
    let rand = Math.floor(Math.random() * array.length);
    let value = array[rand];
    array.splice(rand, 1);
    return value;
  }

  validateEnd(sudoku: Sudoku) {
    let end = true;
    let error = false;
    this.forEachSudoku(sudoku, (row, rowi, col, coli, blocki) => {
      if(col.value == 0) {
        end = false;
      } else if(col.value != col.solution) {
        error = true;
      }
    });
    this.endgame = end && !error;
    this.showerror = end && error;
  }

  onClickCell(row, col, value) {
    this.selected.row = row;
    this.selected.col = col;
    this.selected.value = value;
    this.selected.block = this.getBlockIndex(row, col);
  }

  onClickKeyboard(value) {
    if(this.selected.value >= 0) {
      let cell = this.sudoku.cells[this.selected.row][this.selected.col];
      if(!cell.lock) {
        if(!this.enableNote || value == 0) {
          cell.value = value;
          cell.notes = null;
          this.selected.value = value;   
          this.forEachSudoku(this.sudoku, (row, rowi, col, coli, blocki) => {
            if(value > 0 && col.notes && (rowi == this.selected.row 
              || coli == this.selected.col || blocki == this.selected.block)
            ) {
              col.notes[value - 1] = false;
            }
          });
          
          this.sudoku.marks.rows[this.selected.row][value - 1] = true;
          this.sudoku.marks.cols[this.selected.col][value - 1] = true;
          this.sudoku.marks.blocks[this.selected.block][value - 1] = true; 
          //this.fillNotes(this.sudoku, 3, false);
          this.validateEnd(this.sudoku);
        } else {
          if(!cell.notes) {
            cell.notes = new Array<boolean>(9).fill(false);
          }
          if(cell.value > 0) {
            cell.notes[cell.value - 1] = cell.value != value;
            cell.value = 0;
          }
          cell.notes[value - 1] = !cell.notes[value - 1];
        }
      }
    }
  }

  onClickPensil() {
    this.enableNote = !this.enableNote;
  }

  onKeydown($event) {
    if('1234567890'.includes($event.key)) {
      this.onClickKeyboard(parseInt($event.key));
    } else if($event.key == 'Delete' || $event.key == 'Backspace') {
      this.onClickKeyboard(0);
    } else if($event.code == 'KeyN') {
      this.onClickPensil();
    }
  }

  async presentAlertRadioDifficulty() {
    let inputs = [];
    let items = ['Fácil', 'Intermedio', 'Difícil'];
    items.forEach((val, i) => {
      inputs.push({
        type: 'radio',
        label: val,
        handler: () => {
          this.difficulty = i + 1;
          alert.dismiss();
        },
        checked: (this.difficulty == i + 1)
      });
    });
    const alert = await this.alertController.create({
      header: 'Dificultad',
      inputs: inputs,
      buttons: ['Aceptar']
    });

    await alert.present();
    await alert.onDidDismiss();
  }

}
