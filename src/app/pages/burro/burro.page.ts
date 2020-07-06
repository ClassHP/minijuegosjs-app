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
    await this.gameService.joinOrCreate('burro', maxPlayers, roomId, (room) => {
      console.log(room);
      /*this.status = room.status;*/
    }, async (player, key) => {
      console.log(player, key);
    }, (type, message) => {
      if (type === 'start') {
        this.status = 'playing';
      }
      if (type === 'endRound') {
        if (message.playerIdLoser === this.gameService.playerId) {
          this.toolsService.presentAlert('Fin de la ronda', `😓 Llevas la ${message.letter}, ahora: ${message.burro}`);
        } else {
          this.toolsService.presentAlert('Fin de la ronda', `Todo bien 👍`);
        }
      }
      if (type === 'endGame') {
        if (message.playerIdLoser === this.gameService.playerId) {
          this.toolsService.presentAlert('¡Fin del juego!', `Eres el BURRO 🦓 😝`);
        } else {
          this.toolsService.presentAlert('¡Fin del juego!', `🎉 No eres el BURRO 👍`);
        }
        this.gameService.leaveRoom();
      }
    }, (code) => {
      this.status = 'end';
    });
  }

  async discard(index) {
    const current = this.gameService.currentPlayer;
    if (!current.discardTo && current.cards.length === 4) {
      await this.gameService.send('discard', { index });
    }
  }

  async takeNext() {
    const current = this.gameService.currentPlayer;
    if (current.discardFrom && current.cards.length < 4) {
      await this.gameService.send('takeNext');
    }
  }

  isBurro() {
    if (this.gameService.currentPlayer?.enableBurro || this.gameService.state?.enableBurro) {
      return true;
    }
    return false;
  }

  async burro() {
    if (this.isBurro()) {
      this.gameService.currentPlayer.enableBurro = false;
      await this.gameService.send('setBurro');
    }
  }

  takeNextEnable() {
    return (this.gameService.currentPlayer?.discardFrom && this.gameService.currentPlayer?.cards?.length < 4);
  }

  ngOnDestroy() {
    console.log('ngOnDestroy');
    this.gameService.leaveRoom();
  }

}
