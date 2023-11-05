import { TestBed } from '@angular/core/testing';

import { BannerInfoDeliverService } from './banner-info-deliver.service';

describe('BannerInfoDeliverService', () => {
  let service: BannerInfoDeliverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BannerInfoDeliverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
