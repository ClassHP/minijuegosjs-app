import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ColorsTools } from 'src/app/models/colors-tools';

interface ISvgDataColor {
  id: number;
  count: number, 
  fill: string, 
  rgb?: number[], 
  countFilled: number
}

interface ISvgDataPath {
  fill: string,
  style: string,
  stroke: string,
  strokeWidth: string,
  d: string,
  transform?: string,
  selfClosing?: string,
  strokeLinecap?: string,
  strokeLinejoin?: string,
  colorGroup?: number,
  filled: boolean
}

interface ISvgDataG {
  transform?: string,
  paths: ISvgDataPath[],
}

interface ISvgData {
  svgData: boolean,
  viewBox: string,
  enableBackground: string,
  colors: ISvgDataColor[],
  g: ISvgDataG[],
}

@Component({
  selector: 'app-paint',
  templateUrl: './paint.page.html',
  styleUrls: ['./paint.page.scss'],
})
export class PaintPage implements OnInit {

  images = [0, 1, 2, 3, 4, 5];
  svgData: ISvgData = null;
  image = 0;
  colorSelected: ISvgDataColor = null;
  zoom = 97;
  fireworks = false;

  constructor(public sanitizer: DomSanitizer) { }

  ngOnInit() {
  }

  init(item) {
    this.image = item; 
    const svg = require('./data/paint' + item + '.json');

    if(svg.svgData) {
      this.svgData = JSON.parse(JSON.stringify(svg))
      this.colorSelected = this.svgData.colors[0];
    } else {
      this.svgData = {
        svgData: false,
        viewBox: svg.svg['-viewBox'],
        enableBackground: svg.svg['-enable-background'],
        colors: [],
        g: []
      }
      let groups = [];
      if(svg.svg.g && svg.svg.g.path) {
        groups.push({ 
          transform: svg.svg.g['-transform'],
          paths: svg.svg.g.path
        });
      }
      if(svg.svg.g && svg.svg.g.length > 0) {
        groups = svg.svg.g.map(obj => {
          return {
            transform: obj['-transform'],
            paths: obj.path
          }
        });
      }
      if(svg.svg.path) {
        if(svg.svg.path.length > 0) {
          groups.push({ 
            paths: svg.svg.path
          });
        } else {
          groups.push({ 
            paths: [svg.svg.path]
          });
        }
      }
      for(let g of groups) {
        g.paths = g.paths.map((obj) => {
          let fill = obj['-fill'];
          let style = obj['-style'];
          let stroke = obj['-stroke'];
          let strokeWidth = obj['-stroke-width'];
          let color: ISvgDataColor = { 
            id: this.svgData.colors.length, 
            count: 0, 
            fill: '', 
            countFilled: 0 
          };
          
          if(fill && fill != 'none') {
            color.fill = fill;
          }
          if(style) {
            let regex = /fill:#\w+;/;
            let match = regex.exec(style);
            if(match) { 
              fill = match[0].substr(5, 7);
              color.fill = fill;
              style = style.replace(regex, '');
            }
            //style = this.sanitizer.bypassSecurityTrustStyle(style);
          }
          if(color.fill) {
            let rgb = ColorsTools.hexToRgb(color.fill);

            let colorFinded = this.svgData.colors.find(f => {
              let aHsl = ColorsTools.rgbToHsv(rgb);
              let bHsl = ColorsTools.rgbToHsv(f.rgb);
              let newHsl = [ 
                aHsl[0] + (bHsl[0] - aHsl[0]) / 2,
                aHsl[1] + (bHsl[1] - aHsl[1]) / 2,
                aHsl[2] + (bHsl[2] - aHsl[2]) / 2,
              ];
              if(Math.abs(bHsl[1] - aHsl[1]) < 10 &&
                Math.abs(bHsl[2] - aHsl[2]) < 10 &&
                ((newHsl[1] < 25 && newHsl[2] < 25)
                  || newHsl[1] < 15 || newHsl[2] < 15
                )
              ) {
                return true;
              }
              if(Math.abs(bHsl[0] - aHsl[0]) < 10 && 
                Math.abs(bHsl[1] - aHsl[1]) < 10 &&
                Math.abs(bHsl[2] - aHsl[2]) < 10
              ) {
                return true;
              }
              //return f.fill == color.fill;
              //return Math.abs(this.distanceRgb(rgb, f.rgb)) < 10;
            });

            if(colorFinded == null) {
              color.rgb = rgb;
              this.svgData.colors.push(color);
            } else {
              color = colorFinded;              
              let aHsl = ColorsTools.rgbToHsv(color.rgb);
              let bHsl = ColorsTools.rgbToHsv(rgb);
              let newHsl = [ 
                aHsl[0] + (bHsl[0] - aHsl[0]) / 2,
                aHsl[1] + (bHsl[1] - aHsl[1]) / 2,
                aHsl[2] + (bHsl[2] - aHsl[2]) / 2,
              ];
              color.rgb = ColorsTools.hsvToRgb(newHsl);
              color.fill = ColorsTools.rgbToHex(color.rgb);
            }
            color.count ++;
          }
          return {
            fill: fill,
            style: style,
            stroke: stroke,
            strokeWidth: strokeWidth,
            strokeLinecap: obj['-stroke-linecap'],
            strokeLinejoin: obj['-stroke-linejoin'],
            transform: obj['-transform'],
            selfClosing: obj['-self-closing'],
            d: obj['-d'],
            colorGroup: color.fill ? color.id : undefined,
            filled: !color.fill
          }
        });
      }
      this.svgData.g = groups;
      this.svgData.colors = this.svgData.colors.sort((a, b) => {
        let distance = this.distanceRgb(a.rgb, b.rgb);
        return distance;
      });
    }
  }

  indexColor(hsl: number[]) {
    return parseInt('' + Math.floor(hsl[0]) + 
      Math.floor(100 - hsl[1]).toString().padStart(3, '0') + 
      Math.floor(100 - hsl[2]).toString().padStart(3, '0')
    );
  }

  distanceRgb(a: number[], b: number[]) {
    let aHsl = ColorsTools.rgbToHsv(a);
    let bHsl = ColorsTools.rgbToHsv(b);
    /*let aLab = ColorsTools.rgbToLab(a);
    let bLab = ColorsTools.rgbToLab(b);
    let hDif = (bHsl[0] - aHsl[0]);
    return ColorsTools.labDeltaE(aLab, bLab) * (hDif < 0 ? -1 : 1);*/
    return this.indexColor(bHsl) - this.indexColor(aHsl);
  }

  clear() {
    this.fireworks = false;
    this.svgData = null;
  }

  onMouseDownPath(event, path: ISvgDataPath) {
    if(this.svgData.svgData) {
      if(this.colorSelected && path.colorGroup == this.colorSelected.id && !path.filled) {
        path.filled = true;
        this.colorSelected.count --;
        this.colorSelected.countFilled ++;
        if(this.colorSelected.count == 0) {
          let index = this.svgData.colors.indexOf(this.colorSelected);
          this.colorSelected = this.svgData.colors.find((c, i) => c.count > 0 && i > index);
          if(!this.colorSelected) {
            this.colorSelected = this.svgData.colors.find((c, i) => c.count > 0);
            if(!this.colorSelected) {
              this.fireworks = true;
            }
          }
        }
      }
    } else if (!path.filled) {
      path.filled = true;
      this.colorSelected = this.svgData.colors.find((c) => c.id == path.colorGroup);
      this.colorSelected.count --;
      this.colorSelected.countFilled ++;
    }
  }

  onLoadImage(event) {
    console.log(event);
  }

  onClickColor(color) {
    this.colorSelected = color;
  }

  onClickGenerateJson() {
    if(this.svgData) {
      for(let g of this.svgData.g){
        for(let path of g.paths) {
          if(path.filled == true && path.colorGroup != undefined) {
            path.filled = null;
          } else {
            path.filled = true;
          }
        }
      }
      let colors = [];
      for(let color of this.svgData.colors) {
        if(color.countFilled > 0) {
          color.count = color.countFilled;
          color.countFilled = 0;
          color.rgb = undefined;
          colors.push(color);
        } 
      }
      this.svgData.colors = colors;
      this.svgData.svgData = true;
      console.log(JSON.stringify(this.svgData));
    }
  }

}
