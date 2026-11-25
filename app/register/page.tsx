"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [teamName, setTeamName] = useState("");
  const [leaderName, setLeaderName] = useState("");
  const [email, setEmail] = useState("");
  const [members, setMembers] = useState([{ name:"", email: ""}]);
  const [submitted, setSubmitted] = useState(false);

  function updateMember(
    index: number, 
    field: "name" | "email",
    value: string,
) {
    setMembers((current) =>
      current.map((member, i) => 
        i === index ? {...member, [field]: value} : member,
),
)
;
  }

  function addMember() {
    setMembers((current) => [...current, {name: "", email: ""}]);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <main className="min-h-screen bg-[#07090d] px-6 py-8 text-white">
      <div className="mx-auto max-w-2xl">
        <a href="/" className="text-xl font-bold">
          Event<span className="text-cyan-300">Hub</span>
        </a>

        <section className="mt-12 rounded-3xl border border-white/10 bg-[#0c1017] p-6 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">
            Event registration
          </p>
          <h1 className="mt-3 text-3xl font-bold">Register your team</h1>
          <p className="mt-3 leading-7 text-slate-400">
            Add your team details. Each member will be part of the team pass.
          </p>

          {submitted ? (
            <div className="mt-8 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-5">
              <h2 className="text-lg font-semibold text-emerald-300">
                Form preview ready
              </h2>
              <p className="mt-2 text-slate-300">
                Team: {teamName} · Leader: {leaderName} · Email: {email}
              </p>
              <p className="mt-2 text-sm text-slate-400">
                This is a demo: the details haven’t been saved yet.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-5 text-sm font-semibold text-cyan-300 hover:text-cyan-200"
              >
                Edit details
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <label className="block text-sm font-medium text-slate-200">
                Team name
                <input
                  required
                  value={teamName}
                  onChange={(event) => setTeamName(event.target.value)}
                  placeholder="e.g. Creative Crew"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[#07090d] px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-300"
                />
              </label>

              <label className="block text-sm font-medium text-slate-200">
                Team leader
                <input
                  required
                  value={leaderName}
                  onChange={(event) => setLeaderName(event.target.value)}
                  placeholder="Your full name"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[#07090d] px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-300"
                />
              </label>

              <label className="block text-sm font-medium text-slate-200">
                Email address
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[#07090d] px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-300"
                />
              </label>

              <div>
                <p className="text-sm font-medium text-slate-200">
                  Team members
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {members.map((member, index) => (
                    <div key={index}>
                      <input
                        required
                        value={member.name}
                        onChange={(event) => updateMember(index, "name", event.target.value)}
                        placeholder={`Member ${index + 1} full name`}
                      />
                      <input
                        required
                        type="email"
                        value={member.email}
                        onChange={(event) => updateMember(index, "email", event.target.value)}
                        placeholder="Member email"
                      />
                    </div>
                  ))}
                </div>                <button
                  type="button"
                  onClick={addMember}
                  className="mt-3 text-sm font-semibold text-cyan-300 hover:text-cyan-200"
                >
                  + Add another member
                </button>
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-cyan-300 px-6 py-3.5 font-bold text-slate-950 transition hover:bg-cyan-200"
              >
                Preview registration →
              </button>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
