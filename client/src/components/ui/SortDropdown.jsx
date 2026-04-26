// src/components/ui/SortDropdown.jsx
import { sortOptions } from '../../data/mockData'

export default function SortDropdown({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="h-8.5 bg-white border border-gray-200 rounded-lg px-2 pr-6 text-[12px] text-gray-700 outline-none focus:border-purple-300 cursor-pointer appearance-none"
      style={{ backgroundImage: 'none' }}
    >
      {sortOptions.map(opt => (
        <option key={opt.value} value={opt.value} className="bg-white text-gray-700">
          {opt.label}
        </option>
      ))}
    </select>
  )
}