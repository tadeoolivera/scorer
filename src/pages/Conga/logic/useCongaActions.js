import { calcUpdatedPlayers, partitionByLimit, getMaxPoints } from "./congaUtils"

export const useCongaActions = (state) => {
  const {
    players, setPlayers,
    newPlayer, setNewPlayer,
    roundPoints, setRoundPoints,
    setRound, setModal,
    setEliminated,
    limitPoints,
    limitInput,
    setLimitPoints,
  } = state

  const addPlayer = () => {
    if (!newPlayer.trim()) return
    setPlayers(prev => [...prev, { id: Date.now(), name: newPlayer.trim(), total: 0 }])
    setNewPlayer("")
  }

  const removePlayer = (id) =>
    setPlayers(prev => prev.filter(p => p.id !== id))

  const registerRound = () => {
    if (players.length === 0) return
    const updated = calcUpdatedPlayers(players, roundPoints)
    const { active, eliminated } = partitionByLimit(updated, limitPoints)

    setRoundPoints({})
    setRound(prev => prev + 1)
    setModal(null)

    if (eliminated.length > 0) {
      setPlayers(players.map(p => ({
        ...p,
        isNew: eliminated.some(e => e.id === p.id)
      })))

      requestAnimationFrame(() => {
        setTimeout(() => {
          setEliminated(prev => [...prev, ...eliminated])
          setPlayers(active)
        }, 150) // this has to match CSS animation duration
      })
    } else {
      setPlayers(active)
    }
  }

  const rejoinPlayer = (player) => {
    const maxPoints = getMaxPoints(players)
    setPlayers(prev => [...prev, { ...player, total: maxPoints }])
    setEliminated(prev => prev.filter(p => p.id !== player.id))
  }

  const confirmLimit = () => {
    const val = parseInt(limitInput)
    if (!val || val <= 0) return
    setLimitPoints(val)
  }

  return {
    addPlayer,
    removePlayer,
    registerRound,
    rejoinPlayer,
    confirmLimit,
  }
}