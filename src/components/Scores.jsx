import { useRef, useState, useEffect, useMemo } from "react"
import { FaUserMinus } from "react-icons/fa"

const Scores = ({
  players,
  rows,
  columns,
  onRemove,
  mode = "points"
}) => {
  const cardRef = useRef(null)
  const [hasScroll, setHasScroll] = useState(false)

  const data = useMemo(() => rows || players || [], [rows, players])

  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const check = () => setHasScroll(el.scrollHeight > el.clientHeight)
    check()
    const observer = new ResizeObserver(check)
    observer.observe(el)
    return () => observer.disconnect()
  }, [data])

  if (columns) {
    return (
      <div
        ref={cardRef}
        className="scores-card"
        style={hasScroll ? { borderTopRightRadius: 0, borderBottomRightRadius: 0 } : {}}
      >
        {data.length === 0 ? (
          <div className="empty-state">
            Agrega jugadores para empezar
          </div>
        ) : (
          <table className="scores-table">
            <thead>
              <tr>
                <th>Pos</th>
                {columns.map(col => (
                  <th key={col.key}>{col.label}</th>
                ))}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={row.id}>
                  <td>
                    <span className={`badge ${i === 0 ? "first" : ""}`}>
                      {i + 1}
                    </span>
                  </td>

                  {columns.map(col => (
                    <td key={col.key}>
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}

                  <td className="scores-action">
                    <button className="btn-secondary" onClick={() => onRemove(row.id)}>
                      <FaUserMinus />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    )
  }

  const canSortByTotal = data.every(item => Number.isFinite(Number(item?.total)))
  const sorted = canSortByTotal
    ? [...data].sort((a, b) => Number(b.total) - Number(a.total))
    : data

  return (
    <div
      ref={cardRef}
      className="scores-card"
      style={hasScroll ? { borderTopRightRadius: 0, borderBottomRightRadius: 0 } : {}}
    >
      <table className="scores-table">
        <thead>
          <tr>
            <th>Pos</th>
            <th>Jugador</th>
            {mode === "poker" ? (
              <>
                <th>Stack</th>
                <th>Resultado</th>
              </>
            ) : (
              <th>Puntos</th>
            )}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 ? (
            <tr>
              <td colSpan={mode === "poker" ? 5 : 4} className="empty-state">
                Agrega jugadores para empezar
              </td>
            </tr>
          ) : (
            sorted.map((p, i) => (
              <tr key={p.id} className={p.eliminated ? "eliminated" : ""}>
                <td>
                  <span className={`badge ${i === 0 && !p.eliminated ? "first" : ""}`}>
                    {i + 1}
                  </span>
                </td>
                <td className="player-name">{p.name}</td>

                {mode === "poker" ? (
                  <>
                    <td>{p.stackFormatted}</td>
                    <td className={p.total > 0 ? "h-pos" : p.total < 0 ? "h-neg" : "h-zero"}>
                      {p.totalFormatted}
                    </td>
                  </>
                ) : (
                  <td>{p.total}</td>
                )}

                <td className="scores-action">
                  <button className="btn-secondary" onClick={() => onRemove(p.id)}>
                    <FaUserMinus />
                  </button>
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