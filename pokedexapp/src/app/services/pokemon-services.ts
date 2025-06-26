import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PokemonResponse } from '../models/pokemonResponse.type';


@Injectable({
  providedIn: 'root'
})
export class PokemonServices {
  http = inject(HttpClient)
  getPokemonList() {
    const url = 'https://pokeapi.co/api/v2/pokemon/'
    return this.http.get<PokemonResponse>(url)
  }
  getPokemon(resultURL: string) {
    const url = resultURL
    return this.http.get(url)
  }
  constructor() { }
}
