import { useParams, useNavigate } from "react-router-dom";
import { myDocs } from "../data/mockData";
import MarkdownPreview from "../components/docs/MarkDownPreview";
import TagBadge from "../components/ui/TagBadge";

export default function DocViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const doc = myDocs.find((d) => d.id === parseInt(id));

  if (!doc) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-[15px] font-medium text-gray-700 mb-1">
          Document not found
        </p>
        <p className="text-[12px] text-gray-400 mb-4">
          This doc may have been deleted or moved.
        </p>
        <button
          onClick={() => navigate("/docs/my")}
          className="text-[12px] text-purple-600 hover:underline"
        >
          Back to my docs
        </button>
      </div>
    );
  }
  return (
    <div className="max-w-2xl">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-[12px] text-gray-400 hover:text-gray-700 transition-colors mb-5"
      >
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to my docs
      </button>

      {/* Doc header */}
      <div className="pb-5 mb-5 border-b border-gray-200">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h1 className="text-[22px] font-medium text-gray-900 leading-snug">
            {doc.title}
          </h1>
          <button
            onClick={() => navigate(`/docs/${doc.id}/edit`)}
            className="flex-shrink-0 px-3 py-1.5 text-[11px] font-medium bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors mt-1"
          >
            Edit
          </button>
        </div>

        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="text-[11px] text-gray-400">{doc.author}</span>
          <span className="text-gray-300">·</span>
          <span className="text-[11px] text-gray-400">
            Updated {doc.updatedAt}
          </span>
        </div>

        <div className="flex gap-1.5 flex-wrap">
          {doc.tags.map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
      </div>

      {/* Markdown content */}
      <MarkdownPreview content={doc.content} />
    </div>
  );
}
