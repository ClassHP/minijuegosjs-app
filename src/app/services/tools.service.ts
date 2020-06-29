import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToolsService {

  constructor(public alertController: AlertController) { }

  async presentAlert(header, message, subHeader = null, btnOkText = 'Ok') {
    //return new Promise(async (resolve, reject) => {
      const alert = await this.alertController.create({
        header: header,
        subHeader: subHeader,
        message: message,
        buttons: [btnOkText]
      });

      await alert.present();
      await alert.onDidDismiss();
    //});
  }
}
