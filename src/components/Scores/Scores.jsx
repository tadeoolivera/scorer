import { useRef, useState, useEffect } from "react"
import "./Scores.css"

const Scores = ({ players, onRemove }) => {
  const cardRef = useRef(null)
  const [hasScroll, setHasScroll] = useState(false)

  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const check = () => setHasScroll(el.scrollHeight > el.clientHeight)
    check()
    const observer = new ResizeObserver(check)
    observer.observe(el)
    return () => observer.disconnect()
  }, [players])

  const sorted = [...players].sort((a, b) => {
    if (a.total !== b.total) return a.total - b.total
    return players.indexOf(a) - players.indexOf(b)
  })

  return (
    <div
      ref={cardRef}
      className="scores-card"
      style={hasScroll ? { borderTopRightRadius: 0, borderBottomRightRadius: 0 } : {}}
    >
      <table className="scores-table">
        <thead>
          <tr>
            <th>Posición</th>
            <th>Jugador</th>
            <th>Total</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 ? (
            <tr>
              <td colSpan={4} className="empty-state">No hay jugadores aún</td>
            </tr>
          ) : (
            sorted.map((p, i) => (
              <tr key={p.id} className={p.eliminated ? "eliminated" : ""}>
                <td>
                  <span className={`badge ${i === 0 && !p.eliminated ? "first" : ""}`}>{i + 1}</span>
                </td>
                <td className="player-name">{p.name}</td>
                <td>{p.total}</td>
                <td>
                  <button className="btn-secondary" onClick={() => onRemove(p.id)}>−</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Scores