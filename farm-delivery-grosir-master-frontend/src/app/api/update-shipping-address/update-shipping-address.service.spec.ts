import { TestBed } from '@angular/core/testing';

import { UpdateShippingAddressService } from './update-shipping-address.service';

describe('UpdateShippingAddressService', () => {
  let service: UpdateShippingAddressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateShippingAddressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
