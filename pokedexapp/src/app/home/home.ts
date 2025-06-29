import { Component, inject, OnInit, signal } from '@angular/core';
import { PokemonServices } from '../services/pokemon-services';
import { CommonModule } from '@angular/common';
import { PokemonType } from '../models/pokemon.type';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { Pokemon } from '../components/pokemon/pokemon';
import { MatGridList } from '@angular/material/grid-list';
import { MatGridTile } from '@angular/material/grid-list';
import { ResponsiveServices } from '../services/responsive-services';
import { LoginServices } from '../services/login-services';
import { StoredPokemon } from '../models/stored-pokemon.type';
import { MappingServiceTs } from '../services/mapping.service.ts';

@Component({
  selector: 'app-home',
  imports: [CommonModule, Pokemon, MatGridList, MatGridTile],
  standalone: true,
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {
  pokemonService = inject(PokemonServices)
  authenticationService = inject(LoginServices)
  private mapper = inject(MappingServiceTs)
  pokemonList$!: Observable<PokemonType[]>;
  getCachedPokemon$!: Observable<PokemonType[]>;
  private responsiveServices = inject(ResponsiveServices)
  isMobileView = this.responsiveServices.isMobile
  capturedIds = signal<Set<number>>(new Set());

  ngOnInit(): void {

    if (this.authenticationService.authState()) {

      this.capturedIds.set(new Set());
    } else {

      this.pokemonService.getUserPokemonList().pipe(
        map(list => list.map((p: StoredPokemon) => this.mapper.mapPokemon(p).id!))
      )
        .subscribe(ids => this.capturedIds.set(new Set(ids)));
    }

    this.loadList()

  }
  loadList() {
    if (typeof window === 'undefined') {
      this.pokemonList$ = of([]);
      return;
    }
    this.pokemonList$ = this.pokemonService.getCachedPokemonList().pipe(
      switchMap(list => list.length
        ? of(list)
        : this.pokemonService.getFullPokemonList()
      )
    );
    this.pokemonService.getUserPokemonList().pipe(
      map((stored: StoredPokemon[]) =>
        stored.map(s => this.mapper.mapPokemon(s).id!)
      )
    ).subscribe(ids => {
      this.capturedIds.set(new Set(ids));
    });



  }
  reloadList = () => this.loadList();
}
