
"use client";

import { useState } from "react";
import Link from "next/link";

const events = [
  {
    id: 1,
    title: "AI & Machine Learning Summit",
    category: "Technology",
    date: "2026-12-15",
    time: "10:00 AM",
    venue: "Delhi",
    status: "upcoming",
  },
  {
    id: 2,
    title: "Web Development Bootcamp",
    category: "Workshop",
    date: "2026-12-22",
    time: "11:00 AM",
    venue: "Online",
    status: "upcoming",
  },
  {
    id: 3,
    title: "National Hackathon 2026",
    category: "Hackathon",
    date: "2027-01-10",
    time: "09:00 AM",
    venue: "Noida",
    status: "upcoming",
  },
  {
    id: 4,
    title: "Python Programming Workshop",
    category: "Workshop",
    date: "2026-10-15",
    time: "10:00 AM",
    venue: "Online",
    status: "past",
  },
  {
    id: 5,
    title: "Startup & Innovation Meetup",
    category: "Networking",
    date: "2026-09-20",
    time: "02:00 PM",
    venue: "Agra",
    status: "past",
  },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("upcoming");

  const filteredEvents = events.filter(
    (event) => event.status === activeTab
  );

  return (
    <main className="min-h-screen bg-[#07090d] px-6 py-8 text-white">

      <nav className="mx-auto flex max-w-6xl items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          Event<span className="text-cyan-300">Hub</span>
        </Link>

        <Link
          href="/"
          className="rounded-full border border-white/10 px-5 py-2 text-sm hover:border-cyan-300"
        >
          Home
        </Link>
      </nav>

      <section className="mx-auto mt-12 max-w-6xl">

        <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
          User Dashboard
        </p>

        <h1 className="mt-3 text-4xl font-bold">
          Welcome to EventHub!
        </h1>

        <p className="mt-3 text-slate-400">
          Discover events, learn new skills and connect with people.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">

          <div className="rounded-2xl border border-white/10 bg-[#0c1017] p-6">
            <p className="text-slate-400">Upcoming Events</p>
            <h2 className="mt-2 text-3xl font-bold text-cyan-300">
              {events.filter(e => e.status === "upcoming").length}
            </h2>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0c1017] p-6">
            <p className="text-slate-400">Past Events</p>
            <h2 className="mt-2 text-3xl font-bold text-cyan-300">
              {events.filter(e => e.status === "past").length}
            </h2>
          </div>

        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4">

          <h2 className="text-2xl font-bold">Explore Events</h2>

          <div className="flex gap-2">

            <button
              onClick={() => setActiveTab("upcoming")}
              className={`rounded-full px-5 py-2 text-sm font-semibold ${
                activeTab === "upcoming"
                  ? "bg-cyan-300 text-slate-950"
                  : "border border-white/10 text-slate-400"
              }`}
            >
              Upcoming
            </button>

            <button
              onClick={() => setActiveTab("past")}
              className={`rounded-full px-5 py-2 text-sm font-semibold ${
                activeTab === "past"
                  ? "bg-cyan-300 text-slate-950"
                  : "border border-white/10 text-slate-400"
              }`}
            >
              Past Events
            </button>

          </div>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

          {filteredEvents.map((event) => (

            <div
              key={event.id}
              className="rounded-2xl border border-white/10 bg-[#0c1017] p-6 transition hover:border-cyan-300/50"
            >

              <span className="rounded-full bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                {event.category}
              </span>

              <h3 className="mt-5 text-xl font-bold">
                {event.title}
              </h3>

              <div className="mt-5 space-y-3 text-sm text-slate-400">

                <p>📅 {new Date(event.date + "T00:00:00").toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}</p>

                <p>🕒 {event.time}</p>

                <p>📍 {event.venue}</p>

              </div>

              {event.status === "upcoming" ? (
                <button
                  onClick={() => alert("Demo: Registration will be connected soon!")}
                  className="mt-6 w-full rounded-full bg-cyan-300 py-3 font-bold text-slate-950 hover:bg-cyan-200"
                >
                  Register Now
                </button>
              ) : (
                <button
                  disabled
                  className="mt-6 w-full rounded-full border border-white/10 py-3 text-slate-500"
                >
                  Event Completed
                </button>
              )}

            </div>

          ))}

        </div>

        {filteredEvents.length === 0 && (
          <p className="mt-10 text-center text-slate-400">
            No events available right now.
          </p>
        )}

      </section>
    </main>
  );
}
