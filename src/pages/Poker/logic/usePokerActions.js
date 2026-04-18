import { calcPot, getMaxBet } from "./pokerUtils"

export const usePokerActions = (state) => {
  const {
    players, setPlayers,
    setEliminated,
    newPlayer, setNewPlayer,
    setHand,
    setHistory,
    setModal,
    buyIn, setBuyIn,
    buyInInput,
    smallBlind, bigBlind,
    setSmallBlind, setBigBlind,
    playerActions, setPlayerActions,
    winner, setWinner,
  } = state

  const confirmBuyIn = () => {
    const val = parseFloat(buyInInput)
    if (!val || val <= 0) return
    setBuyIn(val)
  }

  const addPlayer = () => {
    if (!newPlayer.trim()) return
    setPlayers(prev => [...prev, {
      id: Date.now(),
      name: newPlayer.trim(),
      stack: buyIn,
      buyInCost: buyIn,
      buyInCount: 1
    }])
    setNewPlayer("")
  }

  const removePlayer = (id) =>
    setPlayers(prev => prev.filter(p => p.id !== id))

  const openHand = () => {
    setPlayerActions({})
    setWinner(null)
    setSmallBlind("")
    setBigBlind("")
    setModal("hand")
  }

  const setAction = (id, action) => {
    const player = players.find(p => p.id === id)
    const maxBet = getMaxBet(players, playerActions, smallBlind, bigBlind)

    setPlayerActions(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        action,
        bet:
          action === "fold" || action === "check" ? 0
          : action === "allin" ? player?.stack ?? 0
          : action === "call" ? Math.min(maxBet, player?.stack ?? 0)
          : prev[id]?.bet ?? ""
      }
    }))
  }

  const setBet = (id, value) =>
    setPlayerActions(prev => ({ ...prev, [id]: { ...prev[id], bet: value } }))

  const registerHand = () => {
    if (!winner) return
    const pot = calcPot(players, playerActions, smallBlind, bigBlind)
    const entries = []

    const updated = players.map(p => {
      const pa = playerActions[p.id] || {}
      const bet = pa.action !== "fold" && pa.action !== "check"
        ? parseFloat(pa.bet) || 0 : 0
      const delta = p.id === winner ? pot - bet : -bet
      entries.push({ name: p.name, delta, action: pa.action || "—" })
      return { ...p, stack: p.stack + delta }
    })

    const newEliminated = updated.filter(p => p.stack <= 0)
    const surviving = updated.filter(p => p.stack > 0)

    setEliminated(prev => [...prev, ...newEliminated])
    setPlayers(surviving)
    setHistory(prev => [...prev, { pot, entries }])
    setHand(prev => prev + 1)
    setModal(null)
  }

  const rebuy = (player) => {
    setPlayers(prev => [...prev, { ...player, stack: buyIn, buyInCount: player.buyInCount + 1 }])
    setEliminated(prev => prev.filter(p => p.id !== player.id))
    setModal(null)
  }

  return {
    confirmBuyIn,
    addPlayer,
    removePlayer,
    openHand,
    setAction,
    setBet,
    registerHand,
    rebuy,
  }
}