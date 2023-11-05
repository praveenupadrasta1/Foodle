import { TestBed } from '@angular/core/testing';

import { GetCategoriesNFeaturedProductsService } from './get-categories-n-featured-products.service';

describe('GetCategoriesNFeaturedProductsService', () => {
  let service: GetCategoriesNFeaturedProductsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetCategoriesNFeaturedProductsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
