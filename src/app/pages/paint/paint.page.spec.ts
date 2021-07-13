import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PaintPage } from './paint.page';

describe('PaintPage', () => {
  let component: PaintPage;
  let fixture: ComponentFixture<PaintPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaintPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PaintPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
