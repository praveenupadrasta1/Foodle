import { TestBed } from '@angular/core/testing';

import { ApplyCouponCodeService } from './apply-coupon-code.service';

describe('ApplyCouponCodeService', () => {
  let service: ApplyCouponCodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApplyCouponCodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
