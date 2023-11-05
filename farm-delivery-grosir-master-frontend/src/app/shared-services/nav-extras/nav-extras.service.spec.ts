import { TestBed } from '@angular/core/testing';

import { NavExtrasService } from './nav-extras.service';

describe('NavExtrasService', () => {
  let service: NavExtrasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NavExtrasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
