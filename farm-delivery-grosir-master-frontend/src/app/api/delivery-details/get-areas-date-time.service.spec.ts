import { TestBed } from '@angular/core/testing';

import { GetAreasDateTimeService } from './get-areas-date-time.service';

describe('GetAreasDateTimeService', () => {
  let service: GetAreasDateTimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetAreasDateTimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
