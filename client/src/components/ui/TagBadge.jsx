import { tagColors } from '../../data/mockData'

export default function TagBadge({ tag }) {
  const colors = tagColors[tag] || { bg: "bg-gray-100", text: "text-gray-600" }

  return (
    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
      {tag}
    </span>
  )
}