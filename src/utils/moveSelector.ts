export function selectMoves(moves: any[]) {
  return moves.slice(0, 4).map((m) => ({
    name: m.move.name,
    power: 10,
  }));
}
