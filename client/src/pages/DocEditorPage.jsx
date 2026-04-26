// src/pages/DocEditorPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDocs } from "../hooks/useDocs";
import { useAuth } from "../hooks/useAuth";
import MarkdownEditor from "../components/docs/MarkdownEditor";
import TagInput from "../components/ui/TagInput";
import Modal from "../components/ui/Modal";
import toast from "react-hot-toast";
import axios from "axios";

export default function DocEditorPage() {
  const { id }      = useParams();
  const navigate    = useNavigate();
  const isEditing   = Boolean(id);
  const { profile, session } = useAuth();
  const { createDoc, updateDoc, getDocById } = useDocs();

  const [content, setContent]         = useState("");
  const [tags, setTags]               = useState([]);
  const [shareWithTeam, setShareWithTeam] = useState(false); // ← always start false
  const [showModal, setShowModal]     = useState(false);
  const [saving, setSaving]           = useState(false);
  const [loadingDoc, setLoadingDoc]   = useState(isEditing);

  const hasTeam = Boolean(profile?.team_id);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm({
    defaultValues: { title: "" },
  });

  // load existing doc when editing
  useEffect(() => {
    if (!isEditing) return;

    async function load() {
      setLoadingDoc(true);
      const { data, error } = await getDocById(id);

      if (error || !data) {
        toast.error("Document not found");
        navigate("/docs/my");
        return;
      }

      // populate form with existing values
      reset({ title: data.title });
      setContent(data.content || "");
      setTags(data.tags || []);

      // ← set shareWithTeam AFTER doc loads, not before
      setShareWithTeam(Boolean(data.team_id));

      setLoadingDoc(false);
    }

    load();
  }, [id, isEditing]);

  const hasUnsavedChanges = isDirty || content.length > 0;

  async function onSubmit(formData) {
    setSaving(true);

    const docPayload = {
      title:   formData.title,
      content,
      tags,
      team_id: shareWithTeam && profile?.team_id
        ? profile.team_id
        : null,
    };

    if (isEditing) {
      const { error } = await updateDoc(id, docPayload);
      if (error) {
        toast.error("Failed to save changes");
        setSaving(false);
        return;
      }
      toast.success("Document saved");

      // embed the updated doc
      await embedDoc(id, formData.title, content);
      navigate(`/docs/${id}`);
    } else {
      const { data, error } = await createDoc(docPayload);
      if (error) {
        toast.error("Failed to create document");
        setSaving(false);
        return;
      }
      toast.success("Document created");

      // embed the new doc
      await embedDoc(data.id, formData.title, content);
      navigate(`/docs/${data.id}`);
    }
  }

  // non-blocking embed call to backend
  async function embedDoc(docId, title, content) {
    if (!import.meta.env.VITE_API_URL || !session?.access_token) return;
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/ai/embed`,
        { docId, title, content },
        { headers: { Authorization: `Bearer ${session.access_token}` } }
      );
    } catch (e) {
      // non-blocking — doc saves even if embedding fails
      console.warn("Embedding failed silently:", e.message);
    }
  }

  function handleBack() {
    if (hasUnsavedChanges) {
      setShowModal(true);
    } else {
      navigate(-1);
    }
  }

  if (loadingDoc) {
    return (
      <div className="max-w-3xl">
        <div className="h-8 w-32 bg-gray-100 rounded animate-pulse mb-6" />
        <div className="h-10 w-2/3 bg-gray-100 rounded animate-pulse mb-4" />
        <div className="h-64 bg-gray-100 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-1.5 text-[12px] text-gray-400 hover:text-gray-700 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          {isEditing ? "Back to doc" : "Back"}
        </button>

        <div className="flex items-center gap-2">
          {isDirty && (
            <span className="text-[11px] text-gray-400 italic">
              Unsaved changes
            </span>
          )}
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={saving}
            className="px-4 py-2 text-[12px] font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {saving
              ? "Saving..."
              : isEditing
              ? "Save changes"
              : "Create document"}
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="mb-4">
        <input
          {...register("title", {
            required: "Title is required",
            minLength: {
              value: 3,
              message: "Title must be at least 3 characters",
            },
          })}
          placeholder="Document title..."
          className="w-full text-[22px] font-medium text-gray-900 placeholder-gray-300 outline-none border-b border-transparent focus:border-gray-200 pb-2 bg-transparent"
        />
        {errors.title && (
          <p className="text-[11px] text-red-500 mt-1">
            {errors.title.message}
          </p>
        )}
      </div>

      {/* Tags */}
      <div className="mb-5">
        <label className="block text-[11px] text-gray-400 mb-1.5">Tags</label>
        <TagInput tags={tags} onChange={setTags} />
      </div>

      {/* Team sharing toggle — only if user is in a team */}
      {hasTeam && (
        <div className="mb-5 flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
          <div>
            <p className="text-[12px] font-medium text-gray-700">
              Share with team
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              {shareWithTeam
                ? "All team members can read this document"
                : "Only you can see this document"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShareWithTeam((prev) => !prev)}
            className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${
              shareWithTeam ? "bg-purple-500" : "bg-gray-300"
            }`}
          >
            <div
              className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                shareWithTeam ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      )}

      {/* Markdown editor */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <MarkdownEditor value={content} onChange={setContent} />
      </div>

      {/* Discard modal */}
      <Modal
        isOpen={showModal}
        title="Discard changes?"
        message="You have unsaved changes. If you leave now they will be lost."
        confirmLabel="Discard"
        cancelLabel="Keep editing"
        danger
        onConfirm={() => navigate(-1)}
        onCancel={() => setShowModal(false)}
      />
    </div>
  );
}