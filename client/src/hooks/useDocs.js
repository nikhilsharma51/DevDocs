import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./useAuth";

export function useDocs() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchDocs = useCallback(async () => {
    if (!user) {
      setDocs([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from("documents")
      .select(`* `)
      .eq("author_id", user.id)
      .order("updated_at", { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
      setDocs([]);
    } else {
      setDocs(data || []);
    }

    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchDocs();
  }, [fetchDocs]);

  async function createDoc(docData) {
    if (!user) {
      return { data: null, error: { message: "Not authenticated" } };
    }

    const { data, error } = await supabase
      .from("documents")
      .insert({
        title: docData.title,
        content: docData.content,
        tags: docData.tags,
        author_id: user.id,
      })
      .select()
      .single();

    if (error) return { data: null, error };
    setDocs((prev) => [data, ...prev]);
    return { data, error: null };
  }

  async function updateDoc(id, docData) {
    const { data, error } = await supabase
      .from("documents")
      .update({
        title: docData.title,
        content: docData.content,
        tags: docData.tags,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) return { data: null, error };
    setDocs((prev) => prev.map((doc) => (doc.id === id ? data : doc)));
    return { data, error: null };
  }

  async function deleteDoc(id) {
    const { error } = await supabase.from("documents").delete().eq("id", id);

    if (error) return { error };
    setDocs((prev) => prev.filter((d) => d.id !== id));
    return { error: null };
  }

  async function getDocById(id) {
    const { data, error } = await supabase
      .from("documents")
      .select(`* `)
      .eq("id", id)
      .single();

    return { data, error };
  }

  return {
    docs,
    error,
    loading,
    refetch: fetchDocs,
    createDoc,
    addDoc: createDoc,
    deleteDoc,
    updateDoc,
    getDocById,
    getDocbyId: getDocById,
  };
}
