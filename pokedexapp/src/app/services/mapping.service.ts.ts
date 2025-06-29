import { Injectable } from '@angular/core';
import { StoredPokemon } from '../models/stored-pokemon.type';
import { PokemonType } from '../models/pokemon.type';
@Injectable({
  providedIn: 'root'
})
export class MappingServiceTs {

  constructor() { }
  mapPokemon(stored: StoredPokemon): PokemonType {
    return {
      id: stored.id,
      species: { name: stored.name, url: '' },
      sprites: { front_default: stored.imageUrl },
      types: [{ type: { name: stored.type, url: '' } }]
    };
  }
}
