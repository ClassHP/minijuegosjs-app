import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WordsearchPage } from './wordsearch.page';

describe('WordsearchPage', () => {
  let component: WordsearchPage;
  let fixture: ComponentFixture<WordsearchPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WordsearchPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WordsearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
