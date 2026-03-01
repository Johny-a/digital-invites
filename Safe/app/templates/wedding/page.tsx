import Link from "next/link";

export default function WeddingTemplatesPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black" />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.2),transparent_60%)]" />

        <div className="relative z-10 text-center px-6 max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Wedding Invitations
          </h1>

          <p className="text-gray-400 text-lg md:text-xl mb-10">
            Choose from our luxury cinematic wedding invitation templates.  
            Elegant, emotional, unforgettable.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/invitation?step=1"
              className="px-10 py-4 rounded-full bg-yellow-500 text-black font-semibold hover:bg-yellow-400 transition"
            >
              Choose Your Template
            </Link>

            <Link
              href="/"
              className="px-10 py-4 rounded-full border border-white/30 text-white hover:bg-white/10 transition"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>

      {/* Why Section */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12">
          Why Our Wedding Invitations?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <div className="text-3xl mb-4">🎬</div>
            <h3 className="text-xl font-semibold mb-2">Cinematic Experience</h3>
            <p className="text-gray-400 text-sm">
              Fullscreen video, music, and smooth transitions for a premium feel.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <div className="text-3xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold mb-2">Luxury Templates</h3>
            <p className="text-gray-400 text-sm">
              Carefully designed styles: floral, minimalist, romance, classic.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <div className="text-3xl mb-4">📱</div>
            <h3 className="text-xl font-semibold mb-2">Mobile First</h3>
            <p className="text-gray-400 text-sm">
              Perfectly optimized for sharing with guests on any device.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 text-center text-gray-500 text-sm border-t border-white/10">
        © {new Date().getFullYear()} Luxury Invitations. All rights reserved.
      </footer>
    </div>
  );
}
