import { fetchMoveDetail, fetchPokemon } from "../api/pokeApi";
import { Pokemon } from "../types/pokemon";
import { selectMoves } from "../utils/moveSelector";
import { calculateHp, calculateStat } from "../utils/statCalculator";

export async function getPokemon(
  name: string,
  level: number,
): Promise<Pokemon> {
  const data = await fetchPokemon(name);

  // 1. Get Move Selection (logic for most recent level-up moves)
  const selectedMoveData = selectMoves(data.moves, level);

  // 2. Fetch Move Details in parallel to get actual "power"
  const movePromises = selectedMoveData.map((m) => fetchMoveDetail(m.url));
  const moveDetails = await Promise.all(movePromises);

  // 3. Map to final Move format
  const moves = moveDetails.map((detail, index) => ({
    name: selectedMoveData[index].name,
    power: detail?.power || 10, // Default to 10 if move has no power (like status moves)
  }));

  const getBaseStat = (statName: string) =>
    data.stats.find((s: any) => s.stat.name === statName).base_stat;

  const baseHp = getBaseStat("hp");
  const hp = calculateHp(baseHp, level);

  return {
    name: data.name,
    level,
    type: data.types.map((t: any) => t.type.name),
    hp,
    maxHp: hp,
    attack: calculateStat(getBaseStat("attack"), level),
    defense: calculateStat(getBaseStat("defense"), level),
    specialAttack: calculateStat(getBaseStat("special-attack"), level),
    specialDefense: calculateStat(getBaseStat("special-defense"), level),
    speed: calculateStat(getBaseStat("speed"), level),
    frontImage: data.sprites.other.showdown.front_default,
    backImage: data.sprites.other.showdown.back_default,
    moves,
    cry: `https://play.pokemonshowdown.com/audio/cries/${data.name}.mp3`,
  };
}
