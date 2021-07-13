import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ColorsTools } from 'src/app/models/colors-tools';

interface ISvgDataColor {
  count: number, 
  fill: string, 
  rgb: { r: number, g: number, b: number }, 
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
  colorGroup: string,
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
  colorSelected = null;
  zoom = 97;
  //svgUrl;
  //@ViewChild('gameObject') gameSvg: ElementRef;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
  }

  init(item) {
    this.image = item; 
    //this.svgUrl = this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/paint/paint' + item +'.svg');
    //console.log(this.svgUrl);
    const svg = require('./data/paint' + item + '.json');

    if(svg.svgData) {
      this.svgData = JSON.parse(JSON.stringify(svg))
      this.svgData.colors = this.svgData.colors.sort((a, b) => {
        return this.distanceRgb(a.rgb, b.rgb);
      });
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
          let fill = obj['-fill'] || "#000000";
          let style = obj['-style'];
          let stroke = obj['-stroke'];
          let strokeWidth = obj['-stroke-width'];
          let color = { count: 0, fill: '', rgb: { r:0, g:0, b:0 }, countFilled: 0 };
          
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
            style = this.sanitizer.bypassSecurityTrustStyle(style);
          }
          if(color.fill) {
            let rgbArr = ColorsTools.hexToRgb(color.fill);
            let rgb = { r: rgbArr[0], g: rgbArr[1], b: rgbArr[2] };

            let colorFinded = this.svgData.colors.find(f => {
              return Math.abs(this.distanceRgb(rgb, f.rgb)) < 10;
            });

            if(colorFinded == null) {
              color.rgb = rgb;
              this.svgData.colors.push(color);
            } else {
              color = colorFinded;
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
            colorGroup: color.fill,
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

  distanceRgb(a: {r: number, g: number, b: number}, b: {r: number, g: number, b: number}) {
    let aHsl = ColorsTools.rgbToHsl([a.r, a.g, a.b]);
    let bHsl = ColorsTools.rgbToHsl([b.r, b.g, b.b]);
    let aLab = ColorsTools.rgbToLab([a.r, a.g, a.b]);
    let bLab = ColorsTools.rgbToLab([b.r, b.g, b.b]);
    let hDif = (bHsl[0] - aHsl[0]);
    return ColorsTools.labDeltaE(aLab, bLab) * (hDif < 0 ? -1 : 1);
  }

  clear() {
    this.svgData = null;
  }

  onMouseDownPath(event, path: ISvgDataPath) {
    if(this.svgData.svgData) {
      if(this.colorSelected && path.colorGroup == this.colorSelected.fill && !path.filled) {
        path.filled = true;
        this.colorSelected.count --;
        this.colorSelected.countFilled ++;
        if(this.colorSelected.count == 0) {
          let index = this.svgData.colors.indexOf(this.colorSelected);
          this.colorSelected = this.svgData.colors.find((c, i) => c.count > 0 && i > index);
          if(!this.colorSelected) {
            this.colorSelected = this.svgData.colors.find((c, i) => c.count > 0);
          }
        }
      }
    } else if (!path.filled) {
      path.filled = true;
      this.colorSelected = this.svgData.colors.find((c) => c.fill == path.colorGroup);
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
          if(path.filled == true && path.colorGroup) {
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
          colors.push(color);
        } 
      }
      this.svgData.colors = colors;
      this.svgData.svgData = true;
      console.log(JSON.stringify(this.svgData));
    }
  }

}
