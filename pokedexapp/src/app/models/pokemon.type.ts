export type Species = {
    name: string,
    url: string
}
export type Sprites = {
    front_default: string
}
export type Type = {
    name: string,
    url: string
}
export type Types = {
    type: Type
}
export type PokemonType = {
    species?: Species
    sprites?: Sprites
    types?: Types[]
    id?: number
}

