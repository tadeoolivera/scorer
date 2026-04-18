import ScoresRow from "./ScoresRow"
import useScrollDetect from "./hooks/useScrollDetect"

export default function Scores({ data = [], columns = [], onRemove }) {
  const [ref, hasScroll] = useScrollDetect(data)

  return (
    <div
      ref={ref}
      className="scores-card"
      style={hasScroll ? { borderTopRightRadius: 0, borderBottomRightRadius: 0 } : {}}
    >
      <div className="scores-list">

        <div className="scores-row scores-header">
          <span className="scores-pos">Pos</span>
          {columns.map(col => (
            <span key={col.key} className={`scores-col ${col.key}`}>
              {col.label}
            </span>
          ))}
          <span className="scores-action" />
        </div>

        {data.length === 0 ? (
          <div className="empty-state">Agrega jugadores para empezar</div>
        ) : (
          data.map((row, i) => (
            <ScoresRow
              key={row.id}
              row={row}
              columns={columns}
              index={i}
              onRemove={onRemove}
            />
          ))
        )}

      </div>
    </div>
  )
}