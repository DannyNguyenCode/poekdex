import { Component, inject, input, OnInit, signal } from '@angular/core';

import { PokemonResult } from '../../models/PokemonResult.type';
import { PokemonServices } from '../../services/pokemon-services';
import { catchError } from 'rxjs';
import { PokemonType } from '../../models/pokemon.type';
@Component({
  selector: 'app-pokemon',
  imports: [],
  templateUrl: './pokemon.html',
  styleUrl: './pokemon.scss'
})
export class Pokemon implements OnInit {
  pokemonService = inject(PokemonServices)
  pokemonURL = input.required<string>()
  pokemonInfo = signal<PokemonType>({})
  ngOnInit(): void {
    this.pokemonService.getPokemon(this.pokemonURL()).pipe(
      catchError((err) => {
        console.log(err)
        throw err
      })
    ).subscribe((pokemon) =>
      this.pokemonInfo.set(pokemon)
    )
  }
}
