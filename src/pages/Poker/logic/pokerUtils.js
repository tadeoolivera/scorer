export const fmt = (n) => {
  const a = Math.abs(n)
  return (n < 0 ? "-" : "") + "$" + (a % 1 === 0 ? a.toFixed(0) : a.toFixed(2))
}

export const calcPot = (players, playerActions, smallBlind, bigBlind) => {
  let pot = (parseFloat(smallBlind) || 0) + (parseFloat(bigBlind) || 0)
  players.forEach(p => {
    const pa = playerActions[p.id]
    if (pa && pa.action !== "fold" && pa.action !== "check")
      pot += parseFloat(pa.bet) || 0
  })
  return pot
}

export const getMaxBet = (players, playerActions, smallBlind, bigBlind) => {
  let max = Math.max(parseFloat(bigBlind) || 0, parseFloat(smallBlind) || 0)
  players.forEach(p => {
    const pa = playerActions[p.id]
    if (pa && pa.action !== "fold" && pa.action !== "check") {
      const bet = parseFloat(pa.bet) || 0
      if (bet > max) max = bet
    }
  })
  return max
}

export const getRows = (players) =>
  [...players]
    .map(p => {
      const total = p.stack - p.buyInCost * p.buyInCount
      return {
        id: p.id,
        name: p.name,
        stack: p.stack,
        total,
        stackFormatted: fmt(p.stack),
        totalFormatted: total === 0 ? "±$0" : (total > 0 ? "+" : "") + fmt(total)
      }
    })
    .sort((a, b) => b.stack - a.stack)

export const columns = [
  { key: "name", label: "Jugador" },
  { key: "stackFormatted", label: "Stack" },
  {
    key: "totalFormatted",
    label: "Resultado",
    className: (row) => row.total > 0 ? "h-pos" : row.total < 0 ? "h-neg" : "h-zero",
    render: (row) => row.totalFormatted
  }
]

export const totalPot = (players, eliminated) =>
  players.reduce((s, p) => s + p.stack, 0) +
  eliminated.reduce((s, p) => s + p.stack, 0)

export const ACTIONS = ["fold", "call", "raise", "check", "allin"]
export const ACTION_LABELS = {
  fold: "Fold", call: "Call", raise: "Raise", check: "Check", allin: "All-in"
}