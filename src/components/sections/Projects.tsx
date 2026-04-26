import { motion } from 'framer-motion';
import { ExternalLink, GitBranch } from 'lucide-react';

const projects = [
  {
    title: 'E-Commerce Dashboard',
    description:
      'A comprehensive UX/UI redesign and implementation of a vendor dashboard. Reduced user error by 25%.',
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    tags: ['React', 'Tailwind CSS', 'Figma'],
    link: '#',
    github: '#',
  },
  {
    title: 'Finance Mobile App',
    description:
      'Prototyped and built a mobile-first PWA for tracking personal finances with rich data visualizations.',
    image:
      'https://images.unsplash.com/photo-1555421689-d68471e189f2?auto=format&fit=crop&q=80&w=800',
    tags: ['UX Research', 'Vite', 'Framer Motion'],
    link: '#',
    github: '#',
  },
];

export default function Projects() {
  return (
    <section id="projects" className="bg-slate-50 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="mb-16 md:text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Selected Works
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-xl leading-relaxed text-slate-500">
            Case studies blending user-centric design with modern frontend architecture.
          </p>
        </motion.div>

        <div className="space-y-16 lg:space-y-24">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              className={`flex flex-col items-center gap-8 lg:flex-row lg:gap-16 ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6 }}
            >
              <div className="group relative aspect-[4/3] w-full flex-shrink-0 overflow-hidden rounded-2xl shadow-xl lg:w-1/2">
                <div className="absolute inset-0 z-10 rounded-2xl bg-indigo-600/20 transition-colors duration-500 group-hover:bg-transparent" />
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>

              <div className="flex w-full flex-col justify-center lg:w-1/2">
                <h3 className="mb-4 text-2xl font-bold text-slate-900 lg:text-3xl">{project.title}</h3>
                <p className="mb-6 text-lg leading-relaxed text-slate-600">{project.description}</p>

                <div className="mb-8 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium tracking-wide text-slate-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <a
                    href={project.link}
                    className="flex items-center font-semibold text-slate-900 transition-colors hover:text-indigo-600"
                  >
                    View Case Study <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                  <a
                    href={project.github}
                    className="ml-4 flex items-center text-slate-500 transition-colors hover:text-slate-900"
                    aria-label="GitHub Repository"
                  >
                    <GitBranch className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
