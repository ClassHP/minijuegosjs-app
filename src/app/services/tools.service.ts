import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToolsService {

  constructor(
    public alertController: AlertController,
    public toastController: ToastController
  ) { }

  async presentAlert(header, message, subHeader = null, btnOkText = 'Ok') {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: [btnOkText]
    });

    await alert.present();
    await alert.onDidDismiss();
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
