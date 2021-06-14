import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ToolsService } from 'src/app/services/tools.service';
import { WordDetailComponent } from './word-detail/word-detail.component';

interface IWord {
  i: number,
  w: string,
  d: string,
  arist: {
    w: IWord,
    ci: number,
    ci2: number
  }[],
  rec?: {
    estado: boolean,
    distancia: number,
    padre: IWord,
    x?: number,
    y?: number,
    ci?: number
  }
}

@Component({
  selector: 'app-crosswords',
  templateUrl: './crosswords.page.html',
  styleUrls: ['./crosswords.page.scss'],
})
export class CrosswordsPage implements OnInit {
  wordsAll: { w: string, d: string }[];
  words: IWord[];
  matrix = [];
  words2: any[];
  zoom = 1;

  constructor(
    public modalController: ModalController,
    public toolsService: ToolsService
  ) {
    this.wordsAll = require('./diccionario-crucigrama.json');
  }

  ngOnInit() {
    this.init();
  }

  init() {
    this.words = [];
    for (let i = 0; i < 15; i++) {
      let rand = Math.floor(Math.random() * this.wordsAll.length);
      let word = this.wordsAll[rand];
      let w = word.w.toUpperCase();
      
      const find = "ÁÉÍÓÚ";
      const replace = "AEIOU";
      for(let i=0; i < find.length; i++) {
        w = w.split(find[i]).join(replace[i]);
      }

      this.words.push({ i: i, w: w, d: word.d, arist: [] })
    }
    this.calcularAristas();
    let tablas = this.calcularTablas();
    let tabla = tablas[0];
    console.log(tabla);

    this.matrix = new Array(tabla.zx).fill([]).map(() => new Array(tabla.zy).fill({}));
    this.words2 = tabla.words;
    for (let w of tabla.words) {
      for (let i = 0; i < w.w.length; i++) {
        let x = w.h ? w.x + i : w.x;
        let y = w.h ? w.y : w.y + i;
        this.matrix[x][y] = { c: w.w[i].toUpperCase(), w: w, check: false };
      }
    }
    console.log('this.matix', this.matrix);
  }

  calcularAristas() {
    this.words.sort((a, b) => {
      return b.w.length - a.w.length
    });
    for (let ind1 = 0; ind1 < this.words.length; ind1++) {
      let w = this.words[ind1];
      w.i = ind1;
      for (let ind2 = 0; ind2 < w.w.length; ind2++) {
        let c = w.w[ind2];
        if (ind1 + 1 < this.words.length) {
          for (let ind3 = ind1 + 1; ind3 < this.words.length; ind3++) {
            let w2 = this.words[ind3];
            for (let ind4 = 0; ind4 < w2.w.length; ind4++) {
              let c2 = w2.w[ind4];
              if (!(ind2 == 0 && ind4 == 0) && c == c2) {
                w.arist.push({ w: w2, ci: ind2, ci2: ind4 });
                w2.arist.push({ w: w, ci: ind4, ci2: ind2 });
              }
            }
          }
        }
      }
    }
  }

  recorridoAnchura(n) {
    var dim = 200;
    var tabla = new Array(dim).fill({}).map(() => new Array(dim).fill({}));
    let size = { minX: dim / 2, maxX: dim / 2, minY: dim / 2, maxY: dim / 2 };
    for (let w of this.words) {
      w.rec = { estado: false, distancia: 9999, padre: null };
    }
    n.rec = { estado: true, distancia: 0, padre: null, x: dim / 2, y: dim / 2, ci: 0 };
    let cola = [];
    cola.push(n);
    this.escribirPalabra(tabla, n, size);
    while (cola.length > 0) {
      let w = cola.shift();
      for (let ind1 = 0; ind1 < w.arist.length; ind1++) {
        let arist = w.arist[ind1];
        if (!arist.w.rec.estado) {
          let nx = (w.rec.distancia % 2 == 0) ? w.rec.x + arist.ci : w.rec.x - arist.ci2;
          let ny = (w.rec.distancia % 2 != 0) ? w.rec.y + arist.ci : w.rec.y - arist.ci2;
          arist.w.rec.x = nx;
          arist.w.rec.y = ny;
          arist.w.rec.ci = arist.ci2;
          arist.w.rec.distancia = w.rec.distancia + 1;
          if (this.varificarPalabra(tabla, arist.w)) {
            arist.w.rec.estado = true;
            arist.w.rec.padre = w;
            cola.push(arist.w);
            this.escribirPalabra(tabla, arist.w, size);
          }
        }
      }
    }
    for (let w of this.words) {
      if (!w.rec.estado) {
        return null;
      }
    }
    let sizeX = size.maxX - size.minX + 1;
    let sizeY = size.maxY - size.minY + 1;
    var words = [];
    for (let w of this.words) {
      words.push({
        w: w.w,
        d: w.d,
        x: w.rec.x - size.minX,
        y: w.rec.y - size.minY,
        h: w.rec.distancia % 2 == 0
      });
    }
    words.sort((a, b) => {
      return (a.x - b.x) + (a.y - b.y) / 1000;
    });
    return { wi: n.w, zx: sizeX, zy: sizeY, words: words };
  }

  varificarPalabra(tabla, w) {
    for (let ind1 = -1; ind1 <= w.w.length; ind1++) {
      let nx = (w.rec.distancia % 2 == 0) ? w.rec.x + ind1 : w.rec.x;
      let ny = (w.rec.distancia % 2 != 0) ? w.rec.y + ind1 : w.rec.y;
      if (ind1 == -1 || ind1 == w.w.length) {
        if (tabla[nx][ny].c) {
          return false;
        }
      } else {
        if (tabla[nx][ny].c != w.w[ind1] && tabla[nx][ny].c) {
          return false;
        }
        if (w.rec.distancia % 2 == 0) {
          if (ind1 != w.rec.ci && (tabla[nx][ny - 1].c || tabla[nx][ny + 1].c)) {
            return false;
          }
        } else {
          if (ind1 != w.rec.ci && (tabla[nx - 1][ny].c || tabla[nx + 1][ny].c)) {
            return false;
          }
        }
      }
    }
    return true;
  }

  escribirPalabra(tabla, w, size) {
    for (let ind1 = 0; ind1 < w.w.length; ind1++) {
      let nx = (w.rec.distancia % 2 == 0) ? w.rec.x + ind1 : w.rec.x;
      let ny = (w.rec.distancia % 2 != 0) ? w.rec.y + ind1 : w.rec.y;
      tabla[nx][ny] = { w: w, c: w.w[ind1], i: ind1 };
      size.minX = size.minX > nx ? nx : size.minX;
      size.maxX = size.maxX < nx ? nx : size.maxX;
      size.minY = size.minY > ny ? ny : size.minY;
      size.maxY = size.maxY < ny ? ny : size.maxY;
    }
  }

  calcularTablas() {
    var tablas = [];
    for (let w of this.words) {
      var t = this.recorridoAnchura(w);
      if (t) {
        tablas.push(t);
      }
    }
    tablas.sort((a, b) => {
      return a.zx * a.zy - b.zx * b.zy
    });

    return tablas;
  }

  showTablas(tablas, max) {
    let count = 0;
    for (let t of tablas) {
      var tabla2 = new Array(t.zx).fill(' ').map(() => new Array(t.zy).fill(' '));
      for (let w of t.words) {
        for (let i = 0; i < w.w.length; i++) {
          let x = w.h ? w.x + i : w.x;
          let y = w.h ? w.y : w.y + i;
          tabla2[x][y] = w.w[i];
        }
      }
      let s = "";
      for (let f of tabla2) {
        s += s == "" ? "" : "\r\n";
        for (let c of f) {
          s += c;
        }
      }
      console.log("*********** " + t.wi + " #" + count + " Tamaño: " + t.zx + "x" + t.zy + " ***********");
      console.log(s);
      count++;
      if (max && count > max) {
        break;
      }
    }
  }

  async onSelect(c) {
    if (c.c) {
      const modal = await this.modalController.create({
        component: WordDetailComponent,
        componentProps: {
          'w': c.w,
          'matrix': this.matrix
        }
      });
      await modal.present();
      let result = await modal.onDidDismiss();
      if (result.data.correct) {
        let end = true;
        for(let cw of this.words2) {
          if(!cw.check) {
            end = false;
            break;
          }
        }
        if (end) {
          this.toolsService.presentToast('Crucigrama completado ¡Felicitaciones!', 'success');
        }
      }
    }
  }

}
