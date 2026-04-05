import { useState } from "react"
import { GiCardPlay } from "react-icons/gi"
import { FaUserPlus, FaHistory } from "react-icons/fa"
import { FaUsersSlash } from "react-icons/fa"
import Scores from "../components/Scores.jsx"

const ACTIONS = ["fold", "call", "raise", "check", "allin"]
const ACTION_LABELS = { fold: "Fold", call: "Call", raise: "Raise", check: "Check", allin: "All-in" }

const fmt = (n) => {
  const a = Math.abs(n)
  return (n < 0 ? "-" : "") + "$" + (a % 1 === 0 ? a.toFixed(0) : a.toFixed(2))
}

const Póker = () => {
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

  const confirmBuyIn = () => {
    const val = parseFloat(buyInInput)
    if (!val || val <= 0) return
    setBuyIn(val)
  }

  const addPlayer = () => {
    if (!newPlayer.trim()) return
    const id = Date.now()
    setPlayers(prev => [...prev, { id, name: newPlayer.trim(), stack: buyIn, buyInCost: buyIn, buyInCount: 1 }])
    setNewPlayer("")
  }

  const removePlayer = (id) => {
    setPlayers(prev => prev.filter(p => p.id !== id))
  }

  const openHand = () => {
    setPlayerActions({})
    setWinner(null)
    setSmallBlind("")
    setBigBlind("")
    setModal("hand")
  }

  const getMaxBet = () => {
    let max = Math.max(
      parseFloat(bigBlind) || 0,
      parseFloat(smallBlind) || 0
    )

    players.forEach(p => {
      const pa = playerActions[p.id]
      if (pa && pa.action !== "fold" && pa.action !== "check") {
        const bet = parseFloat(pa.bet) || 0
        if (bet > max) max = bet
      }
    })

    return max
  }

  const setAction = (id, action) => {
    const player = players.find(p => p.id === id)
    const maxBet = getMaxBet()

    setPlayerActions(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        action,
        bet:
          action === "fold" || action === "check"
            ? 0
            : action === "allin"
            ? player?.stack ?? 0
            : action === "call"
            ? Math.min(maxBet, player?.stack ?? 0)
            : prev[id]?.bet ?? ""
      }
    }))
  }

  const setBet = (id, value) => {
    setPlayerActions(prev => ({ ...prev, [id]: { ...prev[id], bet: value } }))
  }

  const calcPot = () => {
    let pot = (parseFloat(smallBlind) || 0) + (parseFloat(bigBlind) || 0)
    players.forEach(p => {
      const pa = playerActions[p.id]
      if (pa && pa.action !== "fold" && pa.action !== "check") pot += parseFloat(pa.bet) || 0
    })
    return pot
  }

  const registerHand = () => {
    if (!winner) return
    const pot = calcPot()
    const entries = []

    const updated = players.map(p => {
      const pa = playerActions[p.id] || {}
      const bet = pa.action !== "fold" && pa.action !== "check" ? parseFloat(pa.bet) || 0 : 0
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

  const totalPot = () =>
    players.reduce((s, p) => s + p.stack, 0) + eliminated.reduce((s, p) => s + p.stack, 0)

  const rows = [...players]
  .map(p => {
    const total = p.stack - p.buyInCost * p.buyInCount
    return {
      id: p.id,
      name: p.name,
      stack: p.stack,
      total,
      stackFormatted: fmt(p.stack),
      totalFormatted:
        total === 0 ? "±$0" : (total > 0 ? "+" : "") + fmt(total)
    }
  })
  .sort((a, b) => b.stack - a.stack)

  const columns = [
    { key: "name", label: "Jugador" },
    { key: "stackFormatted", label: "Stack" },
    {
      key: "totalFormatted",
      label: "Resultado",
      render: (row) => (
        <span
          className={
            row.total > 0 ? "h-pos" : row.total < 0 ? "h-neg" : "h-zero"
          }
        >
          {row.totalFormatted}
        </span>
      )
    }
  ]

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
            onChange={e => setBuyInInput(e.target.value)}
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
        <span>Mano {hand} · Bote total: {fmt(totalPot())}</span>

        <Scores rows={rows} columns={columns} onRemove={removePlayer} />

        <div className="poker-actions">
          <button className="btn-action btn-add" onClick={() => setModal("addPlayer")} title="Agregar jugador">
            <FaUserPlus />
          </button>
          <button className="btn-action btn-round" onClick={openHand} disabled={players.length < 2} title="Registrar mano">
            <GiCardPlay />
          </button>
          <button className="btn-action btn-hist" onClick={() => setModal("history")} disabled={history.length === 0} title="Historial">
            <FaHistory />
          </button>
          <button className="btn-action btn-eliminated" onClick={() => setModal("eliminated")} disabled={eliminated.length === 0} title="Jugadores eliminados">
            <FaUsersSlash />
          </button>
        </div>
      </div>

      {modal === "addPlayer" && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">Agregar jugador</h2>
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

      {modal === "hand" && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">Mano {hand}</h2>

            <div className="blinds-row">
              <div>
                <label>Small blind</label>
                <input className="input" type="number" placeholder="$0" value={smallBlind} onChange={e => setSmallBlind(e.target.value)} />
              </div>
              <div>
                <label>Big blind</label>
                <input className="input" type="number" placeholder="$0" value={bigBlind} onChange={e => setBigBlind(e.target.value)} />
              </div>
            </div>

            <div className="pot-display">
              <span className="pot-label">Bote estimado</span>
              <span className="pot-amount">{fmt(calcPot())}</span>
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
                    onClick={() => setWinner(p.id)}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-close" onClick={() => setModal(null)}>Cancelar</button>
              <button className="btn-primary" onClick={registerHand} disabled={!winner}>Registrar mano</button>
            </div>
          </div>
        </div>
      )}

      {modal === "history" && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
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
            <button className="btn-close" onClick={() => setModal(null)}>Cerrar</button>
          </div>
        </div>
      )}

      {modal === "eliminated" && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
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
            <button className="btn-close" onClick={() => setModal(null)}>Cerrar</button>
          </div>
        </div>
      )}
    </section>
  )
}

export default Póker
