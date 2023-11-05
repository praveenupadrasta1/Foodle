import { TestBed } from '@angular/core/testing';

import { UpdateProductQuantityService } from './update-product-quantity.service';

describe('UpdateProductQuantityService', () => {
  let service: UpdateProductQuantityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateProductQuantityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
