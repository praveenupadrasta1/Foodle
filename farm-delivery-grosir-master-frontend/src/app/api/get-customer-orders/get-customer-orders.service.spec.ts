import { TestBed } from '@angular/core/testing';

import { GetCustomerOrdersService } from './get-customer-orders.service';

describe('GetCustomerOrdersService', () => {
  let service: GetCustomerOrdersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetCustomerOrdersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
