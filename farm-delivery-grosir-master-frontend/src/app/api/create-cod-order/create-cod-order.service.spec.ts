import { TestBed } from '@angular/core/testing';

import { CreateCodOrderService } from './create-cod-order.service';

describe('CreateCodOrderService', () => {
  let service: CreateCodOrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateCodOrderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
