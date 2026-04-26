import { motion } from 'framer-motion';

const experiences = [
  {
    role: 'Junior UX/UI Engineer',
    company: 'TechStudio',
    period: '2025 - Present',
    description:
      'Developing scalable React component libraries based on Figma designs, improving rendering performance by 15%. Assisting in usability testing sessions to ensure products meet high accessibility standards.',
  },
  {
    role: 'Frontend Developer Intern',
    company: 'Creative Hub',
    period: 'Summer 2024',
    description:
      'Translated wireframes into interactive HTML/CSS/JS prototypes. Collaborated with senior designers to refine mobile accessibility, ensuring WCAG 2.1 AA compliance.',
  },
  {
    role: 'BSc Computer Science',
    company: 'University of Technology',
    period: '2021 - 2025',
    description:
      'Specialized in Human-Computer Interaction (HCI) and Frontend Web Development. Graduated with Honors.',
  },
];

export default function Experience() {
  return (
    <section id="experience" className="bg-white px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <motion.div
          className="mb-16 md:text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4">
            Experience & Education
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-xl leading-relaxed text-slate-500">
            My journey through design and software engineering.
          </p>
        </motion.div>

        <div className="ml-4 space-y-12 border-l-2 border-indigo-100 pl-6 md:mx-auto md:max-w-2xl">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              className="relative"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="absolute -left-[33px] top-1.5 h-4 w-4 rounded-full bg-indigo-600 outline outline-4 outline-white" />

              <div className="mb-2 flex flex-col md:flex-row md:items-baseline md:justify-between">
                <h3 className="mr-4 text-xl font-bold text-slate-900">{exp.role}</h3>
                <span className="mt-2 inline-block w-fit rounded-md bg-indigo-50 px-2 py-1 text-sm font-semibold text-indigo-600 md:mt-0">
                  {exp.period}
                </span>
              </div>
              <h4 className="text-lg text-slate-600 mb-3 font-medium">{exp.company}</h4>
              <p className="text-slate-600 leading-relaxed text-base">
                {exp.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
