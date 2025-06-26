import { Component, input, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-pokemon',
  imports: [],
  templateUrl: './pokemon.html',
  styleUrl: './pokemon.scss'
})
export class Pokemon implements OnInit {
  pokemonNameInput = input.required<string | undefined>()
  pokemonImageURLInput = input.required<string | undefined>()

  pokemonName = signal<string | undefined>('')
  pokemonImageURL = signal<string | undefined>('')
  ngOnInit(): void {
    this.pokemonName.set(this.pokemonNameInput())
    this.pokemonImageURL.set(this.pokemonImageURLInput())
  }
}
