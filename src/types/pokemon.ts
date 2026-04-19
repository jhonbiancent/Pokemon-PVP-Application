export type Move = {
  name: string;
  power: number;
};

export type Pokemon = {
  name: string;
  level: number;
  type: string[];
  hp: number;
  maxHp: number;
  frontImage: string;
  backImage: string;
  moves: Move[];
  cry: string;
};
