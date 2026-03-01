import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black" />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.2),transparent_60%)]" />

        <div className="relative z-10 text-center px-6">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Luxury Digital Invitations
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Create cinematic, elegant, unforgettable invitations for weddings,
            engagements, birthdays and exclusive events.
          </p>

          <div className="flex gap-4 justify-center">
            <Link
              href="/templates/wedding"
              className="px-8 py-4 rounded-full bg-yellow-500 text-black font-semibold hover:bg-yellow-400 transition"
            >
              Create Invitation
            </Link>
            <Link
              href="/admin/login"
              className="px-8 py-4 rounded-full border border-white/30 text-white hover:bg-white/10 transition"
            >
              Client Login
            </Link>
          </div>
        </div>
      </section>

      {/* Occasion Section */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12">
          Choose Your Occasion
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {[
            { name: "Wedding", slug: "wedding", emoji: "💍" },
            { name: "Engagement", slug: "engagement", emoji: "💎" },
            { name: "Birthday", slug: "birthday", emoji: "🎂" },
            { name: "Baby Shower", slug: "baby", emoji: "🍼" },
            { name: "Graduation", slug: "graduation", emoji: "🎓" },
            { name: "Private Event", slug: "event", emoji: "✨" },
          ].map((o) => (
            <Link
              key={o.slug}
              href={`/templates/${o.slug}`}
              className="group bg-white/5 border border-white/10 rounded-2xl p-8 text-center hover:border-yellow-500 hover:bg-white/10 transition"
            >
              <div className="text-4xl mb-4">{o.emoji}</div>
              <div className="text-xl font-semibold mb-2">{o.name}</div>
              <div className="text-gray-400 text-sm">
                Explore premium templates
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 text-center text-gray-500 text-sm border-t border-white/10">
        © {new Date().getFullYear()} Luxury Invitations. All rights reserved.
      </footer>
    </div>
  );
}
