// Conga.jsx
import { useState } from "react"
import "./styles/Conga.css"
import Scores from "../../components/Scores/Scores"

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

  const playersWithStatus = players.map(p => ({
    ...p,
    eliminated: false,
  }))

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

  return (
    <section className="conga">
      <div className="conga-content">

        <Scores players={playersWithStatus} onRemove={removePlayer} />

        <div className="conga-actions">
          <button className="btn-action btn-add" onClick={() => setModal("addPlayer")}>
            + Jugador
          </button>
          {eliminated.length > 0 && (
            <button className="btn-action btn-eliminated" onClick={() => setModal("eliminated")}>
              Eliminados ({eliminated.length})
            </button>
          )}
          <button
            className="btn-action btn-round"
            onClick={() => setModal("registerRound")}
            disabled={players.length === 0}
          >
            Registrar Ronda {round}
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
                placeholder="Nombre del jugador"
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
                <span className="eliminated-name">{p.name}</span>
                <span className="eliminated-total">{p.total} pts</span>
                <button className="btn-primary" onClick={() => rejoinPlayer(p)}>
                  Reengancharse
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