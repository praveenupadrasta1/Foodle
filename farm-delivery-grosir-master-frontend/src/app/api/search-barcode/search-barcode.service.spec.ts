import { TestBed } from '@angular/core/testing';

import { SearchBarcodeService } from './search-barcode.service';

describe('SearchBarcodeService', () => {
  let service: SearchBarcodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchBarcodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
