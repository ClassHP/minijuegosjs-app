import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonInput, ModalController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-word-detail',
  templateUrl: './word-detail.component.html',
  styleUrls: ['./word-detail.component.scss'],
})
export class WordDetailComponent implements OnInit {

  @Input() w: any;
  @Input() matrix: any;
  @ViewChild('input', {  static: false }) inputEl: IonInput;
  respuesta = '';
  table: any[][] = [[]];

  constructor(
    public modalController: ModalController, 
    public toastController: ToastController
  ) { }

  ngOnInit() {
    let w = this.w;
    this.table = new Array(1).fill({}).map(() => new Array(w.w.length).fill({}));
    for (let i = 0; i < w.w.length; i++) {
      let x = w.h ? w.x + i : w.x;
      let y = w.h ? w.y : w.y + i;
      this.table[0][i] = this.matrix[x][y];
    }
    console.log(this.table);
    setTimeout(() => {
      this.inputEl.setFocus();
    }, 400);
  }

  dismissModal() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  onChangeRespuesta(event) {
    this.respuesta = event.detail.value;
  }

  compare(w1: string, w2: string) {
    const find = "ÁÉÍÓÚ";
    const replace = "AEIOU";
    w1 = w1.toUpperCase();
    w2 = w2.toUpperCase();
    for(let i=0; i < find.length; i++) {
      w1 = w1.split(find[i]).join(replace[i]);
      w2 = w2.split(find[i]).join(replace[i]);
    }
    return w1 == w2;
  }

  accept(form) {
    //console.log(form);
    //console.log(this.respuesta);
    let w = this.w;
    if (this.compare(w.w, this.respuesta)) {
      this.modalController.dismiss({
        'dismissed': false,
        correct: true
      });
      this.presentToast('¡Respuesta correcta!', 'success');
      for (let i = 0; i < w.w.length; i++) {
        let x = w.h ? w.x + i : w.x;
        let y = w.h ? w.y : w.y + i;
        this.matrix[x][y].check = true;
      }
      this.w.check = true;
      /*this.wdata.status = 3;
      for(let cw of this.wdata.words) {
        if(!cw.check) {
          this.wdata.status = 2;
          break;
        }
      }
      if(this.wdata.status == 3) {
        this.presentToast('Crucigrama completado ¡Felicitaciones!', 'success');
      }*/
    } else {
      this.presentToast('¡Respuesta incorrecta!', 'warning');
      this.respuesta = '';
    }
  }

  async presentToast(message, color) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color
    });
    toast.present();
  }

}
