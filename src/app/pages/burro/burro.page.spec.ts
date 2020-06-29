import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BurroPage } from './burro.page';

describe('BurroPage', () => {
  let component: BurroPage;
  let fixture: ComponentFixture<BurroPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BurroPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BurroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
