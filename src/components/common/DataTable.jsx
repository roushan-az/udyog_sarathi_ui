import React from 'react'
import { Pencil, Trash2 } from 'lucide-react'

/**
 * Generic responsive table.
 * columns: [{ key, label, align, render }]
 * rows: array of objects
 * onEdit/onDelete: optional row action handlers
 */
export default function DataTable({ columns, rows, onEdit, onDelete, keyField = 'id', footer, emptyText = 'कोई रिकॉर्ड नहीं मिला' }) {
  const hasActions = onEdit || onDelete
  return (
    <div className="scroll-x rounded-xl border border-slate-200 bg-white">
      <table className="w-full min-w-[720px] text-sm">
        <thead>
          <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
            {columns.map((c) => (
              <th key={c.key} className={`px-4 py-3 font-semibold whitespace-nowrap ${c.align === 'right' ? 'text-right' : 'text-left'}`}>
                {c.label}
              </th>
            ))}
            {hasActions && <th className="px-4 py-3 text-right font-semibold">कार्यवाही</th>}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={columns.length + (hasActions ? 1 : 0)} className="px-4 py-10 text-center text-slate-400">
                {emptyText}
              </td>
            </tr>
          )}
          {rows.map((row, i) => (
            <tr key={row[keyField] ?? i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70 transition-colors">
              {columns.map((c) => (
                <td key={c.key} className={`px-4 py-3 whitespace-nowrap text-slate-700 ${c.align === 'right' ? 'text-right' : 'text-left'}`}>
                  {c.render ? c.render(row, i) : row[c.key]}
                </td>
              ))}
              {hasActions && (
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex items-center gap-2">
                    {onEdit && (
                      <button onClick={() => onEdit(row)} className="p-1.5 rounded-md text-navy-600 hover:bg-navy-50 focus-ring" aria-label="संपादित करें">
                        <Pencil size={15} />
                      </button>
                    )}
                    {onDelete && (
                      <button onClick={() => onDelete(row)} className="p-1.5 rounded-md text-red-500 hover:bg-red-50 focus-ring" aria-label="हटाएं">
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {footer && <div className="px-4 py-3 border-t border-slate-200 text-sm text-slate-500">{footer}</div>}
    </div>
  )
}
