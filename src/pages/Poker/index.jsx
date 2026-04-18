import { usePokerState } from "./logic/usePokerState"
import { usePokerActions } from "./logic/usePokerActions"
import { getRows, columns, totalPot, calcPot, fmt, ACTIONS, ACTION_LABELS } from "./logic/pokerUtils"

import Scores from "../../components/Scores/index.jsx"
import { GiCardPlay } from "react-icons/gi"
import { FaUserPlus, FaHistory, FaUsersSlash } from "react-icons/fa"

const Poker = () => {
  const state = usePokerState()
  const actions = usePokerActions(state)

  const { players, eliminated, newPlayer, hand, history,
          modal, buyIn, buyInInput, smallBlind, bigBlind,
          playerActions, winner } = state
  const { confirmBuyIn, addPlayer, removePlayer, openHand,
          setAction, setBet, registerHand, rebuy } = actions

  const activePlayers = players.filter(p => playerActions[p.id]?.action !== "fold")

  if (buyIn === null) {
    return (
      <div className="modal-overlay">
        <div className="modal">
          <h2 className="modal-title">¿Cuál va a ser el monto inicial?</h2>
          <input
            className="input"
            type="number"
            placeholder="Ej: 500"
            value={buyInInput}
            onChange={e => state.setBuyInInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && confirmBuyIn()}
            autoFocus
          />
          <button className="btn-primary full-width" onClick={confirmBuyIn}>
            Comenzar partida
          </button>
        </div>
      </div>
    )
  }

  return (
    <section className="poker">
      <div className="poker-content">
        <span>Mano {hand} · Bote total: {fmt(totalPot(players, eliminated))}</span>

        <Scores
          data={getRows(players)}
          columns={columns}
          onRemove={removePlayer}
        />

        <div className="poker-actions">
          <button className="btn-action btn-add" onClick={() => state.setModal("addPlayer")} title="Agregar jugador">
            <FaUserPlus />
          </button>
          <button className="btn-action btn-round" onClick={openHand} disabled={players.length < 2} title="Registrar mano">
            <GiCardPlay />
          </button>
          <button className="btn-action btn-hist" onClick={() => state.setModal("history")} disabled={history.length === 0} title="Historial">
            <FaHistory />
          </button>
          <button className="btn-action btn-eliminated" onClick={() => state.setModal("eliminated")} disabled={eliminated.length === 0} title="Jugadores eliminados">
            <FaUsersSlash />
          </button>
        </div>
      </div>

      {modal === "addPlayer" && (
        <div className="modal-overlay" onClick={() => state.setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">Agregar jugador</h2>
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

      {modal === "hand" && (
        <div className="modal-overlay" onClick={() => state.setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">Mano {hand}</h2>

            <div className="blinds-row">
              <div>
                <label>Small blind</label>
                <input className="input" type="number" placeholder="$0" value={smallBlind} onChange={e => state.setSmallBlind(e.target.value)} />
              </div>
              <div>
                <label>Big blind</label>
                <input className="input" type="number" placeholder="$0" value={bigBlind} onChange={e => state.setBigBlind(e.target.value)} />
              </div>
            </div>

            <div className="pot-display">
              <span className="pot-label">Bote estimado</span>
              <span className="pot-amount">{fmt(calcPot(players, playerActions, smallBlind, bigBlind))}</span>
            </div>

            <div className="hand-grid">
              {players.map(p => {
                const pa = playerActions[p.id] || {}
                const showBet = pa.action === "call" || pa.action === "raise"
                return (
                  <div key={p.id} className="hand-player-row">
                    <div className="hand-player-name">
                      <span>{p.name}</span>
                      <span className="hand-player-stack">{fmt(p.stack)}</span>
                    </div>
                    {pa.action === "fold" ? (
                      <div className="folded-label">Fold — fuera de la mano</div>
                    ) : (
                      <>
                        <div className="action-btns">
                          {ACTIONS.map(a => (
                            <button
                              key={a}
                              className={`act-btn${pa.action === a ? " active-" + a : ""}`}
                              onClick={() => setAction(p.id, a)}
                            >
                              {ACTION_LABELS[a]}
                            </button>
                          ))}
                        </div>
                        {showBet && (
                          <div className="bet-row">
                            <label>Apuesta:</label>
                            <input
                              className="input"
                              type="number"
                              placeholder="0"
                              value={pa.bet ?? ""}
                              onChange={e => setBet(p.id, e.target.value)}
                              style={{ width: 100, textAlign: "right" }}
                            />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="winner-section">
              <label>¿Quién ganó la mano?</label>
              <div className="winner-btns">
                {activePlayers.map(p => (
                  <button
                    key={p.id}
                    className={`winner-btn${winner === p.id ? " selected" : ""}`}
                    onClick={() => state.setWinner(p.id)}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-close" onClick={() => state.setModal(null)}>Cancelar</button>
              <button className="btn-primary" onClick={registerHand} disabled={!winner}>Registrar mano</button>
            </div>
          </div>
        </div>
      )}

      {modal === "history" && (
        <div className="modal-overlay" onClick={() => state.setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">Historial de manos</h2>
            <div className="history-list">
              {history.length === 0 ? (
                <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Sin manos registradas</p>
              ) : history.map((h, i) => (
                <div key={i} className="history-item">
                  <div className="history-hand">
                    <span>Mano {i + 1}</span>
                    <span className="history-pot-label">Bote: {fmt(h.pot)}</span>
                  </div>
                  <div className="history-entries">
                    {h.entries.map((e, j) => {
                      const dc = e.delta > 0 ? "h-pos" : e.delta < 0 ? "h-neg" : "h-zero"
                      const ds = e.delta === 0 ? "±$0" : (e.delta > 0 ? "+" : "") + fmt(e.delta)
                      return (
                        <div key={j} className="history-entry">
                          <span>{e.name} <span className="h-action">({e.action})</span></span>
                          <span className={dc}>{ds}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
            <button className="btn-close" onClick={() => state.setModal(null)}>Cerrar</button>
          </div>
        </div>
      )}

      {modal === "eliminated" && (
        <div className="modal-overlay" onClick={() => state.setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">Jugadores eliminados</h2>
            <p className="modal-subtitle">Recompra: {fmt(buyIn)}</p>
            {eliminated.map(p => (
              <div key={p.id} className="eliminated-row">
                <div className="eliminated-player">
                  <span className="eliminated-name">{p.name}</span>
                  <span className="eliminated-total">{fmt(p.stack)}</span>
                </div>
                <button className="btn-primary" onClick={() => rebuy(p)}>Recompra</button>
              </div>
            ))}
            <button className="btn-close" onClick={() => state.setModal(null)}>Cerrar</button>
          </div>
        </div>
      )}
    </section>
  )
}

export default Poker