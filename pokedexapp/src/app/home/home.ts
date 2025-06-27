import { Component, inject, OnInit } from '@angular/core';
import { PokemonServices } from '../services/pokemon-services';
import { CommonModule } from '@angular/common';
import { PokemonType } from '../models/pokemon.type';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Pokemon } from '../components/pokemon/pokemon';
import { MatGridList } from '@angular/material/grid-list';
import { MatGridTile } from '@angular/material/grid-list';
import { ResponsiveServices } from '../services/responsive-services';

@Component({
  selector: 'app-home',
  imports: [CommonModule, Pokemon, MatGridList, MatGridTile],
  standalone: true,
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {
  pokemonService = inject(PokemonServices)
  pokemonList$!: Observable<PokemonType[]>;
  getCachedPokemon$!: Observable<PokemonType[]>;
  private responsiveServices = inject(ResponsiveServices)
  isMobileView = this.responsiveServices.isMobile

  ngOnInit(): void {
    if (typeof window === 'undefined') {
      // SSR fallback
      this.pokemonList$ = of([]);
      return;
    }

    // 1) Get the cached list as an Observable
    const cached$ = this.pokemonService.getCachedPokemonList();

    // 2) If cache is non-empty => emit it; otherwise fetch & cache
    this.pokemonList$ = cached$.pipe(
      switchMap(list =>
        list && list.length
          ? of(list)
          : this.pokemonService.getFullPokemonList()
      )
    );
  }
}
