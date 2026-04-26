import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function MarkdownPreview({ content }) {
  return (
    <div className="max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-[20px] font-medium text-gray-900 mt-6 mb-3">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-[16px] font-medium text-gray-900 mt-5 mb-2">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-[14px] font-medium text-gray-800 mt-4 mb-2">{children}</h3>
          ),
          p: ({ children }) => (
            <p className="text-[13px] text-gray-600 leading-relaxed mb-3">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-5 mb-3 space-y-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-5 mb-3 space-y-1">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-[13px] text-gray-600">{children}</li>
          ),
          code: ({ node, inline, className, children, ...props }) => {
            if (inline) {
              return (
                <code className="bg-gray-100 text-purple-700 text-[12px] px-1.5 py-0.5 rounded font-mono">
                  {children}
                </code>
              )
            }
            return (
              <code className="block text-[12px] font-mono text-gray-800 leading-relaxed">
                {children}
              </code>
            )
          },
          pre: ({ children }) => (
            <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-x-auto mb-3">
              {children}
            </pre>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-[12px] border-collapse">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="text-left px-3 py-2 bg-gray-50 border border-gray-200 font-medium text-gray-700">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-3 py-2 border border-gray-200 text-gray-600">{children}</td>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-purple-300 pl-4 my-3 text-gray-500 italic">
              {children}
            </blockquote>
          ),
          strong: ({ children }) => (
            <strong className="font-medium text-gray-800">{children}</strong>
          ),
          a: ({ href, children }) => (
            <a href={href} className="text-purple-600 hover:underline" target="_blank" rel="noreferrer">
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}