import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-solitaire',
  templateUrl: './solitaire.page.html',
  styleUrls: ['./solitaire.page.scss'],
})
export class SolitairePage implements OnInit {

  private readonly type = ['H', 'S', 'D', 'C'];
  private readonly numb = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K'];
  cards: string[] = [];
  game: { columns: string[][], end: string[][], transition: string[] }
  selected: { card: string, icol: number, icard: number }[] = [];
  drag: { top: string, left: string, offsetX: number, offsetY: number } = null;
  selectedDrag: { card: string, icol: number, icard: number };
  endgame = false;

  constructor() { 
    this.initCards();
  }

  ngOnInit() {
    this.init();
  }

  init() {
    this.endgame = false;
    this.game = { 
      columns: new Array<string[]>(8).fill([]).map(() => new Array()),
      end: new Array<string[]>(4).fill([]).map(() => new Array()),
      transition: new Array<string>(4)
    }
    let cards = [...this.cards];
    let length = cards.length;
    let counts = [7, 7, 7, 7, 6, 6, 6, 6];
    let col = 0;
    for(let i=0; i < length; i++) {
      this.game.columns[col].push(this.getRandomCard(cards));
      counts[col] --;
      if(counts[col] == 0) {
        col ++;
      }
    }
  }

  initCards() {
    this.cards = [];
    for(let i = 0; i < this.numb.length; i++) {
      for(let j = 0; j < this.type.length; j++) {
        this.cards.push(this.numb[i] + this.type[j]);
      }
    }
  }

  getRandomCard(cards: string[]) {
    let rand = Math.floor(Math.random() * cards.length);
    let card = cards[rand];
    cards.splice(rand, 1);
    return card;
  }

  isValidMove(card1, card2) {
    let numb1 = this.numb.indexOf(card1[0]);
    let type1 = this.type.indexOf(card1[1]);
    let numb2 = this.numb.indexOf(card2[0]);
    let type2 = this.type.indexOf(card2[1]);
    return (numb1 == numb2 + 1 && type1 % 2  != type2 % 2) || card1 == 'XX';
  }

  isValidMoveEnd(card1, card2) {
    let numb1 = this.numb.indexOf(card1[0]);
    let type1 = this.type.indexOf(card1[1]);
    let numb2 = this.numb.indexOf(card2[0]);
    let type2 = this.type.indexOf(card2[1]);
    return (numb1 == numb2 - 1 && type1 == type2) || (card1 == 'ZZ' && numb2 == 0);
  }

  validateEndGame() {
    if(!this.game.columns.find(c => c.length > 0) && !this.game.transition.find(t => !!t)) {
      this.endgame = true;
    }
  }

  onClickCard($event, card, icol, icard) {
    if(this.selected.length == 1) {
      if(card != this.selected[0].card) {
        if(this.isValidMove(card, this.selected[0].card)) {
          if(this.selected[0].icol >= 0) {
            this.game.columns[this.selected[0].icol].splice(this.selected[0].icard, 1);
          } else {
            this.game.transition[this.selected[0].icard] = null;
          }
          this.game.columns[icol].push(this.selected[0].card);
          this.selected = [];
          return;
        }
      }
    }
    if(this.game.columns[icol].length == icard + 1) {
      if(this.selected.length == 0 || card != this.selected[0].card) {
        this.selected = [];
        this.selected.push({ card, icol, icard });
        return;
      }
    }
    this.selected = [];
  }

  onDragCard2($event, card, icol, icard) {
    this.selectedDrag = { card, icol, icard };
    $event.dataTransfer.setData("card", card);
    this.selected = [];
  }
  
  onDragOverCard2($event, card, icol, icard) {
    let data = this.selectedDrag;
    if(data && data.card != card) {
      if(icol >= 0 && icard == this.game.columns[icol].length - 1 && this.isValidMove(card, data.card)) {
        $event.preventDefault();
      }
      if(card == 'ZZ' && this.isValidMoveEnd(this.game.end[icard][0] || 'ZZ', data.card)) {
        $event.preventDefault();
      }
      if(card == '00') {
        $event.preventDefault();
      } 
    }
  }
  
  onDropCard2($event, card, icol, icard) {
    let data = this.selectedDrag;
    if(data) {
      if(data.icol >= 0) {
        this.game.columns[data.icol].splice(data.icard, 1);
      } else {
        this.game.transition[data.icard] = null;
      }
      if(icol >= 0) {        
        this.game.columns[icol].push(data.card);
      } else {
        if(card == '00') {
          this.game.transition[icard] = data.card;
        }
        if(card == 'ZZ') {
          this.game.end[icard].unshift(data.card);
          this.validateEndGame();
        }
      }
    }
  }

  isSelected(card: string) {
    return this.selected.findIndex(item => item.card == card) >= 0;
  }

  isSelectedTop(card) {
    return this.selected.length > 0 && this.selected[this.selected.length - 1].card == card
  }

  onClickTransition(i) {
    if(this.game.transition[i]) {
      if(this.selected.length > 0) {
        this.selected = [];
      }
      this.selected.push({ card: this.game.transition[i], icol: -1, icard: i });
    } else {
      if(this.selected.length == 1 && this.selected[0].icol >= 0) {
        this.game.transition[i] = this.selected[0].card;
        this.game.columns[this.selected[0].icol].splice(this.selected[0].icard, 1);
        this.selected = [];
      }
    }
  }

  onClickEnd(i) {
    if(this.selected.length == 1) {
      let top = this.game.end[i][0] || 'ZZ';
      if(this.isValidMoveEnd(top, this.selected[0].card)) {
        if(this.selected[0].icol >= 0) {
          this.game.columns[this.selected[0].icol].splice(this.selected[0].icard, 1);
        } else {
          this.game.transition[this.selected[0].icard] = null;
        }
        this.game.end[i].unshift(this.selected[0].card);
        this.selected = [];
        this.validateEndGame();
      }
    }
  }

}
