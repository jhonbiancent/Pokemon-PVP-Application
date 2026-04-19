import { Pokemon } from "../types/pokemon";

export function getRandomMove(pokemon: Pokemon) {
  const index = Math.floor(Math.random() * pokemon.moves.length);
  return pokemon.moves[index];
}
