import { TestBed } from '@angular/core/testing';

import { DeleteShippingAddressService } from './delete-shipping-address.service';

describe('DeleteShippingAddressService', () => {
  let service: DeleteShippingAddressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeleteShippingAddressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
