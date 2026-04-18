import { useState } from "react"

export const usePokerState = () => {
  const [players, setPlayers] = useState([])
  const [eliminated, setEliminated] = useState([])
  const [newPlayer, setNewPlayer] = useState("")
  const [hand, setHand] = useState(1)
  const [history, setHistory] = useState([])
  const [modal, setModal] = useState(null)
  const [buyIn, setBuyIn] = useState(null)
  const [buyInInput, setBuyInInput] = useState("")
  const [smallBlind, setSmallBlind] = useState("")
  const [bigBlind, setBigBlind] = useState("")
  const [playerActions, setPlayerActions] = useState({})
  const [winner, setWinner] = useState(null)

  return {
    players, setPlayers,
    eliminated, setEliminated,
    newPlayer, setNewPlayer,
    hand, setHand,
    history, setHistory,
    modal, setModal,
    buyIn, setBuyIn,
    buyInInput, setBuyInInput,
    smallBlind, setSmallBlind,
    bigBlind, setBigBlind,
    playerActions, setPlayerActions,
    winner, setWinner,
  }
}