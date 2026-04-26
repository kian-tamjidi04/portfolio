import { motion } from 'framer-motion';
import { PenTool, Code, Search, Layers } from 'lucide-react';

const skills = [
  {
    name: 'UX/UI Design',
    icon: <PenTool className="text-indigo-600 mb-3 h-8 w-8" />,
    description: 'Figma, Wireframing, Prototyping, Design Systems, User Research.',
  },
  {
    name: 'Frontend Dev',
    icon: <Code className="text-indigo-600 mb-3 h-8 w-8" />,
    description: 'React, TypeScript, Tailwind CSS, Framer Motion, HTML5, CSS3.',
  },
  {
    name: 'User Research',
    icon: <Search className="text-indigo-600 mb-3 h-8 w-8" />,
    description: 'Usability Testing, Personas, A/B Testing, Analytics.',
  },
  {
    name: 'Architecture',
    icon: <Layers className="text-indigo-600 mb-3 h-8 w-8" />,
    description: 'Responsive Design, Accessibility (a11y), Performance Optimization.',
  },
];

export default function About() {
  return (
    <section id="about" className="bg-white px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="mb-16 md:text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-4xl">
            Bridging Design & Code
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-xl leading-relaxed text-slate-500">
            I am a junior software engineer with a strong foundation in UX/UI principles. My goal is to
            build digital products that are not only functional but deeply empathetic to user needs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="rounded-2xl border border-slate-100 bg-slate-50 p-8 shadow-sm transition-shadow hover:shadow-md"
            >
              {skill.icon}
              <h3 className="text-xl font-bold text-slate-900 mb-2">{skill.name}</h3>
              <p className="text-slate-600 leading-relaxed text-sm">{skill.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
