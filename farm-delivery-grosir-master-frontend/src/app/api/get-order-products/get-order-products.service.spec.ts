import { TestBed } from '@angular/core/testing';

import { GetOrderProductsService } from './get-order-products.service';

describe('GetOrderProductsService', () => {
  let service: GetOrderProductsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetOrderProductsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
