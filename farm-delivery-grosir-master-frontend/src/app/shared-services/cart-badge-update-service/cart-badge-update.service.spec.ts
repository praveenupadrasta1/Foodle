import { TestBed } from '@angular/core/testing';

import { CartBadgeUpdateService } from './cart-badge-update.service';

describe('CartBadgeUpdateService', () => {
  let service: CartBadgeUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartBadgeUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
