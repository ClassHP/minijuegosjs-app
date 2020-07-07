import { Injectable } from '@angular/core';
import { Client, Room } from 'colyseus.js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  public playerId = '';
  public players: any[];
  public room: Room;
  public state: any;
  public currentPlayer: any;

  constructor() { }

  public joinOrCreate(
    gameId: string, numPlayers: number, roomId?: string,
    onStateChange?: (state) => void,
    onPlayerChange?: (player, key) => void,
    onMessage?: (type, message) => void,
    onLeave?: (code) => void
  ) {
    const client = new Client(environment.colyseusUrl);
    client.joinOrCreate<any>(gameId, { numPlayers }).then(room => {
      console.log(room.sessionId, 'joined', room);

      this.room = room;
      this.playerId = room.sessionId;

      room.onStateChange((state) => {
        console.log('onStateChange', state);
        this.state = state;
        this.players = [];
        // tslint:disable-next-line: forin
        for (const p in state.players) {
          this.players.push(state.players[p]);
        }
        onStateChange(state);
      });

      room.onMessage('*', (type, message) => {
        console.log('onMessage', type, message);
        onMessage(type, message);
      });

      room.onLeave((code) => {
        console.log('onMessage', code);
        onLeave(code);
      });

      room.state.players.onChange = (player, key) => {
        console.log('players.onChange', player, key);
        if (key === this.playerId) {
          this.currentPlayer = player;
        }
        onPlayerChange(player, key);
      };

    }).catch(e => {
      console.log('JOIN ERROR', e);
    });
  }

  public send(type, message?) {
    this.room.send(type, message);
  }

  public leaveRoom() {
    this.players = null;
    this.state = null;
    this.currentPlayer = null;
    if (this.room) {
      this.room.leave();
      this.room.removeAllListeners();
      this.room = null;
    }
  }
}
