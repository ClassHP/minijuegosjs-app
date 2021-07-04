import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-wordsearch',
  templateUrl: './wordsearch.page.html',
  styleUrls: ['./wordsearch.page.scss'],
})
export class WordsearchPage implements OnInit {

  matrix = [];
  words = [];
  wordsAll;
  selection: { firstCell: any, word: string, cells: any[] } = null;

  constructor() { 
    this.wordsAll = require('./words-es.json');
  }

  ngOnInit() {
    this.init();
  }

  init() {
    //const abc = 'AAAAABBBCCCDDDEEEEEFFGGGHHIIIIIJJKKLLMMMNNNÑÑOOOOOPPQQRRSSSTTTUUUUUVVWWXXYYZZ';
    const abc = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';
    this.matrix = new Array(14).fill([]).map((obj2, row) => {
      return new Array(12).fill({}).map((obj2, col) => {
        return { c: abc[Math.floor(Math.random() * abc.length)], words: [], row: row, col: col }
      })
    });
    
    this.words = new Array(8).fill({ }).map(() => {
      let word = '';
      do { 
        word = this.wordsAll[Math.floor(Math.random() * this.wordsAll.length)].toUpperCase();
      } while(word.length > 12);
      return { word, finded: false };
    });
    
    for(let word of this.words) {
      let restart = false;
      do {
        restart = false;
        let randRow = Math.floor(Math.random() * this.matrix.length);
        let randCol = Math.floor(Math.random() * 
          (randRow < this.matrix[0].length - word.word.length ? 
              this.matrix[0].length : this.matrix[0].length - word.word.length));
        let angleRow = Math.floor(Math.random() * 3) - 1;
        let angleCol = Math.floor(Math.random() * 3) - 1;
        while(angleRow == 0 && angleCol == 0
          || ((randRow + word.word.length * angleRow) > this.matrix.length)
          || ((randCol + word.word.length * angleCol) > this.matrix[0].length)
          || ((randRow + word.word.length * angleRow) < 0)
          || ((randCol + word.word.length * angleCol) < 0)) {
          angleRow = Math.floor(Math.random() * 2);
          angleCol = Math.floor(Math.random() * 2);
        }
        let wordSimple = this.removeAcents(word.word);        
        wordSimple = angleCol < 0 || (angleRow < 0 && angleCol == 0) ? this.reverseWord(wordSimple) : wordSimple;
        for(let i = 0; i < wordSimple.length; i++) {
          let col = this.matrix[randRow + i * angleRow][randCol + i * angleCol];
          if(col.words.length > 0 && col.c != word.word[i]) {
            restart = true;
          }
        }
        if (!restart) {
          //console.log(word.word, randRow, randCol, angleRow, angleCol);
          for(let i = 0; i < word.word.length; i++) {
            this.matrix[randRow + i * angleRow][randCol + i * angleCol].c = wordSimple[i];
            this.matrix[randRow + i * angleRow][randCol + i * angleCol].words.push(word);
            //this.matrix[randRow + i * angleRow][randCol + i * angleCol].finded = true;
          }
        }
      } while(restart);
    }
  }

  removeAcents(word) {
    const find = "ÁÉÍÓÚ";
    const replace = "AEIOU";
    for(let i=0; i < find.length; i++) {
      word = word.split(find[i]).join(replace[i]);
    }
    return word;
  }

  reverseWord(word) {
    let reverse = "";
    for(let i=0; i < word.length; i++) {
      reverse += word[word.length - i - 1];
    }
    return reverse;
  }

  onTouchStartCell(event, col) {
    this.onMouseDownCell(event, col);
    event.preventDefault();
  }

  onTouchMoveCell(event, col) {
    if (this.selection != null) {
      var xPos = event.touches[0].pageX;
      var yPos = event.touches[0].pageY;
      let element = document.elementFromPoint(xPos, yPos) as any;
      if(element.dataset.row && element.dataset.col) {
        let col = this.matrix[element.dataset.row][element.dataset.col];
        this.onMouseEnterCell(event, col);
      }
    }
  }

  onMouseDownCell(event, col) {
    if(this.selection == null) {
      this.selection = { firstCell: col, word: col.c, cells: [col] };
      col.selected = true;
    }
  }

  onMouseEnterCell(event, col) {
    if (this.selection != null) {
      console.log("col", col);
      let rowDif = col.row - this.selection.firstCell.row;
      let colDif = col.col - this.selection.firstCell.col;
      let length = (Math.abs(rowDif) > Math.abs(colDif)? Math.abs(rowDif) : Math.abs(colDif)) + 1;
      let rowAngle = rowDif > 0 ? 1 : (rowDif < 0 ? -1 : 0);
      if(this.selection.firstCell.row + rowAngle * length > this.matrix.length) {
        rowAngle = 0;
      }
      let colAngle = colDif > 0 ? 1 : (colDif < 0 ? -1 : 0);
      if(this.selection.firstCell.col + colAngle * length > this.matrix[0].length) {
        colAngle = 0;
      }
      for(let cell of this.selection.cells) {
        cell.selected = false;
      }
      this.selection.cells = [];
      this.selection.word = '';
      for(let i=0; i < length; i++) {
        let cell = this.matrix[this.selection.firstCell.row + i * rowAngle]
          [this.selection.firstCell.col + i * colAngle];
          cell.selected = true;
          this.selection.word += cell.c;
          this.selection.cells.push(cell);
      }
    }
  }

  onMouseUpCell(event) {
    if (this.selection != null) {
      for(let cell of this.selection.cells) {
        cell.selected = false;
      }
      for(let word of this.words) {        
        let wordSimple = this.removeAcents(word.word);
        let reverse = this.reverseWord(wordSimple);
        if(wordSimple == this.selection.word || reverse == this.selection.word) { 
          word.finded = true;         
          for(let cell of this.selection.cells) {
            cell.finded = true;
          }
        }
      }
      this.selection = null;
    }
  }

}
