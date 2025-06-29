import { Component, inject, OnInit, signal } from '@angular/core';
import { LoginServices } from '../services/login-services';
import { User } from '../models/user.type';
import { MatGridList } from '@angular/material/grid-list';
import { MatGridTile } from '@angular/material/grid-list';
import { Pokemon } from '../components/pokemon/pokemon';
import { ResponsiveServices } from '../services/responsive-services';
import { PokemonServices } from '../services/pokemon-services';
import { PokemonType } from '../models/pokemon.type';
import { map } from 'rxjs';
import { MappingServiceTs } from '../services/mapping.service.ts';
import { StoredPokemon } from '../models/stored-pokemon.type';
@Component({
  selector: 'app-collection',
  imports: [Pokemon, MatGridList, MatGridTile],
  templateUrl: './collection.html',
  styleUrl: './collection.scss'
})
export class Collection implements OnInit {
  private userServices = inject(LoginServices)
  private pokemonServices = inject(PokemonServices)
  private responsiveServices = inject(ResponsiveServices)
  private mapper = inject(MappingServiceTs)
  user = signal<User | null>(null)
  pokemonList = signal<PokemonType[]>([])
  isMobileView = this.responsiveServices.isMobile
  ngOnInit(): void {
    this.user.set(this.userServices.user())
    Promise.resolve().then(() => this.loadList())
  }
  loadList() {
    this.pokemonServices.getUserPokemonList().pipe(
      map((list: StoredPokemon[]) =>
        list.map(p => this.mapper.mapPokemon(p))
      )
    ).subscribe(mapped => {
      this.pokemonList.set(mapped);
    });
  }
  reloadList = () => this.loadList()


}

