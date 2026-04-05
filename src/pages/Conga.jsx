import { useState } from "react"

import Scores from "../components/Scores.jsx"

import { GiArchiveRegister } from "react-icons/gi";
import { FaUserPlus } from "react-icons/fa";
import { FaUsersSlash } from "react-icons/fa";

const Conga = () => {
  const [players, setPlayers] = useState([])
  const [newPlayer, setNewPlayer] = useState("")
  const [roundPoints, setRoundPoints] = useState({})
  const [round, setRound] = useState(1)
  const [modal, setModal] = useState(null)
  const [limitPoints, setLimitPoints] = useState(null)
  const [limitInput, setLimitInput] = useState("")
  const [eliminated, setEliminated] = useState([])

  const addPlayer = () => {
    if (!newPlayer.trim()) return
    const id = Date.now()
    setPlayers(prev => [...prev, { id, name: newPlayer.trim(), total: 0 }])
    setNewPlayer("")
  }

  const removePlayer = (id) => {
    setPlayers(prev => prev.filter(p => p.id !== id))
  }

  const registerRound = () => {
    if (players.length === 0) return

    let newEliminated = []

    setPlayers(prev => {
      const updated = prev.map(p => ({
        ...p,
        total: p.total + (parseInt(roundPoints[p.id]) || 0),
      }))
      newEliminated = updated.filter(p => limitPoints !== null && p.total >= limitPoints)
      return updated.filter(p => limitPoints === null || p.total < limitPoints)
    })

    setEliminated(prev => [...prev, ...newEliminated])
    setRoundPoints({})
    setRound(prev => prev + 1)
    setModal(null)
  }

  const maxPoints = players.length > 0 ? Math.max(...players.map(p => p.total)) : 0

  const rejoinPlayer = (player) => {
    setPlayers(prev => [...prev, { ...player, total: maxPoints }])
    setEliminated(prev => prev.filter(p => p.id !== player.id))
  }

  const confirmLimit = () => {
    const val = parseInt(limitInput)
    if (!val || val <= 0) return
    setLimitPoints(val)
  }

  if (limitPoints === null) {
    return (
      <div className="modal-overlay">
        <div className="modal">
          <h2 className="modal-title">¿Hasta cuántos puntos van a jugar?</h2>
          <input
            className="input"
            type="number"
            placeholder="Ej: 100"
            value={limitInput}
            onChange={e => setLimitInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && confirmLimit()}
            autoFocus
          />
          <button className="btn-primary full-width" onClick={confirmLimit}>
            Comenzar
          </button>
        </div>
      </div>
    )
  }

  const rows = [...players]
  .map(p => ({
    id: p.id,
    name: p.name,
    total: p.total
  }))
  .sort((a, b) => a.total - b.total)

  const columns = [
    { key: "name", label: "Jugador" },
    { key: "total", label: "Puntos" }
  ]

  return (
    <section className="conga">
      <div className="conga-content">
        <span>Ronda {round}</span>

        <Scores
          rows={rows}
          columns={columns}
          onRemove={removePlayer}
        />

        <div className="conga-actions">
          <button className="btn-action btn-add" onClick={() => setModal("addPlayer")} title="Agregar jugador">
            <FaUserPlus />
          </button>
          <button className="btn-action btn-round" onClick={() => setModal("registerRound")} disabled={players.length === 0} title="Registrar ronda">
            <GiArchiveRegister />
          </button>
            <button className="btn-action btn-eliminated" onClick={() => setModal("eliminated")} disabled={eliminated.length === 0} title="Jugadores eliminados">
              <FaUsersSlash />
            </button>
        </div>

      </div>

      {modal === "addPlayer" && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">Agregar Jugador</h2>
            <div className="add-player-row">
              <input
                className="input"
                placeholder="Nombre"
                value={newPlayer}
                onChange={e => setNewPlayer(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addPlayer()}
                autoFocus
              />
              <button className="btn-primary" onClick={addPlayer}>+ Agregar</button>
            </div>
            <button className="btn-close" onClick={() => setModal(null)}>Cerrar</button>
          </div>
        </div>
      )}

      {modal === "eliminated" && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">Jugadores eliminados</h2>
            <p className="modal-subtitle">Reenganche con {maxPoints} pts (último en tabla)</p>
            {eliminated.map(p => (
              <div key={p.id} className="eliminated-row">
                <div className="eliminated-player">
                  <span className="eliminated-name">{p.name}</span>
                  <span className="eliminated-total">{p.total} pts</span>
                </div>
                <button className="btn-primary" onClick={() => rejoinPlayer(p)}>
                  Reenganche
                </button>
              </div>
            ))}
            <button className="btn-close" onClick={() => setModal(null)}>Cerrar</button>
          </div>
        </div>
      )}

      {modal === "registerRound" && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">Puntos Ronda {round}</h2>
            <div className="points-grid">
              {players.map(p => (
                <div key={p.id}>
                  <label>{p.name}</label>
                  <input
                    className="input"
                    type="number"
                    placeholder="0"
                    value={roundPoints[p.id] ?? ""}
                    onChange={e => setRoundPoints(prev => ({ ...prev, [p.id]: e.target.value }))}
                  />
                </div>
              ))}
            </div>
            <button className="btn-primary full-width" onClick={registerRound}>
              Registrar Ronda
            </button>
          </div>
        </div>
      )}

    </section>
  )
}

export default Conga