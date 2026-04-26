export type CardType =
  | 'hero'
  | 'certifications'
  | 'social'
  | 'about'
  | 'experience'
  | 'project'
  | 'projects'
  | 'education'
  | 'vision'
  | 'skills';

export interface CardBase {
  id: string;
  type: CardType;
  label: string;
  title: string;
  summary: string;
  placementClass: string;
  nonClickable?: boolean;
}

export interface SocialLink {
  platform: string;
  handle: string;
  description: string;
  href: string;
  icon?: string;
}

export interface ExperienceRole {
  role: string;
  company: string;
  dates: string;
  impact: string;
  skills: string[];
  isRecent: boolean;
}

export interface TagItem {
  name: string;
  primary?: boolean;
}

export interface ExternalLink {
  label: string;
  href: string;
}

export interface ProjectPreviewItem {
  id: string;
  title: string;
  summary: string;
  stack: TagItem[];
  impact: string[];
  links: ExternalLink[];
}

export interface CertItem {
  name: string;
  issuer: string;
  date: string;
  badge?: string;
}

export interface EducationEntry {
  degree: string;
  institution: string;
  dates: string;
  details: string;
  modules: string[];
}

export interface SkillCategory {
  label: string;
  items: string[];
}

export interface HeroCard extends CardBase {
  type: 'hero';
  name: string;
  subtitle: string;
}

export interface CertificationsCard extends CardBase {
  type: 'certifications';
  certs: CertItem[];
}

export interface SocialCard extends CardBase {
  type: 'social';
  links: SocialLink[];
}

export interface AboutCard extends CardBase {
  type: 'about';
  bio: string[];
  beliefs: string[];
}

export interface ExperienceCard extends CardBase {
  type: 'experience';
  roles: ExperienceRole[];
}

export interface ProjectCard extends CardBase {
  type: 'project';
  imageTitle: string;
  description: string;
  impact: string[];
  stack: TagItem[];
  links: ExternalLink[];
}

export interface ProjectsCard extends CardBase {
  type: 'projects';
  items: ProjectPreviewItem[];
}

export interface EducationCard extends CardBase {
  type: 'education';
  entries: EducationEntry[];
}

export interface VisionCard extends CardBase {
  type: 'vision';
  body: string[];
  goals: string[];
}

export interface SkillsCard extends CardBase {
  type: 'skills';
  categories: SkillCategory[];
}

export type PortfolioCard =
  | HeroCard
  | CertificationsCard
  | SocialCard
  | AboutCard
  | ExperienceCard
  | ProjectCard
  | ProjectsCard
  | EducationCard
  | VisionCard
  | SkillsCard;

export const portfolioCards: PortfolioCard[] = [
  {
    id: 'hero',
    type: 'hero',
    label: 'Intro',
    title: 'Kian Tamjidi',
    summary: 'Computer Science Student · Software Engineer · Aspiring Product Designer',
    placementClass: 'place-hero',
    nonClickable: true,
    name: 'Kian Tamjidi',
    subtitle: 'Developer & Product Designer',
  },
  {
    id: 'about',
    type: 'about',
    label: 'About',
    title: 'Who I am',
    summary: 'Product-minded engineer focused on useful, durable interfaces.',
    placementClass: 'place-about',
    bio: [
      'I move between design and development so product decisions can stay grounded in real constraints and real users. I care about momentum, clear priorities, and thoughtful defaults that make teams faster.',
      'Most of my work sits at the intersection of front-end engineering, interaction design, and experimentation. I enjoy turning rough ideas into shipped systems that feel both calm and precise.',
    ],
    beliefs: [
      'A clear product story reduces technical complexity.',
      'Interfaces should reward attention without demanding it.',
      'Small, frequent releases beat large speculative rewrites.',
    ],
  },
  {
    id: 'social',
    type: 'social',
    label: 'Social',
    title: 'GitHub / LinkedIn',
    summary: 'Find me across the platforms where I build and share.',
    placementClass: 'place-social',
    links: [
      {
        platform: 'GitHub',
        handle: '@kian-tamjidi04',
        description: 'Code, experiments, and archived product prototypes.',
        href: 'https://github.com/kian-tamjidi04',
        icon: '../public/custom_github.svg',
      },
      {
        platform: 'LinkedIn',
        handle: '/in/kian-tamjidi',
        description: 'Experience highlights and writing about shipping teams.',
        href: 'https://www.linkedin.com/in/kian-tamjidi',
        icon: '../public/custom_linkedin.svg',
      },
      {
        platform: 'CV',
        handle: 'Download PDF',
        description: 'A concise one-page resume with impact-focused metrics.',
        href: '#',
      },
    ],
  },
  {
    id: 'experience',
    type: 'experience',
    label: 'Experience',
    title: "Where I've worked",
    summary: 'Teams where I shipped measurable improvements across product and UX.',
    placementClass: 'place-experience',
    roles: [
      {
        role: 'Product Engineer',
        company: 'Northline Labs',
        dates: '2024 - Present',
        impact:
          'Led a design-to-code system refresh that reduced UI inconsistency across 12 core flows. Partnered with PM and design to launch a new onboarding path that improved week-one activation by 18%.',
        skills: ['React', 'TypeScript', 'Design Systems', 'A/B Testing'],
        isRecent: true,
      },
      {
        role: 'Frontend Developer',
        company: 'Studio Meridian',
        dates: '2022 - 2024',
        impact:
          'Rebuilt the client dashboard with modular card architecture, cutting release friction for new features. Introduced usage analytics instrumentation that informed roadmap decisions for three quarters.',
        skills: ['UI Architecture', 'Accessibility', 'Analytics'],
        isRecent: false,
      },
      {
        role: 'Product Design Intern',
        company: 'Arcflow',
        dates: '2021 - 2022',
        impact:
          'Prototyped high-traffic account settings flows and validated interaction changes through moderated tests. Delivered developer-ready specs and token proposals that accelerated implementation handoff.',
        skills: ['Figma', 'Research', 'Prototyping'],
        isRecent: false,
      },
    ],
  },
  {
    id: 'education',
    type: 'education',
    label: 'Education',
    title: 'Where I studied',
    summary: 'Formal foundations in computing, design, and systems thinking.',
    placementClass: 'place-education',
    entries: [
      {
        degree: 'BSc Computer Science',
        institution: 'University of Exeter',
        dates: '2022 - 2025',
        details: 'First Class Honours (predicted). Dissertation on adaptive UI personalisation using reinforcement learning.',
        modules: ['Algorithms & Data Structures', 'Human-Computer Interaction', 'Machine Learning', 'Software Engineering', 'Databases'],
      },
    ],
  },
  {
    id: 'certifications',
    type: 'certifications',
    label: 'Certifications',
    title: 'Credentials',
    summary: 'Verified skills across cloud, AI, and engineering.',
    placementClass: 'place-certifications',
    certs: [
      {
        name: 'AWS Certified Cloud Practitioner',
        issuer: 'Amazon Web Services',
        date: '2024',
      },
      {
        name: 'Google AI Essentials',
        issuer: 'Google',
        date: '2024',
      },
      {
        name: 'Meta Front-End Developer Certificate',
        issuer: 'Meta',
        date: '2023',
      },
      {
        name: 'CS50x: Introduction to Computer Science',
        issuer: 'Harvard / edX',
        date: '2022',
      },
    ],
  },
  {
    id: 'skills',
    type: 'skills',
    label: 'Skills',
    title: 'What I use',
    summary: 'Languages, tools, and the practices that connect them.',
    placementClass: 'place-skills',
    categories: [
      {
        label: 'Languages',
        items: ['TypeScript', 'Python', 'JavaScript', 'SQL', 'HTML / CSS'],
      },
      {
        label: 'AI Tools',
        items: ['OpenAI API', 'LangChain', 'Vertex AI', 'Hugging Face'],
      },
      {
        label: 'Dev Tools',
        items: ['React', 'Next.js', 'Node.js', 'Docker', 'Git', 'PostgreSQL'],
      },
      {
        label: 'Design',
        items: ['Figma', 'Framer', 'Prototyping', 'Design Systems'],
      },
      {
        label: 'Soft Skills',
        items: ['Product Thinking', 'Stakeholder Comms', 'Estimation', 'Cross-functional Collab'],
      },
    ],
  },
  {
    id: 'projects',
    type: 'projects',
    label: 'projects',
    title: 'what I build',
    summary: 'Selected experiments, products, and systems in progress.',
    placementClass: 'place-projects',
    items: [
      {
        id: 'project-01',
        title: 'Project One',
        summary: 'A placeholder concept focused on practical workflow improvements.',
        impact: ['Placeholder metric to be replaced', 'Placeholder outcome to be replaced'],
        stack: [{ name: 'React', primary: true }, { name: 'TypeScript', primary: true }, { name: 'API' }],
        links: [{ label: 'Live Site', href: '#' }, { label: 'GitHub', href: '#' }],
      },
      {
        id: 'project-02',
        title: 'Project Two',
        summary: 'A placeholder concept for a data-rich product experience.',
        impact: ['Placeholder metric to be replaced', 'Placeholder outcome to be replaced'],
        stack: [{ name: 'Next.js', primary: true }, { name: 'Node.js' }, { name: 'PostgreSQL' }],
        links: [{ label: 'Live Site', href: '#' }, { label: 'GitHub', href: '#' }],
      },
      {
        id: 'project-03',
        title: 'Project Three',
        summary: 'A placeholder concept designed around team collaboration.',
        impact: ['Placeholder metric to be replaced', 'Placeholder outcome to be replaced'],
        stack: [{ name: 'Figma', primary: true }, { name: 'Framer Motion' }, { name: 'Design System' }],
        links: [{ label: 'Live Site', href: '#' }, { label: 'GitHub', href: '#' }],
      },
      {
        id: 'project-04',
        title: 'Project Four',
        summary: 'A placeholder concept with an emphasis on onboarding clarity.',
        impact: ['Placeholder metric to be replaced', 'Placeholder outcome to be replaced'],
        stack: [{ name: 'Vite', primary: true }, { name: 'React Query' }, { name: 'Tailwind CSS' }],
        links: [{ label: 'Live Site', href: '#' }, { label: 'GitHub', href: '#' }],
      },
      {
        id: 'project-05',
        title: 'Project Five',
        summary: 'A placeholder concept for decision-support tooling.',
        impact: ['Placeholder metric to be replaced', 'Placeholder outcome to be replaced'],
        stack: [{ name: 'Python', primary: true }, { name: 'FastAPI' }, { name: 'OpenAI API' }],
        links: [{ label: 'Live Site', href: '#' }, { label: 'GitHub', href: '#' }],
      },
      {
        id: 'project-06',
        title: 'Project Six',
        summary: 'A placeholder concept for simplifying recurring operations.',
        impact: ['Placeholder metric to be replaced', 'Placeholder outcome to be replaced'],
        stack: [{ name: 'Docker', primary: true }, { name: 'Redis' }, { name: 'Celery' }],
        links: [{ label: 'Live Site', href: '#' }, { label: 'GitHub', href: '#' }],
      },
      {
        id: 'project-07',
        title: 'Project Seven',
        summary: 'A placeholder concept for mobile-first product delivery.',
        impact: ['Placeholder metric to be replaced', 'Placeholder outcome to be replaced'],
        stack: [{ name: 'React Native', primary: true }, { name: 'Expo' }, { name: 'Supabase' }],
        links: [{ label: 'Live Site', href: '#' }, { label: 'GitHub', href: '#' }],
      },
      {
        id: 'project-08',
        title: 'Project Eight',
        summary: 'A placeholder concept centered on analytics and reporting.',
        impact: ['Placeholder metric to be replaced', 'Placeholder outcome to be replaced'],
        stack: [{ name: 'D3', primary: true }, { name: 'TypeScript' }, { name: 'PostgreSQL' }],
        links: [{ label: 'Live Site', href: '#' }, { label: 'GitHub', href: '#' }],
      },
    ],
  },
  {
    id: 'vision',
    type: 'vision',
    label: 'The next chapter',
    title: "Where I'm going",
    summary: 'What I want to build, and the kind of work that drives me forward.',
    placementClass: 'place-vision',
    body: [
      "I want to work at the intersection of ambitious product ideas and the engineering discipline to ship them reliably. I'm drawn to teams that treat craft and speed as compatible — not opposing — forces.",
    ],
    goals: [
      'Join a product team building something genuinely novel',
      'Deepen expertise in AI-native interfaces and tooling',
      'Ship products that measurably improve how people work',
      'Eventually lead product strategy on a focused team',
    ],
  },
];
