import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PokemonResponse } from '../models/pokemonResponse.type';
import { PokemonType } from '../models/pokemon.type';
import { PokemonResult } from '../models/PokemonResult.type';
import { forkJoin, Observable, of, switchMap, tap } from 'rxjs';


// @Injectable({
//   providedIn: 'root'
// })
// export class PokemonServices {
//   http = inject(HttpClient)
//   private readonly cacheKey = 'pokemon_full_cache'
//   private readonly ttl = 30 * 24 * 60 * 60 * 1000;
//   constructor() { }
//   getFullPokemonList(): Observable<PokemonType[]> {
//     const now = Date.now();

//     if (typeof window === 'undefined') {
//       return of([]);
//     }
//     const cached = localStorage.getItem(this.cacheKey);
//     if (cached) {
//       try {
//         const { timestamp, data } = JSON.parse(cached);
//         if (now - timestamp < this.ttl) {
//           return of(data as PokemonType[]);
//         }
//       } catch (e) {
//         console.warn('Failed to parse localStorage cache:', e);
//       }
//     }
//     return this.http.get<PokemonResponse>('https://pokeapi.co/api/v2/pokemon?limit=151').pipe(
//       switchMap((baseList) => {
//         const detailRequests = baseList.results.map((pokemon: PokemonResult) =>
//           this.http.get<PokemonType>(pokemon.url)
//         );
//         return forkJoin(detailRequests);
//       }),
//       tap((detailedList) => {
//         if (typeof window !== 'undefined') {
//           const simplified: PokemonType[] = detailedList.map(p => ({
//             species: { name: p.species?.name ?? '', url: p.species?.url ?? '' },
//             sprites: { front_default: p.sprites?.front_default ?? '' },
//             types: p.types?.map(t => ({
//               type: {
//                 name: t.type.name ?? '',
//                 url: t.type.url ?? ''
//               }
//             })) ?? []
//           }));
//           localStorage.setItem(this.cacheKey, JSON.stringify({
//             timestamp: Date.now(),
//             data: simplified
//           }));
//         }
//       })
//     );
//   }
//   getCachedPokemonList(): Observable<PokemonType[]> {
//     const cached = localStorage.getItem('pokemon_full_cache');
//     if (typeof window === 'undefined') {
//       return of([]); // SSR-safe fallback
//     }
//     if (cached) {
//       const { data } = JSON.parse(cached);
//       return of(data as PokemonType[]);
//     }
//     return of([]); // fallback empty list
//   }
// }

@Injectable({
  providedIn: 'root'
})
export class PokemonServices {
  http = inject(HttpClient)
  private readonly cacheKey = 'pokemon_full_cache'
  private readonly ttl = 30 * 24 * 60 * 60 * 1000;
  constructor() { }
  getFullPokemonList(): Observable<PokemonType[]> {
    const now = Date.now();

    if (typeof window === 'undefined') {
      return of([]);
    }
    const cached = localStorage.getItem(this.cacheKey);
    if (cached) {
      try {
        const { timestamp, data } = JSON.parse(cached);
        if (now - timestamp < this.ttl) {
          return of(data as PokemonType[]);
        }
      } catch (e) {
        console.warn('Failed to parse localStorage cache:', e);
      }
    }
    return this.http.get<PokemonResponse>('https://pokeapi.co/api/v2/pokemon?limit=151').pipe(
      switchMap((baseList) => {
        const detailRequests = baseList.results.map((pokemon: PokemonResult) =>
          this.http.get<PokemonType>(pokemon.url)
        );
        return forkJoin(detailRequests);
      }),
      tap((detailedList) => {
        if (typeof window !== 'undefined') {
          const simplified: PokemonType[] = detailedList.map(p => ({
            species: { name: p.species?.name ?? '', url: p.species?.url ?? '' },
            sprites: { front_default: p.sprites?.front_default ?? '' },
            types: p.types?.map(t => ({
              type: {
                name: t.type.name ?? '',
                url: t.type.url ?? ''
              }
            })) ?? []
          }));
          localStorage.setItem(this.cacheKey, JSON.stringify({
            timestamp: Date.now(),
            data: simplified
          }));
        }
      })
    );
  }
  getCachedPokemonList(): Observable<PokemonType[]> {
    const cached = localStorage.getItem('pokemon_full_cache');
    if (typeof window === 'undefined') {
      return of([]); // SSR-safe fallback
    }
    if (cached) {
      const { data } = JSON.parse(cached);
      return of(data as PokemonType[]);
    }
    return of([]); // fallback empty list
  }
}
