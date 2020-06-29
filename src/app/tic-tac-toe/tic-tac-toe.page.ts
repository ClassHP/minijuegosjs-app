import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { promise } from 'protractor';

@Component({
  selector: 'app-tic-tac-toe',
  templateUrl: './tic-tac-toe.page.html',
  styleUrls: ['./tic-tac-toe.page.scss'],
})
export class TicTacToePage implements OnInit {

  boxs = ['', '', '', '', '', '', '', '', '', ''];
  player = 'X';

  constructor(public alertController: AlertController) { }

  ngOnInit() {
  }

  // Funcion que se ejecuta cuando hacen click en uno de los 9 cuadros
  async onClickBox(boxNum) {
    // Si el cuadro esta vacio 
    if (this.boxs[boxNum] == "") {
      // Se le asigna el valor del jugador actual al cuadro
      this.boxs[boxNum] = this.player;
      // Se cambia el jugador
      this.changePlayer();
      // Esta funcion lo que hace es ejecutar algo luego de un tiempo
      // En este caso se usa para que se muestre el cuadro con el valor de la jugada actual
      //setTimeout(() => {
        // Se detecta si hay un ganador y cual es
        var winner = this.detectWinner();
        // Si hay ganador
        if (winner != "") {
          if (winner != 'E') {
            // Mostrar mensaje al usuario diciendo cual es el ganador
            await this.presentAlert('Fin de la partida', '¡' + winner + ' gana!');
          } else {
            // Mostrar mensaje al usuario diciendo que fue empate
            await this.presentAlert('Fin de la partida', '¡Empate!');
          }
          // Se reinicia el juego
          this.restart();
        }
      //}, 10);
    }
  }

  // Esta funcion devuelve el ganador o vacio "" si no hay ganador todavia
  detectWinner() {
    var boxs = this.boxs;
    // Se verifica si la primera fila es igual para devolver el ganador
    if (boxs[1] == boxs[2] && boxs[1] == boxs[3] && boxs[1] != "") {
      return boxs[1];
    }
    // Se verifica si la primera columna es igual para devolver el ganador
    if (boxs[1] == boxs[4] && boxs[1] == boxs[7] && boxs[1] != "") {
      return boxs[1];
    }
    // Se verifica si la primera diagonal es igual para devolver el ganador
    if (boxs[1] == boxs[5] && boxs[1] == boxs[9] && boxs[1] != "") {
      return boxs[1];
    }
    // Se verifica si la segunda columna es igual para devolver el ganador
    if (boxs[2] == boxs[5] && boxs[2] == boxs[8] && boxs[2] != "") {
      return boxs[2];
    }
    // Se verifica si la tercera columna es igual para devolver el ganador
    if (boxs[3] == boxs[5] && boxs[3] == boxs[7] && boxs[3] != "") {
      return boxs[3];
    }
    // Se verifica si la segunda diagonal es igual para devolver el ganador
    if (boxs[3] == boxs[6] && boxs[3] == boxs[9] && boxs[3] != "") {
      return boxs[3];
    }
    // Se verifica si la segunda fila es igual para devolver el ganador
    if (boxs[4] == boxs[5] && boxs[4] == boxs[6] && boxs[4] != "") {
      return boxs[4];
    }
    // Se verifica si la tercera fila es igual para devolver el ganador
    if (boxs[7] == boxs[8] && boxs[7] == boxs[9] && boxs[7] != "") {
      return boxs[7];
    }
    if (boxs[1] != "" && boxs[2] != "" && boxs[3] != ""
      && boxs[4] != "" && boxs[5] != "" && boxs[6] != ""
      && boxs[7] != "" && boxs[8] != "" && boxs[9] != "") {
      return 'E';
    }
    // Si no hay ganador revuelve vacio ""
    return "";
  }

  // Esta funcion cambia el jugador que le toca
  changePlayer() {
    if (this.player == "X") {
      this.player = "O";
    } else {
      this.player = "X";
    }
  }

  // Esta funcion reinicia la partida
  restart() {
    this.player = "X";
    this.boxs = ['', '', '', '', '', '', '', '', '', ''];
  }

  async presentAlert(header, message, subHeader = null) {
    //return new Promise(async (resolve, reject) => {
      const alert = await this.alertController.create({
        header: header,
        subHeader: subHeader,
        message: message,
        buttons: [
          {
            text: 'Ok',
            handler: () => {
              //resolve('Ok');
            }
          }
        ]
      });

      await alert.present();
      await alert.onDidDismiss();
    //});
  }

}
