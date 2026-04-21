export type Move = {
  name: string;
  power: number;
export type Pokemon = {
  id?: number | string;
  pk_order?: number;
  name: string;
...

  level: number;
...

  type: string[];
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
  frontImage: string;
  backImage: string;
  moves: Move[];
  cry: string;
};
