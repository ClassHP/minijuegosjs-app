import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CrosswordsPage } from './crosswords.page';

describe('CrosswordsPage', () => {
  let component: CrosswordsPage;
  let fixture: ComponentFixture<CrosswordsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrosswordsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CrosswordsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
