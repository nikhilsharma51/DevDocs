// src/components/ui/SearchBar.jsx

export default function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="relative">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500"
        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>

      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder || "Search..."}
        className="w-full h-8.5 bg-white border border-gray-200 rounded-lg pl-8 pr-3 text-[12px] text-gray-700 placeholder-gray-400 outline-none focus:border-purple-300 transition-colors"
      />
    </div>
  )
}