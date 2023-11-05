import { TestBed } from '@angular/core/testing';

import { CreateInvoiceService } from './create-invoice.service';

describe('CreateInvoiceService', () => {
  let service: CreateInvoiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateInvoiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
