import { TestBed } from '@angular/core/testing';

import { CategoryProductsService } from './category-products.service';

describe('CategoryProductsService', () => {
  let service: CategoryProductsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoryProductsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
