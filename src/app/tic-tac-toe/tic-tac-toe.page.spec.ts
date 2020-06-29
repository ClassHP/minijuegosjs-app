import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TicTacToePage } from './tic-tac-toe.page';

describe('TicTacToePage', () => {
  let component: TicTacToePage;
  let fixture: ComponentFixture<TicTacToePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicTacToePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TicTacToePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
