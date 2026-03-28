// src/components/ui/PageHeader.jsx

export default function PageHeader({ title, subtitle, actionLabel, onAction }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-[18px] font-medium text-gray-100">{title}</h1>
        {subtitle && (
          <p className="text-[12px] text-gray-500 mt-0.5">{subtitle}</p>
        )}
      </div>

      {actionLabel && (
        <button
          onClick={onAction}
          className="px-3 py-1.5 text-[12px] font-medium bg-dark-surface border border-dark-border text-black rounded-lg hover:bg-dark-hover transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}