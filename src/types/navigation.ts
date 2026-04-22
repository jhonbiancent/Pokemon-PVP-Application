import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Pokemon } from "./pokemon";

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Dashboard: undefined;
  SelectPokemon: { team: Pokemon[] };
  Battle: { player: Pokemon; enemy: Pokemon };
  EncounterFlow: { region: string; area: string; player: Pokemon; onExit: () => void; };
  PokemonList: undefined;
  PokemonStats: { pokemon: Pokemon };
  PokemonTeam: { initialTeam: Pokemon[]; onSave?: () => void };
};

export type DashboardScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Dashboard"
>;
export type PokemonTeamScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "PokemonTeam"
>;
export type PokemonStatsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "PokemonStats"
>;
export type SelectPokemonScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "SelectPokemon"
>;
export type BattleScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Battle"
>;
