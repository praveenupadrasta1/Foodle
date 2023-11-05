import { TestBed } from '@angular/core/testing';

import { GetBannerService } from './get-banner.service';

describe('GetBannerService', () => {
  let service: GetBannerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetBannerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
