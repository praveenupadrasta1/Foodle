import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GlobalSearchPage } from './global-search.page';

describe('GlobalSearchPage', () => {
  let component: GlobalSearchPage;
  let fixture: ComponentFixture<GlobalSearchPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlobalSearchPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GlobalSearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
