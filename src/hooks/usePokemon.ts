import { fetchPokemon } from "../api/pokeApi";
import { Pokemon } from "../types/pokemon";
import { selectMoves } from "../utils/moveSelector";
import { calculateHp } from "../utils/statCalculator";

export async function getPokemon(
  name: string,
  level: number,
): Promise<Pokemon> {
  const data = await fetchPokemon(name);

  const baseHp = data.stats.find((s: any) => s.stat.name === "hp").base_stat;

  const hp = calculateHp(baseHp, level);

  return {
    name: data.name,
    level,
    hp,
    maxHp: hp,
    image: data.sprites.front_default,
    moves: selectMoves(data.moves),
  };
}
