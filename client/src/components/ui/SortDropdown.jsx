// src/components/ui/SortDropdown.jsx
import { sortOptions } from '../../data/mockData'

export default function SortDropdown({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="h-[34px] bg-dark-surface border border-dark-border rounded-lg px-2 pr-6 text-[12px] text-black outline-none focus:border-brand-purple cursor-pointer appearance-none"
      style={{ backgroundImage: 'none' }}
    >
      {sortOptions.map(opt => (
        <option key={opt.value} value={opt.value} className="bg-dark-surface">
          {opt.label}
        </option>
      ))}
    </select>
  )
}