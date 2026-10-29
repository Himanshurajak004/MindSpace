
"use client";

import { useState, useEffect } from "react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";


const moods = [
  { name: "Happy", emoji: "😊", score: 5 },
  { name: "Calm", emoji: "😌", score: 4 },
  { name: "Neutral", emoji: "😐", score: 3 },
  { name: "Sad", emoji: "😔", score: 2 },
  { name: "Stressed", emoji: "😣", score: 1 },
];

const initialData = [
  { day: "Mon", mood: 4 },
  { day: "Tue", mood: 3 },
  { day: "Wed", mood: 5 },
  { day: "Thu", mood: 2 },
  { day: "Fri", mood: 4 },
  { day: "Sat", mood: 5 },
  { day: "Sun", mood: 0 },
];

export default function Home() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [entry, setEntry] = useState("");
  const [entries, setEntries] = useState([]);
const [message, setMessage] = useState("");
  const [loaded, setLoaded] = useState(false);

useEffect(() => {
  const savedEntries = localStorage.getItem("mindspace-entries");
  const savedMood = localStorage.getItem("mindspace-mood");

  if (savedEntries) {
    setEntries(JSON.parse(savedEntries));
  }

  if (savedMood) {
    setSelectedMood(JSON.parse(savedMood));
  }

  setLoaded(true);
}, []);

useEffect(() => {
  if (loaded) {
    localStorage.setItem(
      "mindspace-entries",
      JSON.stringify(entries)
    );
    localStorage.setItem(
      "mindspace-mood",
      JSON.stringify(selectedMood)
    );
  }
}, [entries, selectedMood, loaded]);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  
const chartData = Array.from({ length: 7 }, (_, index) => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - (6 - index));

  const dateString = date.toLocaleDateString("en-US");

  const dayEntries = entries
    .filter((item) => item.date === dateString)
    .sort((a, b) => b.id - a.id);

  return {
    day: date.toLocaleDateString("en-US", {
      weekday: "short",
    }),
    mood: dayEntries[0]?.mood.score ?? null,
  };
});
console.log("Weekly chart data:", chartData);
const moodDistribution = moods
  .map((mood) => ({
    name: mood.name,
    value: entries.filter(
      (item) => item.mood.name === mood.name
    ).length,
  }))
  .filter((item) => item.value > 0);

const moodColors = [
  "#75B798",
  "#8BB8C9",
  "#E6C878",
  "#C39AD8",
  "#E69B91",
];


  async function saveEntry() {
    if (!selectedMood) {
      setMessage("Please select your mood first.");
      return;
    }

    if (!entry.trim()) {
      setMessage("Write a few words about your day.");
      return;
    }

   
const response = await fetch("/api/entries", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    mood: selectedMood,
    text: entry.trim(),
  }),
});

const result = await response.json();

if (!response.ok) {
  setMessage(result.message || "Could not save journal entry.");
  return;
}

const newEntry = {
  id: Date.now(),
  mood: selectedMood,
  text: entry.trim(),
  date: new Date().toLocaleDateString("en-US"),
};

setEntries((previous) => [newEntry, ...previous]);


    const day = new Date().toLocaleDateString("en-US", {
      weekday: "short",
    });


    setEntry("");
    setMessage("Your journal entry has been added!");
  }

  const average =
    chartData.filter((item) => item.mood > 0).length > 0
      ? (
          chartData.reduce((sum, item) => sum + item.mood, 0) /
          chartData.filter((item) => item.mood > 0).length
        ).toFixed(1)
      : "—";

  return (
    <main className="min-h-screen bg-[#f7f8f3] text-[#263d35]">
      <div className="mx-auto max-w-7xl md:flex">
        <aside className="border-b border-[#e5e9df] bg-white p-5 md:min-h-screen md:w-60 md:border-b-0 md:border-r">
          <h1 className="text-2xl font-bold text-[#477c64]">
            ☘ MindSpace
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            A little space for you.
          </p>

          <nav className="mt-7 flex gap-3 overflow-x-auto md:flex-col">
            {["🏡  Dashboard", "📔  My Journal", "📊  Mood Insights"].map(
              (item, index) => (
               
<a
  key={item}
  href={
    index === 0
      ? "/"
      : index === 1
        ? "/journal"
        : "/insights"
  }
  className={`whitespace-nowrap rounded-xl px-4 py-3 text-sm ${
    index === 0
      ? "bg-[#eaf3e9] font-semibold text-[#477c64]"
      : "text-gray-600"
  }`}
>
  {item}
</a>

              )
            )}
          </nav>

          <div className="mt-8 hidden rounded-2xl bg-[#f3f5ec] p-4 md:block">
            <p className="text-2xl">🌱</p>
            <p className="mt-2 font-semibold">Small steps matter.</p>
            <p className="mt-1 text-sm text-gray-600">
              You don't have to figure everything out today.
            </p>
          </div>
        </aside>

        <section className="min-w-0 flex-1 p-5 md:p-9">
          <header className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm text-gray-500">{today}</p>
              <h2 className="mt-1 text-3xl font-bold">
                Your safe space 🌿
              </h2>
              <p className="mt-2 text-gray-500">
                Take a breath. How are you feeling today?
              </p>
            </div>
            <div className="rounded-full bg-white px-4 py-2 text-sm shadow-sm">
              ✨ One day at a time
            </div>
          </header>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl bg-[#e5f0e4] p-5">
              <p className="text-sm text-gray-600">Today's mood</p>
              <p className="mt-3 text-2xl font-bold">
                {selectedMood
                  ? `${selectedMood.emoji} ${selectedMood.name}`
                  : "Not recorded"}
              </p>
              <p className="mt-2 text-sm text-gray-600">
                Every feeling is valid.
              </p>
            </div>

            <div className="rounded-2xl bg-[#f9ead9] p-5">
              <p className="text-sm text-gray-600">Journal entries</p>
              <p className="mt-3 text-3xl font-bold">{entries.length}</p>
              <p className="mt-2 text-sm text-gray-600">
                Entries in this session
              </p>
            </div>

            <div className="rounded-2xl bg-[#e9e5f6] p-5 sm:col-span-2 lg:col-span-1">
              <p className="text-sm text-gray-600">Weekly mood average</p>
              <p className="mt-3 text-3xl font-bold">{average} / 5</p>
              <p className="mt-2 text-sm text-gray-600">
                Based on recorded moods
              </p>
            </div>
          </div>

          <div className="mt-7 grid gap-6 lg:grid-cols-5">
            <div className="rounded-2xl bg-white p-5 shadow-sm lg:col-span-3">
              <h3 className="text-xl font-bold">How are you feeling?</h3>
              <p className="mt-1 text-sm text-gray-500">
                Choose the mood that feels closest to yours.
              </p>

              <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-5">
                {moods.map((mood) => (
                  <button
                    key={mood.name}
                    onClick={() => {
                      setSelectedMood(mood);
                      setMessage("");
                    }}
                    className={`rounded-xl border p-3 transition hover:-translate-y-1 ${
                      selectedMood?.name === mood.name
                        ? "border-[#477c64] bg-[#eaf3e9]"
                        : "border-gray-100 bg-[#fafbf8]"
                    }`}
                  >
                    <span className="text-3xl">{mood.emoji}</span>
                    <span className="mt-2 block text-sm">
                      {mood.name}
                    </span>
                  </button>
                ))}
              </div>

              <label className="mt-6 block font-semibold">
                Write about your day
              </label>
              <textarea
                value={entry}
                onChange={(e) => setEntry(e.target.value)}
                placeholder="What is on your mind today? This is your space..."
                rows={5}
                className="mt-3 w-full resize-y rounded-xl border border-gray-200 bg-[#fafbf8] p-4 outline-none focus:border-[#477c64]"
              />

              {message && (
                <p className="mt-3 text-sm text-[#477c64]" role="status">
                  {message}
                </p>
              )}

              <button
                onClick={saveEntry}
                className="mt-4 rounded-xl bg-[#477c64] px-6 py-3 font-semibold text-white transition hover:bg-[#365e4b]"
              >
                Save journal entry
              </button>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm lg:col-span-2">
              <h3 className="text-xl font-bold">Weekly mood</h3>
              <p className="mt-1 text-sm text-gray-500">
                Your mood score from 1 to 5.
              </p>

              <div className="mt-5 h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient
                        id="moodFill"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#83b99a"
                          stopOpacity={0.45}
                        />
                        <stop
                          offset="100%"
                          stopColor="#83b99a"
                          stopOpacity={0.03}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#edf0e9" />
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                    <YAxis
                      domain={[0, 5]}
                      ticks={[0, 1, 2, 3, 4, 5]}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="mood"
                      stroke="#477c64"
                      fill="url(#moodFill)"
                      strokeWidth={3}
                      connectNulls={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <section className="mt-7 rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-xl font-bold">Recent journal entries</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Your thoughts, one day at a time.
                </p>
              </div>
              <span className="text-sm text-gray-500">
                {entries.length} entries
              </span>
            </div>

            {entries.length === 0 ? (
              <div className="mt-5 rounded-xl bg-[#fafbf8] p-8 text-center">
                <p className="text-3xl">📔</p>
                <p className="mt-3 font-semibold">Your journal starts here</p>
              </div>
            ) : (
              <div className="mt-5 space-y-3">
                {entries.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-xl border b`order-gray-100 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold">
                        {item.mood.emoji} {item.mood.name}
                      </p>
                      <button
                        onClick={() =>
                          setEntries((previous) =>
                            previous.filter((entry) => entry.id !== item.id)
                          )
                        }
                        className="text-sm text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                    <p className="mt-2 whitespace-pre-wrap text-gray-700">
                      {item.text}
                    </p>
                    <p className="mt-2 text-xs text-gray-400">{item.date}</p>
                  </article>
                ))}
              </div>
            )}
          </section>
          
<section className="mt-7 rounded-2xl bg-white p-5 shadow-sm">
  <h3 className="text-xl font-bold">Mood distribution</h3>
  <p className="mt-1 text-sm text-gray-500">
    Your mood history at a glance.
  </p>

  {moodDistribution.length === 0 ? (
    <p className="py-10 text-center text-sm text-gray-500">
      Save your first journal entry to see your mood chart.
    </p>
  ) : (
    <div className="mt-4 h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={moodDistribution}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={85}
            label
          >
            {moodDistribution.map((item, index) => (
              <Cell
                key={item.name}
                fill={moodColors[index % moodColors.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )}
</section>

          <footer className="py-8 text-center text-sm text-gray-400">
            Made with care for your well-being 🌿
          </footer>
        </section>
      </div>
    </main>
  );
}
