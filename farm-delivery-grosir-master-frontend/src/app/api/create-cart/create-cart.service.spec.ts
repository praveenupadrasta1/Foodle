import { TestBed } from '@angular/core/testing';

import { CreateCartService } from './create-cart.service';

describe('CreateCartService', () => {
  let service: CreateCartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateCartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
