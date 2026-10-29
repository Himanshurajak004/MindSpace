
"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

const moods = [
  { name: "Happy", emoji: "😊", score: 5, color: "#75B798" },
  { name: "Calm", emoji: "😌", score: 4, color: "#8BB8C9" },
  { name: "Neutral", emoji: "😐", score: 3, color: "#E6C878" },
  { name: "Sad", emoji: "😔", score: 2, color: "#C39AD8" },
  { name: "Stressed", emoji: "😣", score: 1, color: "#E69B91" },
];

export default function InsightsPage() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchEntries() {
      try {
        const response = await fetch("/api/entries");
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Could not load insights.");
        }

        setEntries(result.entries || []);
      } catch (error) {
        setMessage(error.message || "Could not load mood insights.");
      } finally {
        setLoading(false);
      }
    }

    fetchEntries();
  }, []);

  const moodDistribution = moods
    .map((mood) => ({
      ...mood,
      value: entries.filter(
        (entry) => entry.mood?.name === mood.name
      ).length,
    }))
    .filter((mood) => mood.value > 0);

  const chartData = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (6 - index));

    const dateString = date.toLocaleDateString("en-US");

    const dayEntries = entries
      .filter((entry) => entry.date === dateString)
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      );

    return {
      day: date.toLocaleDateString("en-US", {
        weekday: "short",
      }),
      mood: dayEntries[0]?.mood?.score ?? null,
    };
  });

  return (
    <main className="min-h-screen bg-[#f7f8f2] p-6 md:p-10">
      <div className="mx-auto max-w-5xl">
        <a href="/" className="text-sm font-medium text-green-700">
          ← Back to Dashboard
        </a>
      
        <h1 className="mt-5 text-3xl font-bold text-[#244d3c]">
          Mood Insights 📊
        </h1>

        <p className="mt-2 text-gray-600">
          Understand your mood, one day at a time.
        </p>

        {message && (
          <p className="mt-4 text-sm text-red-600" role="status">
            {message}
          </p>
        )}

        <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total journal entries</p>
          <p className="mt-2 text-3xl font-bold text-[#477c64]">
            {loading ? "..." : entries.length}
          </p>
        </div>

        {loading ? (
          <p className="mt-6 text-gray-600">
            Loading your mood insights...
          </p>
        ) : (
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <section className="rounded-2xl bg-white p-5 shadow-sm">
              <h2 className="text-xl font-bold">Mood distribution</h2>
              <p className="mt-1 text-sm text-gray-500">
                How often you recorded each mood.
              </p>

              {moodDistribution.length === 0 ? (
                <p className="py-12 text-center text-sm text-gray-500">
                  Save a journal entry to see your mood insights.
                </p>
              ) : (
                <div className="mt-4 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={moodDistribution}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={80}
                        label
                      >
                        {moodDistribution.map((mood) => (
                          <Cell key={mood.name} fill={mood.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </section>

            <section className="rounded-2xl bg-white p-5 shadow-sm">
              <h2 className="text-xl font-bold">Weekly mood</h2>
              <p className="mt-1 text-sm text-gray-500">
                Your latest mood score for each day.
              </p>

              <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="mood"
                      stroke="#477c64"
                      fill="#83b99a"
                      connectNulls={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
