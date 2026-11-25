const features = [
  {
    number: "01",
    title: "One team form",
    description:
      "Register your team and add all members in one place. No messy spreadsheets.",
  },
  {
    number: "02",
    title: "Quick QR check-in",
    description:
      "Give every member a QR pass. Volunteers can scan it from a phone browser.",
  },
  {
    number: "03",
    title: "Live attendance",
    description:
      "See who has arrived, mark late entries, and prepare the OD list.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#07090d] text-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <a href="#" className="text-xl font-bold tracking-tight">
          Event<span className="text-cyan-400">Hub</span>
        </a>

        <div className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
          <a href="#how-it-works" className="transition hover:text-cyan-300">
            How it works
          </a>
          <a href="#for-organizers" className="transition hover:text-cyan-300">
            For organizers
          </a>
        </div>

        <a
          href="#register"
          className="rounded-full border border-cyan-400/40 px-5 py-2.5 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400 hover:text-slate-950"
        >
          Get started <span aria-hidden="true">↗</span>
        </a>
      </nav>

      <section className="relative mx-auto max-w-6xl px-6 pb-24 pt-20 md:pb-32 md:pt-28">
        <div className="pointer-events-none absolute left-1/2 top-10 -z-0 h-80 w-80 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[100px]" />

        <div className="relative max-w-3xl">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            Made for college events
          </p>

          <h1 className="text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
            Register in a minute.
            <br />
            <span className="text-cyan-300">Enter in 2 seconds.</span>
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-400">
            Team passes, faster gate check-ins, and attendance records in one
            simple place. Less queue at the door. Less paperwork after the event.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <a
              id="register"
              href="/register"
              className="rounded-full bg-cyan-300 px-6 py-3.5 font-bold text-slate-950 transition hover:bg-cyan-200"
            >
              Register your team <span aria-hidden="true">→</span>
            </a>
            <a
              href="#how-it-works"
              className="rounded-full border border-white/15 px-6 py-3.5 font-semibold text-white transition hover:border-white/40"
            >
              See how it works
            </a>
          </div>
        </div>

        <div className="mt-16 grid max-w-3xl grid-cols-3 gap-3 border-t border-white/10 pt-6 sm:gap-8">
          <div>
            <p className="text-2xl font-bold text-white">1</p>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">team form</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">2 sec</p>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">target scan</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">1 click</p>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">OD export</p>
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="border-t border-white/10 bg-white/[0.02]"
      >
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
            The event day, made easier
          </p>
          <h2 className="mt-4 max-w-xl text-3xl font-bold tracking-tight sm:text-4xl">
            One smooth flow from signup to check-in.
          </h2>

          <div
            id="for-organizers"
            className="mt-10 grid gap-4 md:grid-cols-3"
          >
            {features.map((feature) => (
              <article
                key={feature.number}
                className="rounded-2xl border border-white/10 bg-[#0c1017] p-6 transition hover:border-cyan-400/40"
              >
                <p className="font-mono text-sm text-cyan-300">
                  {feature.number}
                </p>
                <h3 className="mt-6 text-xl font-semibold">{feature.title}</h3>
                <p className="mt-3 leading-7 text-slate-400">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}