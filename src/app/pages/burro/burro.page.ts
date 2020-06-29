import { Component, OnInit, OnDestroy } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { DocumentReference } from '@angular/fire/firestore';
import { ToolsService } from 'src/app/services/tools.service';

@Component({
  selector: 'app-burro',
  templateUrl: './burro.page.html',
  styleUrls: ['./burro.page.scss'],
})
export class BurroPage implements OnInit, OnDestroy {

  isEnableBurro = false;
  status = 'end';

  constructor(public gameService: GameService, public toolsService: ToolsService ) { }

  ngOnInit() {
  }

  async joinGame(maxPlayers, roomId?) {
    this.status = 'finding';
    await this.gameService.joinOrCreate('burro', maxPlayers, roomId, null, (room) => {
      console.log(room);
      this.status = room.status;
    }, async players => {
      console.log(players);
      var roomData = this.gameService.roomData;
      if(roomData.status == 'playing') {
        if(roomData.host == this.gameService.playerId) {
          if(!roomData.cards) {
            this.initGame();
          }
        }
        this.isEnableBurro = this.isBurro();
        await this.checkEndRound();
      }
    });
  }

  async checkEndRound() {
    // Varificar final de la ronda
    let count = 0;
    let loser = null;
    for(let player of this.gameService.players) {
      if(player.isBurro) {
        count++;
      } else {
        loser = player;
      }
    }
    if(loser && count == this.gameService.players.length-1) {
      if(!this.gameService.currentPlayer.isBurro) {
        let burro = this.gameService.currentPlayer.burro || '';
        let letter = 'BURRO'[burro.length];
        burro = burro + letter;
        await this.gameService.setAllPlayerData({ isBurro: false });
        await this.gameService.setPlayerData({ burro: burro });
        if(burro == 'BURRO') {
          await this.gameService.setRoomData({ status: 'end', loser: this.gameService.playerId });
          this.toolsService.presentAlert('¡Fin del juego!', `Eres el BURRO 🦓 😝`);
          this.gameService.leaveRoom();
        } else {
          this.toolsService.presentAlert('Fin de la ronda', `😓 Llevas la ${letter}, ahora: ${burro}`);
          this.initGame();
        }
      } else {
        if(loser.burro == 'BURR') {
          this.toolsService.presentAlert('¡Fin del juego!', `🎉 No eres el BURRO 👍`);
          this.gameService.leaveRoom();
        } else {
          this.toolsService.presentAlert('Fin de la ronda', `Todo bien 👍`);
        }
      }
    }
  }

  async initGame() {
    let cards = ["2C", "2D", "2H","2S", "3C", "3D", "3H", "3S", "4C", 
      "4D", "4H", "4S", "5C", "5D", "5H", "5S", "6C", "6D", "6H", "6S", 
      "7C", "7D", "7H", "7S", "8C", "8D", "8H", "8S", "9C", "9D", "9H", 
      "9S", "AC", "AD", "AH", "AS", "JC", "JD", "JH", "JS", "KC", "KD", 
      "KH", "KS", "QC", "QD", "QH", "QS", "TC", "TD", "TH", "TS"];
    // Se revuelve el mazo
    for(var i = 0; i < cards.length; i++) {
      var aleatorio = Math.floor(Math.random() * cards.length);
      var card = cards[aleatorio];
      cards[aleatorio] = cards[i];
      cards[i] = card;
    }
    await this.gameService.setRoomData({ cards: cards });
    for(let player of this.gameService.players) {
      var data = { cards: [], discard: null }
      for(let i = 0; i < 4; i++) {
        data.cards.push(cards.pop());
      }
      await this.gameService.setPlayerData(data, player.playerId);
    }
    await this.gameService.setRoomData({ cards: cards });
  }

  async discard(index) {
    let current = this.gameService.getCurrentPlayer();
    if(!current.player.discard && current.player.cards.length == 4) {
      let cards = current.player.cards;
      let discard = current.player.cards[index];
      cards.splice(index, 1);
      if(current.index < this.gameService.players.length - 1) {
        current.player.discard = discard;
        await this.gameService.setPlayerData({ cards: cards, discard: discard });
      } {
        this.gameService.roomData.cards.unshift(discard);
        await this.gameService.setRoomData({ cards: this.gameService.roomData.cards });
        await this.gameService.setPlayerData({ cards: cards });
      }
    }
  }

  async takeNext() {
    let current = this.gameService.getCurrentPlayer();
    let cards = current.player.cards;
    if(cards.length < 4) {
      if(current.index == 0) {
        cards.push(this.gameService.roomData.cards.pop());
        await this.gameService.setPlayerData({ cards: cards });
        await this.gameService.setRoomData({ cards: this.gameService.roomData.cards });
      } else {
        let prevPlayer = this.gameService.players[current.index - 1];
        if(prevPlayer.discard) {
          cards.push(prevPlayer.discard);
          await this.gameService.setPlayerData({ discard: null }, prevPlayer.playerId);
          await this.gameService.setPlayerData({ cards: cards });
        }
      }
    }
  }

  isBurro() {
    if(!this.gameService.currentPlayer || this.gameService.currentPlayer.isBurro) {
      return false;
    }
    let count = 0;
    for(let player of this.gameService.players) {
      if(player.isBurro) {
        count++;
      }
    }
    if(count > 0 && count < this.gameService.players.length) {
      return true;
    }
    if(this.gameService.currentPlayer.cards && this.gameService.currentPlayer.cards.length == 4) {
      let countVal = 0;
      let countFig = 0;
      let firstCard = this.gameService.currentPlayer.cards[0];
      for(let card of this.gameService.currentPlayer.cards) {
        if(card[0] == firstCard[0]) {
          countVal ++;
        }
        if(card[1] == firstCard[1]) {
          countFig ++;
        }
      }
      if(countVal == 4 || countFig == 4) {
        return true;
      }
    }
    return false;
  }

  async burro() {
    if(this.isBurro()) {
      this.gameService.currentPlayer.isBurro = true;
      this.isEnableBurro = false;
      await this.gameService.setPlayerData({ isBurro: true });
    }
  }

  isNextEnabe() {
    let current = this.gameService.getCurrentPlayer();
    let cards = current.player.cards;
    if(cards.length < 4) {
      if(current.index == 0) {
        return true;
      } else {
        let prevPlayer = this.gameService.players[current.index - 1];
        if(prevPlayer.discard) {
          return true;
        }
      }
    }
    return false;
  }

  ngOnDestroy() {
    console.log('ngOnDestroy');
    this.gameService.leaveRoom();
  }

}
