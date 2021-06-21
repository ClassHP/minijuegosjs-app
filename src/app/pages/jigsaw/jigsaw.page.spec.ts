import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { JigsawPage } from './jigsaw.page';

describe('JigsawPage', () => {
  let component: JigsawPage;
  let fixture: ComponentFixture<JigsawPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JigsawPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(JigsawPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
