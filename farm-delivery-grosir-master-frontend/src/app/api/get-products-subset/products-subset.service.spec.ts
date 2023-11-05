import { TestBed } from '@angular/core/testing';

import { ProductsSubsetService } from './products-subset.service';

describe('ProductsSubsetService', () => {
  let service: ProductsSubsetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductsSubsetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
