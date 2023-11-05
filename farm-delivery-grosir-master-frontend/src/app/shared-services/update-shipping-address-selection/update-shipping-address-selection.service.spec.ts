import { TestBed } from '@angular/core/testing';

import { UpdateShippingAddressSelectionService } from './update-shipping-address-selection.service';

describe('UpdateShippingAddressSelectionService', () => {
  let service: UpdateShippingAddressSelectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateShippingAddressSelectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
