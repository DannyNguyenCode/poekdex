import { Component, inject, OnInit, signal } from '@angular/core';
import { PokemonServices } from '../services/pokemon-services';

import { catchError } from 'rxjs';
import { PokemonResult } from '../models/PokemonResult.type';


@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {
  pokemonService = inject(PokemonServices)
  pokemonResults = signal<Array<PokemonResult>>([])

  ngOnInit(): void {
    this.pokemonService.getPokemonList().pipe(
      catchError((err) => {
        console.log(err)
        throw err
      })
    ).subscribe((pokemonResponse) => {
      this.pokemonResults.set(pokemonResponse.results)
    })
  }
}
