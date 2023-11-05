import { TestBed } from '@angular/core/testing';

import { UpdatedShippingAddressService } from './broadcast-updated-shipping-address.service';

describe('UpdatedShippingAddressService', () => {
  let service: UpdatedShippingAddressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdatedShippingAddressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
