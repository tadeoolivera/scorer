import { useCongaState } from "./logic/useCongaState"
import { useCongaActions } from "./logic/useCongaActions"
import { getRows, getMaxPoints, columns } from "./logic/congaUtils"

import Scores from "../../components/Scores/index.jsx"
import { GiArchiveRegister } from "react-icons/gi"
import { FaUserPlus, FaUsersSlash } from "react-icons/fa"

const Conga = () => {
  const state = useCongaState()
  const actions = useCongaActions(state)

  const { players, newPlayer, roundPoints, round,
          modal, limitPoints, limitInput, eliminated } = state
  const { addPlayer, removePlayer, registerRound,
          rejoinPlayer, confirmLimit } = actions

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
            onChange={e => state.setLimitInput(e.target.value)}
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
        <span>Ronda {round}</span>

        <Scores
          data={getRows(players)}
          columns={columns}
          onRemove={removePlayer}
        />

        <div className="conga-actions">
          <button className="btn-action btn-add" onClick={() => state.setModal("addPlayer")} title="Agregar jugador">
            <FaUserPlus />
          </button>
          <button className="btn-action btn-round" onClick={() => state.setModal("registerRound")} disabled={players.length === 0} title="Registrar ronda">
            <GiArchiveRegister />
          </button>
          <button className="btn-action btn-eliminated" onClick={() => state.setModal("eliminated")} disabled={eliminated.length === 0} title="Jugadores eliminados">
            <FaUsersSlash />
          </button>
        </div>
      </div>

      {modal === "addPlayer" && (
        <div className="modal-overlay" onClick={() => state.setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">Agregar Jugador</h2>
            <div className="add-player-row">
              <input
                className="input"
                placeholder="Nombre"
                value={newPlayer}
                onChange={e => state.setNewPlayer(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addPlayer()}
                autoFocus
              />
              <button className="btn-primary" onClick={addPlayer}>+ Agregar</button>
            </div>
            <button className="btn-close" onClick={() => state.setModal(null)}>Cerrar</button>
          </div>
        </div>
      )}

      {modal === "eliminated" && (
        <div className="modal-overlay" onClick={() => state.setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">Jugadores eliminados</h2>
            <p className="modal-subtitle">Reenganche con {getMaxPoints(players)} pts (último en tabla)</p>
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
            <button className="btn-close" onClick={() => state.setModal(null)}>Cerrar</button>
          </div>
        </div>
      )}

      {modal === "registerRound" && (
        <div className="modal-overlay" onClick={() => state.setModal(null)}>
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
                    onChange={e => state.setRoundPoints(prev => ({ ...prev, [p.id]: e.target.value }))}
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