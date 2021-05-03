import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { Infinite1Page } from './infinite1.page';

describe('Infinite1Page', () => {
  let component: Infinite1Page;
  let fixture: ComponentFixture<Infinite1Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Infinite1Page ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(Infinite1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
