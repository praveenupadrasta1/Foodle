import { TestBed } from '@angular/core/testing';

import { UpdateProductDataService } from './update-product-data.service';

describe('UpdateProductDataService', () => {
  let service: UpdateProductDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateProductDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
