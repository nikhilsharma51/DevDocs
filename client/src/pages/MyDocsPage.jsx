import React from "react";
import PageHeader from "../components/ui/PageHeader";
import SearchBar from "../components/ui/SearchBar";
import SortDropdown from "../components/ui/SortDropdown";
import DocList from "../components/docs/DocList";
import { useState, useMemo } from "react";
import { myDocs, categories } from "../data/mockData";

export default function MyDocsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [activeTag, setActiveTag] = useState("All");

  const filteredDocs = useMemo(() => {
    let docs = [...myDocs];

    if (searchQuery.trim()) {
      docs = docs.filter((doc) =>
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (activeTag !== "All") {
      docs = docs.filter((doc) => doc.tags.includes(activeTag));
    }

    if (sortOrder === "newest") {
      return docs;
    }

    if (sortOrder === "oldest") {
      return docs.reverse();
    }

    if (sortOrder === "alpha") {
      return docs.sort((a, b) => a.title.localeCompare(b.title));
    }

    return docs;
  }, [searchQuery, sortOrder, activeTag]);

  return (
    <div className="max-w-3xl">
      <PageHeader
        title="My docs"
        subtitle={`${filteredDocs.length} document${filteredDocs.length !== 1 ? "s" : ""}`}
        actionLabel="+ New document"
        onAction={() => console.log("open editor")}
      />

      {/* Search + Sort row */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search your documents..."
          />
        </div>
        <SortDropdown value={sortOrder} onChange={setSortOrder} />
      </div>

      {/* Tag filters */}
      <div className="flex gap-2 flex-wrap mb-5">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTag(cat)}
            className={`text-[11px] px-3 py-1 rounded-full border transition-colors ${
              activeTag === cat
                 ? 'bg-purple-50 border-purple-300 text-purple-800'
                : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Doc list */}
      <DocList
        docs={filteredDocs}
        emptyMessage="No documents match your search"
      />
    </div>
  );
}
