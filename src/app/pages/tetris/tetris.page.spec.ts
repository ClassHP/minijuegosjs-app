import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TetrisPage } from './tetris.page';

describe('TetrisPage', () => {
  let component: TetrisPage;
  let fixture: ComponentFixture<TetrisPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TetrisPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TetrisPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
