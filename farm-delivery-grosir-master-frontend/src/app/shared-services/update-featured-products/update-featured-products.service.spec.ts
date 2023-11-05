import { TestBed } from '@angular/core/testing';

import { UpdateFeaturedProductsService } from './update-featured-products.service';

describe('UpdateFeaturedProductsService', () => {
  let service: UpdateFeaturedProductsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateFeaturedProductsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
