import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  public playerId = 'p' + Math.floor(Math.random() * 9999);
  room: DocumentReference;
  roomData: any;
  private roomSubs;
  players: any[] = [];
  private playersSubs;
  currentPlayer: any;

  constructor(public db: AngularFirestore) { }

  public async joinOrCreate(gameId: string, maxPlayers: number, roomId?: string,
    onRoomCreate?: (roomData) => void, onRoomChange?: (room) => void, onPlayersChange?: (players) => void) {
    var roomDoc: DocumentReference;
    if(roomId) {
      var doc = await this.db.firestore.doc('rooms/' + roomId).get();
      if(doc.exists) {
        roomDoc = doc.ref;
      }
    } else {
      var roomCol = this.db.collection("rooms", q => 
        q.where('gameId', '==', gameId).where('status', '==', 'finding').orderBy('date').limit(1)
      );
      var rooms = await roomCol.get().toPromise();
      if(rooms.size > 0) {
        roomDoc = rooms.docs[0].ref;
      }
    }
    if(!roomDoc) {
      var roomData = {
        gameId: gameId,
        status: 'finding',
        date: new Date(),
        numPlayers: 1,
        host: this.playerId
      };
      if(onRoomCreate) {
        onRoomCreate(roomData);
      }
      roomDoc = await this.db.collection("rooms").add(roomData);
    } else {
      var data = (await roomDoc.get()).data();
      if(data.numPlayers + 1 >= maxPlayers) {
        await roomDoc.set({ numPlayers: data.numPlayers + 1, status: 'playing' }, { merge: true });
      } else {
        await roomDoc.set({ numPlayers: data.numPlayers + 1 }, { merge: true });
      }
    }
    await roomDoc.collection('players').doc(this.playerId).set({
      playerId: this.playerId
    });

    this.roomSubs = roomDoc.onSnapshot(data => {
      this.roomData = data.data();
      if(onRoomChange) {
        onRoomChange(this.roomData);
      }
    });

    this.playersSubs = roomDoc.collection('/players').onSnapshot(data => {
      this.players = data.docs.map(doc => doc.data());
      if(onPlayersChange) {
        onPlayersChange(this.players);
      }
      this.currentPlayer = this.getCurrentPlayer().player;
    });
    this.room = roomDoc;
    return roomDoc;
  }

  leaveRoom() {
    if(this.roomSubs) {
      this.roomSubs();
    }
    if(this.playersSubs) {
      this.playersSubs();
    }
    if(this.room) {
      this.room.collection('players').doc(this.playerId).delete();
    }
  }

  async setRoomData(data) {
    console.log('setRoomData', this.room.path);
    await this.room.set(data, { merge: true });
  }

  async setPlayerData(data, playerId = this.playerId) {
    await this.room.collection('players').doc(playerId).set(data, { merge: true });
  }

  async setAllPlayerData(data) {
    var batch = this.db.firestore.batch();
    for(let player of this.players) {
      let doc = this.room.collection('players').doc(player.playerId);      
      batch.set(doc, data, { merge: true });
    }
    await batch.commit();
  }

  getCurrentPlayer() {
    let index = 0;
    for(let player of this.players) {
      if(player.playerId == this.playerId) {
        return { player, index };
      }
      index++;
    }
  }

  public playersObservable(room: DocumentReference) {
    return this.db.collection(room.path + '/players').valueChanges();
  }
}
