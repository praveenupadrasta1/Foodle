import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProductSearchResultsPage } from './product-search-results.page';

describe('ProductSearchResultsPage', () => {
  let component: ProductSearchResultsPage;
  let fixture: ComponentFixture<ProductSearchResultsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductSearchResultsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductSearchResultsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
