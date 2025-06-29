import { Component, input, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { LoginServices } from '../../services/login-services';
import { PokemonType } from '../../models/pokemon.type';
import { PokemonServices } from '../../services/pokemon-services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
const colorTypes: Record<string, string> = {
  normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  electric: '#F7D02C',
  grass: '#7AC74C',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#735797',
  dragon: '#6F35FC',
  dark: '#705746',
  steel: '#B7B7CE',
  fairy: '#D685AD',
};
@Component({
  selector: 'app-pokemon',
  imports: [MatButtonModule, MatCardModule, CommonModule, RouterLink],
  templateUrl: './pokemon.html',
  styleUrl: './pokemon.scss'
})

export class Pokemon implements OnInit {
  private pokemonServices = inject(PokemonServices)
  private _snackBar = inject(MatSnackBar);
  private authenticateServices = inject(LoginServices)
  private titleCase = new TitleCasePipe();
  pokemonInput = input.required<PokemonType | undefined>()
  private _colorMap = signal(colorTypes)
  isCollection = input<boolean>(false)
  onClickEvent = input<() => void>()
  isOwned = input<boolean>(false)

  readonly pokemonColor = computed((): string => {
    const t = this.pokemon()?.types?.[0]?.type?.name;
    return (t && this._colorMap()[t]) ?? 'black';
  });
  pokemon = signal<PokemonType | undefined>(undefined)
  isAuthenticated = this.authenticateServices.authState
  ngOnInit(): void {
    this.pokemon.set(this.pokemonInput())
    this.isAuthenticated.set(this.authenticateServices.isAuthenticated())
  }
  openSnackBar(message: string, isSuccess: boolean = true) {
    this._snackBar.open(message, '', {
      duration: 5 * 10000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      panelClass: isSuccess ? ['custom-snackbar-success'] : ['custom-snackbar-error'],
    });
  }
  capturePokemon(pokemon: PokemonType | undefined): void {
    if (pokemon === undefined) {
      this.openSnackBar("nothing was passed when capture pokemon button was clicked", false)
      return
    }
    try {
      this.pokemonServices.addPokemon(pokemon).subscribe({
        next: (res) => {

          console.log(res.message)
          this.openSnackBar("Captured pokemon: " + this.titleCase.transform(pokemon?.species?.name), true)
          this.onClickEvent()!()
        },
        error: (err) => {
          this.openSnackBar(err.error.error, false)
        }
      })

    }
    catch (err: any) {
      console.log(err)
    }
  }
  releasePokemon(pokemon: PokemonType | undefined): void {
    if (pokemon === undefined || !pokemon.id) {
      this.openSnackBar("nothing was passed when release pokemon button was clicked", false)
      return
    }
    try {
      this.pokemonServices.removePokemon(pokemon.id).subscribe({
        next: (res) => {
          console.log(res.message)
          this.openSnackBar("Released " + this.titleCase.transform(pokemon?.species?.name) + " back into the wild again", true)
          this.onClickEvent()!()
        },
        error: (err) => {
          this.openSnackBar(err.error.error, false)
        }
      })

    }
    catch (err: any) {
      console.log(err)
    }
  }

}
