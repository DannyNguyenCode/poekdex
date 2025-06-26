import { TestBed } from '@angular/core/testing';

import { PokemonServices } from './pokemon-services';

describe('PokemonServices', () => {
  let service: PokemonServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PokemonServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
