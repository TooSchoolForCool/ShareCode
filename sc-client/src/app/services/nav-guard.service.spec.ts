import { TestBed, inject } from '@angular/core/testing';

import { NavGuardService } from './nav-guard.service';

describe('NavGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NavGuardService]
    });
  });

  it('should be created', inject([NavGuardService], (service: NavGuardService) => {
    expect(service).toBeTruthy();
  }));
});
