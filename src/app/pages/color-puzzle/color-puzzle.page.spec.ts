import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ColorPuzzlePage } from './color-puzzle.page';

describe('ColorPuzzlePage', () => {
  let component: ColorPuzzlePage;
  let fixture: ComponentFixture<ColorPuzzlePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorPuzzlePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ColorPuzzlePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
