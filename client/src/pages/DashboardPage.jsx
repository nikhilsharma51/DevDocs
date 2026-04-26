import { useMemo, useState } from "react";
import { categories } from "../data/mockData";
import { useDocs } from "../hooks/useDocs";
import { DocListSkeleton } from "../components/ui/Skeleton";
import DocCard from "../components/docs/DocCard";
import { useAuth } from "../hooks/useAuth";


export default function DashboardPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const { docs, loading } = useDocs();
  const { profile } = useAuth();

  const recentDocs = useMemo(() => {
    let filtered = docs.slice(0, 8);

    if (activeCategory !== "All") {
      filtered = docs.filter((d) => d.tags?.includes(activeCategory));
    }
    return filtered;
  }, [docs, activeCategory]);

  const stats = [
    { label: "Total docs", value: docs.length },
    {
      label: "Updated this week",
      value: docs.filter((d) => {
        const updated = new Date(d.updated_at);
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return updated > weekAgo;
      }).length,
    },
    { label: "My role", value: profile?.role || "—" },
  ];

  return (
    <div className="max-w-3xl">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-gray-100 rounded-lg p-3">
            <p className="text-[11px] text-gray-900 mb-1">{stat.label}</p>
            <p className="text-[20px] font-medium text-gray-900">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Category filters */}
      <p className="text-[13px] font-medium text-gray-900 mb-2">
        Browse by category
      </p>
      <div className="flex gap-2 flex-wrap mb-5">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`text-[11px] px-3 py-1 rounded-full border transition-colors ${
              activeCategory === cat
                ? "bg-purple-50 border-purple-300 text-purple-800"
                : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Doc grid */}
      <p className="text-[13px] font-medium text-gray-900 mb-2">
        Recent documents
      </p>
      {loading ? (
        <DocListSkeleton count={4} />
      ) : recentDocs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[13px] text-gray-400 mb-1">No documents yet</p>
          <p className="text-[11px] text-gray-300">
            Create your first doc using the sidebar
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {recentDocs.map((doc, i) => (
            <DocCard key={doc.id} doc={doc} isRecent={i === 0} />
          ))}
        </div>
      )}
    </div>
  );
}
