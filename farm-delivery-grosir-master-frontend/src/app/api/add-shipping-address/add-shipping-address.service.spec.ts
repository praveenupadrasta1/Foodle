import { TestBed } from '@angular/core/testing';

import { AddShippingAddressService } from './add-shipping-address.service';

describe('AddShippingAddressService', () => {
  let service: AddShippingAddressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddShippingAddressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
