import { TestBed } from '@angular/core/testing';

import { NetworkChangeDelegationService } from './network-change-delegation.service';

describe('NetworkChangeDelegationService', () => {
  let service: NetworkChangeDelegationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NetworkChangeDelegationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
