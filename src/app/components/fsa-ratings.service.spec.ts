import { TestBed } from '@angular/core/testing';

import { FsaRatingsService } from './fsa-ratings.service';

describe('FsaRatingsService', () => {
  let service: FsaRatingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FsaRatingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
