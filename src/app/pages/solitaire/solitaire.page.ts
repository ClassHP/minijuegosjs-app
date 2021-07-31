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
  game: { columns: string[][], end: string[][], transition: string[], transition2: string[], visibles: any; }
  selected: { card: string, icol: number, icard: number }[] = [];
  drag: { top: string, left: string, offsetX: number, offsetY: number } = null;
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
      columns: new Array<string[]>(7).fill([]).map(() => new Array()),
      end: new Array<string[]>(4).fill([]).map(() => new Array()),
      transition: [],
      transition2: [], 
      visibles: {}
    }
    let cards = [...this.cards];
    let counts = [1, 2, 3, 4, 5, 6, 7];
    for(let col = 0; col < counts.length;) {
      let card = this.getRandomCard(cards);
      this.game.columns[col].push(card);
      counts[col] --;
      if(counts[col] == 0) {
        this.game.visibles[card] = true;
        col ++;
      }
    }
    while(cards.length > 0) {
      this.game.transition.push(this.getRandomCard(cards));
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
    return (numb1 == numb2 + 1 && type1 % 2  != type2 % 2) || (card1 == 'XX' && numb2 == 12);
  }

  isValidMoveEnd(card1, card2) {
    let numb1 = this.numb.indexOf(card1[0]);
    let type1 = this.type.indexOf(card1[1]);
    let numb2 = this.numb.indexOf(card2[0]);
    let type2 = this.type.indexOf(card2[1]);
    return (numb1 == numb2 - 1 && type1 == type2) || (card1 == 'ZZ' && numb2 == 0);
  }

  validateEndGame() {
    if(!this.game.end.find(c => c.length < 13)) {
      this.endgame = true;
    }
  }

  onDragstartCard($event, card, icol, icard) {
    if($event) {
      $event.dataTransfer.setData("card", card);
    }
    this.selected = [];
    if(icol >= 0) {
      for(; icard < this.game.columns[icol].length; icard++) {
        this.selected.push({ card: this.game.columns[icol][icard], icol, icard });
      }
    } else {
      this.selected.push({ card, icol, icard });
    }
  }

  onDragendCard() {
    this.selected = [];
  }
  
  onDragoverCard($event, card, icol, icard) {
    let data = this.selected[0];
    if(data && data.icol != icol) {
      if(icol >= 0 && icard == this.game.columns[icol].length - 1 && this.isValidMove(card, data.card)) {
        $event.preventDefault();
      }
      if(this.selected.length == 1 && icol == -1 
        && this.isValidMoveEnd(card, data.card)) {
        $event.preventDefault();
      }
    }
  }
  
  onDropCard($event, card, icol, icard) {
    let data = this.selected[0];
    if(data) {
      if(data.icol >= 0) {
        let col = this.game.columns[data.icol];
        col.splice(data.icard, this.selected.length);
        if(col.length > 0) {
          this.game.visibles[(col[col.length - 1])] = true;
        }
      } else if(data.icol == -2) {
        this.game.transition2.shift();
        this.game.visibles[data.card] = true;
      } else if(data.icol == -1) {
        this.game.end[data.icard].shift();
      }
      if(icol >= 0) {        
        this.game.columns[icol].push(...this.selected.map(m => m.card));
      } else if(icol == -1) {
        this.game.end[icard].unshift(data.card);
        this.validateEndGame();
      }
    }
    this.selected = [];
  }

  onClickCard($event, card, icol, icard) {
    if(this.selected.length == 0 && (this.game.visibles[card] || icol < 0)) {
      this.onDragstartCard(null, card, icol, icard);
      return;
    }
    let data = this.selected[0];
    if(data && data.icol != icol) {
      if((icol >= 0 && icard == this.game.columns[icol].length - 1 && this.isValidMove(card, data.card))
        || (this.selected.length == 1 && icol < 0 
          && this.isValidMoveEnd(this.game.end[icard][0] || 'ZZ', data.card))
      ) {
        this.onDropCard($event, card, icol, icard);
        return;
      }
    }    
    this.selected = [];
  }

  isDragable(card) {
    return this.game.visibles[card];
  }

  isSelected(card: string) {
    return this.selected.findIndex(item => item.card == card) >= 0;
  }

  isSelectedTop(card) {
    return this.selected.length > 0 && this.selected[0].card == card
  }

  onClickTransition1() {
    if(this.game.transition.length > 0) {
      this.game.transition2.unshift(this.game.transition.pop());
    } else {
      this.game.transition = this.game.transition2;
      this.game.transition2 = [];
    }
  }

}
