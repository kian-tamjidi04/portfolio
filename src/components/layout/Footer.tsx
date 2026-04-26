export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 px-6">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm md:text-base">
        <div>
          <span className="font-semibold text-white">Kian</span> © {new Date().getFullYear()} All rights reserved.
        </div>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-white transition-colors duration-200">Dribbble</a>
          <a href="#" className="hover:text-white transition-colors duration-200">LinkedIn</a>
          <a href="#" className="hover:text-white transition-colors duration-200">GitHub</a>
        </div>
      </div>
    </footer>
  );
}
