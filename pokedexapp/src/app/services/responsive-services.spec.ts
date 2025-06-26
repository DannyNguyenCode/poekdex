import { TestBed } from '@angular/core/testing';

import { ResponsiveServices } from './responsive-services';

describe('ResponsiveServices', () => {
  let service: ResponsiveServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResponsiveServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
