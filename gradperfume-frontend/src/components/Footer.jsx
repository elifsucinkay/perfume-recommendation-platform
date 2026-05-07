export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-gray-300 mt-32">
      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">

        {/* BRAND */}
        <div>
          <h3 className="text-2xl font-bold text-white tracking-wide">
            GradPerfume
          </h3>
          <p className="mt-4 text-sm text-gray-400 leading-relaxed">
            Your intelligent fragrance discovery platform.
            Discover, review and define your scent identity.
          </p>
        </div>

        {/* EXPLORE */}
        <div>
          <h4 className="font-semibold text-white mb-4 uppercase tracking-wide">
            Explore
          </h4>
          <ul className="space-y-3 text-sm">
            <li>
              <a href="/perfumes" className="hover:text-pink-400 transition">
                Perfumes
              </a>
            </li>
            <li>
              <a href="/notes" className="hover:text-pink-400 transition">
                Notes
              </a>
            </li>
            <li>
              <a href="/community" className="hover:text-pink-400 transition">
                Community
              </a>
            </li>
          </ul>
        </div>

        {/* PROJECT */}
        <div>
          <h4 className="font-semibold text-white mb-4 uppercase tracking-wide">
            Project
          </h4>
          <p className="text-sm text-gray-400">
            Graduation Project <br />
            Computer Engineering
          </p>

          <p className="text-xs text-gray-500 mt-6">
            © {new Date().getFullYear()} GradPerfume
          </p>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-gray-500">
        Crafted with 💖 for fragrance lovers
      </div>
    </footer>
  );
}
