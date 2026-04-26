// src/components/ui/PageHeader.jsx

export default function PageHeader({ title, subtitle, actionLabel, onAction }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-[18px] font-medium text-gray-900">{title}</h1>
        {subtitle && (
          <p className="text-[12px] text-gray-500 mt-0.5">{subtitle}</p>
        )}
      </div>

      {actionLabel && (
        <button
          onClick={onAction}
          className="px-3 py-1.5 text-[12px] font-medium bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}