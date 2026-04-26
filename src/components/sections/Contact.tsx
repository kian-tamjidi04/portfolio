import { motion } from 'framer-motion';
import { Mail, MessageSquare } from 'lucide-react';

export default function Contact() {
  return (
    <section id="contact" className="bg-slate-900 px-6 py-24 text-white">
      <div className="mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600/20">
            <MessageSquare className="h-8 w-8 text-indigo-400" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Let's build something together.
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-xl leading-relaxed text-slate-400">
            I'm currently open for new opportunities. Whether you have a question, a project idea, or
            just want to say hi, my inbox is always open!
          </p>

          <a
            href="mailto:hello@example.com"
            className="group inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-base font-semibold text-slate-900 shadow-md transition-all duration-300 hover:scale-[1.02] hover:bg-indigo-50"
          >
            <Mail className="mr-2 h-5 w-5 transition-colors group-hover:text-indigo-600" />
            Say Hello
          </a>
        </motion.div>
      </div>
    </section>
  );
}
