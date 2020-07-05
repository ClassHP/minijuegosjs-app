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
      if (room.status === 'end') {
        if (room.loser === this.gameService.playerId) {
          this.toolsService.presentAlert('¡Fin del juego!', `Eres el BURRO 🦓 😝`);
        } else {
          this.toolsService.presentAlert('¡Fin del juego!', `🎉 No eres el BURRO 👍`);
        }
        this.gameService.leaveRoom();
      }
    }, async players => {
      console.log(players);
    }, message => {
      if (message.type === 'endRound') {
        if (message.loser === this.gameService.playerId) {
          this.toolsService.presentAlert('Fin de la ronda', `😓 Llevas la ${message.letter}, ahora: ${message.burro}`);
        } else {
          this.toolsService.presentAlert('Fin de la ronda', `Todo bien 👍`);
        }
      }
    });
  }

  async discard(index) {
    const current = this.gameService.currentPlayer;
    if (!current.discardTo && current.cards.length === 4) {
      await this.gameService.setStateData({ state: 'discard', index });
    }
  }

  async takeNext() {
    const current = this.gameService.currentPlayer;
    if (current.discard && current.cards.length < 4) {
      await this.gameService.setStateData({ state: 'takeNext' });
    }
  }

  isBurro() {
    if (this.gameService.currentPlayer.enableBurro || this.gameService.roomData.enableBurro) {
      return true;
    }
    return false;
  }

  async burro() {
    if (this.isBurro()) {
      this.gameService.currentPlayer.enableBurro = false;
      await this.gameService.setStateData({ state: 'setBurro' });
    }
  }

  isNextEnabe() {
    if (this.gameService?.currentPlayer?.discard) {
      return true;
    }
    return false;
  }

  ngOnDestroy() {
    console.log('ngOnDestroy');
    this.gameService.leaveRoom();
  }

}
