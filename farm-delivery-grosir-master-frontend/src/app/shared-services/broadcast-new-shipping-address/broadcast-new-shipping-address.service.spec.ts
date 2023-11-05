import { TestBed } from '@angular/core/testing';

import { BroadcastNewShippingAddressService } from './broadcast-new-shipping-address.service';

describe('BroadcastNewShippingAddressService', () => {
  let service: BroadcastNewShippingAddressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BroadcastNewShippingAddressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
