import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FreecellPage } from './freecell.page';

describe('SolitairePage', () => {
  let component: FreecellPage;
  let fixture: ComponentFixture<FreecellPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreecellPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FreecellPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
