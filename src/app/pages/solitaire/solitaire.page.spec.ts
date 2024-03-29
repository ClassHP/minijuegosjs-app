import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SolitairePage } from './solitaire.page';

describe('SolitairePage', () => {
  let component: SolitairePage;
  let fixture: ComponentFixture<SolitairePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolitairePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SolitairePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
