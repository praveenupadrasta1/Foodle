import { TestBed } from '@angular/core/testing';

import { DeleteCouponCodeService } from './delete-coupon-code.service';

describe('DeleteCouponCodeService', () => {
  let service: DeleteCouponCodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeleteCouponCodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
