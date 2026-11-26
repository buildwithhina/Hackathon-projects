
"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

type Member = {
  name: string;
  email: string;
};

type PassMember = Member & {
  id: string;
};

export default function RegisterPage() {
  const [teamName, setTeamName] = useState("");
  const [leaderName, setLeaderName] = useState("");
  const [email, setEmail] = useState("");
  const [members, setMembers] = useState<Member[]>([
    { name: "", email: "" },
  ]);
  const [submitted, setSubmitted] = useState(false);
  const [registrationId, setRegistrationId] = useState("");
  const [passMembers, setPassMembers] = useState<PassMember[]>([]);

  function updateMember(
    index: number,
    field: "name" | "email",
    value: string
  ) {
    setMembers((current) =>
      current.map((member, i) =>
        i === index ? { ...member, [field]: value } : member
      )
    );
  }

  function addMember() {
    setMembers((current) => [
      ...current,
      { name: "", email: "" },
    ]);
  }

  function downloadQR(id: string, name: string) {
    const svg = document.getElementById(id);

    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${name}-QR.svg`;
    link.click();

    URL.revokeObjectURL(url);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const newRegistrationId = `EVT-${crypto.randomUUID()}`;

    const allMembers: PassMember[] = [
      {
        id: crypto.randomUUID(),
        name: leaderName,
        email,
      },
      ...members.map((member) => ({
        ...member,
        id: crypto.randomUUID(),
      })),
    ];

    setRegistrationId(newRegistrationId);
    setPassMembers(allMembers);
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

          <h1 className="mt-3 text-3xl font-bold">
            Register your team
          </h1>

          <p className="mt-3 leading-7 text-slate-400">
            Add your team details. Each member will receive an individual QR pass.
          </p>

          {submitted ? (
            <div className="mt-8">
              <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-5">
                <h2 className="text-xl font-bold text-emerald-300">
                  Registration preview generated!
                </h2>

                <p className="mt-2 text-slate-300">
                  Team: {teamName}
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  Registration ID: {registrationId}
                </p>

                <p className="mt-3 text-xs text-amber-300">
                  Demo mode: registrations are not yet saved to Supabase.
                </p>
              </div>

              <h2 className="mt-8 text-xl font-bold">
                Your Team Pass
              </h2>

              <div className="mt-4 rounded-2xl bg-white p-6 text-center text-slate-950">
                <p className="text-xl font-bold">{teamName}</p>

                <div className="my-5 flex justify-center">
                  <QRCodeSVG
                    id="team-qr"
                    value={JSON.stringify({
                      registrationId,
                      teamName,
                      type: "team",
                    })}
                    size={190}
                    level="H"
                  />
                </div>

                <p className="text-sm font-semibold">
                  {registrationId}
                </p>

                <button
                  onClick={() => downloadQR("team-qr", "team-pass")}
                  className="mt-4 rounded-full bg-slate-950 px-5 py-2 text-sm font-semibold text-white"
                >
                  Download Team QR
                </button>
              </div>

              <h2 className="mt-8 text-xl font-bold">
                Individual Member Passes
              </h2>

              <div className="mt-4 space-y-4">
                {passMembers.map((member, index) => {
                  const qrId = `member-qr-${index}`;

                  return (
                    <div
                      key={member.id}
                      className="flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-[#07090d] p-5 sm:flex-row"
                    >
                      <div className="rounded-xl bg-white p-3">
                        <QRCodeSVG
                          id={qrId}
                          value={JSON.stringify({
                            registrationId,
                            memberId: member.id,
                            teamName,
                            type: "member",
                          })}
                          size={120}
                          level="H"
                        />
                      </div>

                      <div className="text-center sm:text-left">
                        <p className="font-bold">{member.name}</p>

                        <p className="text-sm text-slate-400">
                          {index === 0 ? "Team Leader" : "Team Member"}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {member.email}
                        </p>

                        <button
                          onClick={() =>
                            downloadQR(qrId, member.name.replace(/\s+/g, "-"))
                          }
                          className="mt-3 text-sm font-semibold text-cyan-300"
                        >
                          Download QR ↓
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => setSubmitted(false)}
                className="mt-8 text-sm font-semibold text-cyan-300"
              >
                Edit registration
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <label className="block text-sm font-medium text-slate-200">
                Team name
                <input
                  required
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="e.g. Creative Crew"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[#07090d] px-4 py-3 outline-none focus:border-cyan-300"
                />
              </label>

              <label className="block text-sm font-medium text-slate-200">
                Team leader
                <input
                  required
                  value={leaderName}
                  onChange={(e) => setLeaderName(e.target.value)}
                  placeholder="Your full name"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[#07090d] px-4 py-3 outline-none focus:border-cyan-300"
                />
              </label>

              <label className="block text-sm font-medium text-slate-200">
                Email address
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[#07090d] px-4 py-3 outline-none focus:border-cyan-300"
                />
              </label>

              <div>
                <p className="mb-3 text-sm font-medium text-slate-200">
                  Team members
                </p>

                <div className="space-y-3">
                  {members.map((member, index) => (
                    <div
                      key={index}
                      className="grid gap-3 sm:grid-cols-2"
                    >
                      <input
                        required
                        value={member.name}
                        onChange={(e) =>
                          updateMember(index, "name", e.target.value)
                        }
                        placeholder={`Member ${index + 1} full name`}
                        className="w-full rounded-xl border border-white/10 bg-[#07090d] px-4 py-3 outline-none focus:border-cyan-300"
                      />

                      <input
                        required
                        type="email"
                        value={member.email}
                        onChange={(e) =>
                          updateMember(index, "email", e.target.value)
                        }
                        placeholder="Member email"
                        className="w-full rounded-xl border border-white/10 bg-[#07090d] px-4 py-3 outline-none focus:border-cyan-300"
                      />
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addMember}
                  className="mt-4 text-sm font-semibold text-cyan-300"
                >
                  + Add another member
                </button>
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-cyan-300 px-6 py-3.5 font-bold text-slate-950 hover:bg-cyan-200"
              >
                Generate Registration QR →
              </button>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
