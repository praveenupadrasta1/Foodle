import { TestBed } from '@angular/core/testing';

import { DeliveryAreaDateTimeDataService } from './delivery-area-date-time-data.service';

describe('DeliveryAreaDateTimeDataService', () => {
  let service: DeliveryAreaDateTimeDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeliveryAreaDateTimeDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
