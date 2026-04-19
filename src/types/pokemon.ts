export type Move = {
  name: string;
  power: number;
};

export type Pokemon = {
  name: string;
  level: number;
  hp: number;
  maxHp: number;
  frontImage: string;
  backImage: string;
  moves: Move[];
};
