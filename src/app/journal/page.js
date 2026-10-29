
"use client";

import { useEffect, useState } from "react";

export default function JournalPage() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchEntries() {
      try {
        const response = await fetch("/api/entries");
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Could not load entries.");
        }

        setEntries(result.entries || []);
      } catch (error) {
        setMessage(error.message || "Could not load journal entries.");
      } finally {
        setLoading(false);
      }
    }

    fetchEntries();
  }, []);

  async function deleteEntry(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this journal entry?"
    );

    if (!confirmed) return;

    setMessage("");

    try {
      const response = await fetch(
        `/api/entries?id=${encodeURIComponent(id)}`,
        { method: "DELETE" }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Could not delete entry.");
      }

      setEntries((previous) =>
        previous.filter((entry) => entry.id !== id)
      );
      setMessage("Journal entry deleted successfully.");
    } catch (error) {
      setMessage(error.message || "Could not delete entry.");
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f8f2] p-6 md:p-10">
      <div className="mx-auto max-w-4xl">
        <a href="/" className="text-sm font-medium text-green-700">
          ← Back to Dashboard
        </a>

        <h1 className="mt-5 text-3xl font-bold text-[#244d3c]">
          My Journal 📔
        </h1>

        <p className="mt-2 text-gray-600">
          Your thoughts, saved in one place.
        </p>

        <p className="mt-5 text-sm text-gray-500">
          {entries.length} journal entries
        </p>

        {message && (
          <p className="mt-4 text-sm text-gray-600" role="status">
            {message}
          </p>
        )}

        {loading ? (
          <p className="mt-6 text-gray-600">Loading journal entries...</p>
        ) : entries.length === 0 ? (
          <div className="mt-6 rounded-2xl bg-white p-8 text-center shadow-sm">
            <p className="text-lg font-semibold">No entries yet</p>
            <p className="mt-2 text-sm text-gray-500">
              Save an entry on your dashboard to see it here.
            </p>
            <a
              href="/"
              className="mt-5 inline-block rounded-xl bg-green-700 px-5 py-3 text-white"
            >
              Write an entry
            </a>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {entries.map((entry) => (
              <article
                key={entry.id}
                className="rounded-2xl bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-semibold text-[#244d3c]">
                    {entry.mood?.emoji} {entry.mood?.name}
                  </h2>

                  <button
                    onClick={() => deleteEntry(entry.id)}
                    className="text-sm text-red-600"
                  >
                    Delete
                  </button>
                </div>

                <p className="mt-3 whitespace-pre-wrap text-gray-700">
                  {entry.text}
                </p>

                <p className="mt-3 text-xs text-gray-400">
                  {entry.date}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
