import { useState } from "react"

export const useCongaState = () => {
  const [players, setPlayers] = useState([])
  const [newPlayer, setNewPlayer] = useState("")
  const [roundPoints, setRoundPoints] = useState({})
  const [round, setRound] = useState(1)
  const [modal, setModal] = useState(null)
  const [limitPoints, setLimitPoints] = useState(null)
  const [limitInput, setLimitInput] = useState("")
  const [eliminated, setEliminated] = useState([])

  return {
    players, setPlayers,
    newPlayer, setNewPlayer,
    roundPoints, setRoundPoints,
    round, setRound,
    modal, setModal,
    limitPoints, setLimitPoints,
    limitInput, setLimitInput,
    eliminated, setEliminated,
  }
}