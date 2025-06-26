import { PokemonResult } from "./PokemonResult.type";
export type PokemonResponse = {
    count: number;
    next: string;
    previous: string | null;
    results: PokemonResult[];
}