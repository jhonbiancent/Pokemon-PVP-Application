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
    type: data.types.map((t: any) => t.type.name),
    hp,
    maxHp: hp,
    frontImage: data.sprites.other.showdown.front_default,
    backImage: data.sprites.other.showdown.back_default,
    moves: selectMoves(data.moves),
    cry: `https://play.pokemonshowdown.com/audio/cries/${data.name}.mp3`,
  };
}
