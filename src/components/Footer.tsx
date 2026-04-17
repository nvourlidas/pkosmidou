export default function Footer() {
  return (
    <footer className="bg-pk-dark-deeper border-t border-[#2A2A3E] py-8">
      <div className="max-w-[1200px] mx-auto px-10 flex items-center justify-between gap-4 max-sm:flex-col max-sm:text-center">
        <div className="flex items-center gap-3.5 text-[#818181] text-[0.85rem]">
          <span className="font-display text-[1.1rem] font-bold text-pk-purple">Π.Κ.</span>
          <span>Πασχαλία Κοσμίδου — Πολιτικός Μηχανικός</span>
        </div>
        <span className="text-[0.78rem] text-[#818181]">
          © {new Date().getFullYear()} <a href="https://cloudtec.gr" target="_blank" rel="noopener noreferrer" className="hover:text-pk-purple">CloudTec</a>. Όλα τα δικαιώματα διατηρούνται.
        </span>
      </div>
    </footer>
  )
}
