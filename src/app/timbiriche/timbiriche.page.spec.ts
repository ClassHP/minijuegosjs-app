import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TimbirichePage } from './timbiriche.page';

describe('TimbirichePage', () => {
  let component: TimbirichePage;
  let fixture: ComponentFixture<TimbirichePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimbirichePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TimbirichePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
