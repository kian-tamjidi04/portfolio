import { motion } from 'framer-motion';
import { ArrowRight, Download } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 pb-20 pt-32 lg:pb-32 lg:pt-48">
      <div className="relative z-10 mx-auto w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="mb-6 inline-block rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold tracking-wide text-indigo-600">
            Junior UX/UI Engineer
          </span>
          <h1 className="mb-8 text-5xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-7xl">
            Designing digital <br className="hidden md:block" />
            experiences that <span className="text-indigo-600">matter.</span>
          </h1>
          <p className="mb-10 max-w-2xl text-xl font-light leading-relaxed text-slate-600 md:text-2xl">
            I specialize in crafting intuitive, accessible, and highly performant interfaces that bridge the
            gap between elegant design and robust code.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <a
              href="#projects"
              className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-8 py-4 text-base font-medium text-white shadow-md transition-all duration-300 hover:bg-indigo-700 hover:shadow-lg"
            >
              View My Work
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border-2 border-slate-200 bg-white px-8 py-4 text-base font-medium text-slate-700 transition-all duration-300 hover:border-slate-300 hover:bg-slate-50"
            >
              <Download className="mr-2 h-5 w-5" />
              Download Resume
            </a>
          </div>
        </motion.div>
      </div>

      {/* Decorative background blob */}
      <div className="absolute top-0 right-0 -mr-32 -mt-32 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-indigo-200 to-purple-200 opacity-30 blur-3xl filter -z-10 animate-blob" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-sky-200 to-blue-200 opacity-30 blur-3xl filter -z-10 animate-blob animation-delay-2000" />
    </section>
  );
}
