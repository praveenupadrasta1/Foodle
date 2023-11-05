import { TestBed } from '@angular/core/testing';

import { SearchProductGlobalService } from './search-product-global.service';

describe('SearchProductGlobalService', () => {
  let service: SearchProductGlobalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchProductGlobalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
