import { useState } from "react"
import { FaUserMinus } from "react-icons/fa"

export default function ScoresRow({ row, columns, index, onRemove }) {
  const [removing, setRemoving] = useState(false)

  const handleRemove = () => {
    setRemoving(true)
    setTimeout(() => onRemove(row.id), 150) // this has to match CSS animation duration
  }


  return (
    <div className={`scores-row ${row.eliminated ? "eliminated" : ""} ${removing ? "removing" : ""} ${row.isNew ? "entering" : ""}`}>
      <span className="scores-pos">
        <span className={`badge ${index === 0 && !row.eliminated ? "first" : ""}`}>
          {index + 1}
        </span>
      </span>

      {columns.map(col => (
        <span
          key={col.key}
          className={`scores-col ${col.key} ${col.className?.(row) ?? ""}`}
        >
          {col.render ? col.render(row) : row[col.key]}
        </span>
      ))}

      <span className="scores-action">
        <button className="btn-secondary" onClick={handleRemove}>
          <FaUserMinus />
        </button>
      </span>
    </div>
  )
}