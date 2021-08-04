import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SudokuPage } from './sudoku.page';

describe('SudokuPage', () => {
  let component: SudokuPage;
  let fixture: ComponentFixture<SudokuPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SudokuPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SudokuPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
