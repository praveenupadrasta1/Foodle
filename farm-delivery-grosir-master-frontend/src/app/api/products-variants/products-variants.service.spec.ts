import { TestBed } from '@angular/core/testing';

import { ProductsVariantsService } from './products-variants.service';

describe('ProductsVariantsService', () => {
  let service: ProductsVariantsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductsVariantsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
