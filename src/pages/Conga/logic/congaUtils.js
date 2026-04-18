const toPoints = (val) => {
  const n = Number(val)
  return Number.isFinite(n) ? Math.round(n) : 0
}

export const calcUpdatedPlayers = (players, roundPoints) =>
  players.map(p => ({
    ...p,
    total: p.total + toPoints(roundPoints[p.id]),
  }))

export const partitionByLimit = (players, limitPoints) => {
  if (limitPoints === null) return { active: players, eliminated: [] }
  return {
    active: players.filter(p => p.total < limitPoints),
    eliminated: players.filter(p => p.total >= limitPoints),
  }
}

export const getMaxPoints = (players) =>
  players.length > 0 ? Math.max(...players.map(p => p.total)) : 0

export const getRows = (players) =>
  [...players]
    .map(({ id, name, total, isNew }) => ({ id, name, total, isNew }))
    .sort((a, b) => a.total - b.total)

export const columns = [
  { key: "name",  label: "Jugador" },
  { key: "total", label: "Puntos"  },
]