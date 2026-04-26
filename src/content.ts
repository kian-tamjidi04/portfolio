export type CardType =
  | 'hero'
  | 'status'
  | 'social'
  | 'about'
  | 'experience'
  | 'project';

export interface CardLayout {
  column: string;
  row?: string;
}

export interface CardBase {
  id: string;
  type: CardType;
  label: string;
  title: string;
  summary: string;
  placementClass: string;
  layout: CardLayout;
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

export interface HeroCard extends CardBase {
  type: 'hero';
  name: string;
  subtitle: string;
}

export interface StatusCard extends CardBase {
  type: 'status';
  statusText: string;
  statusSubtitle: string;
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

export type PortfolioCard =
  | HeroCard
  | StatusCard
  | SocialCard
  | AboutCard
  | ExperienceCard
  | ProjectCard;

export const portfolioCards: PortfolioCard[] = [
  {
    id: 'hero',
    type: 'hero',
    label: 'Intro',
    title: 'Your Name',
    summary: 'Developer & Product Designer',
    placementClass: 'place-hero',
    name: 'Your Name',
    subtitle: 'Developer & Product Designer',
    layout: {
      column: 'span 8',
      row: 'span 2',
    },
  },
  {
    id: 'status',
    type: 'status',
    label: 'Status',
    title: 'Open to opportunities',
    summary: 'Full-time & internships',
    placementClass: 'place-status',
    statusText: 'Open to opportunities',
    statusSubtitle: 'Full-time & internships',
    layout: {
      column: 'span 4',
    },
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
    layout: {
      column: 'span 4',
    },
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
    layout: {
      column: 'span 5',
    },
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
    layout: {
      column: 'span 7',
    },
  },
  {
    id: 'project-01',
    type: 'project',
    label: 'Project 01',
    title: 'Signal Board',
    summary: 'A focused product analytics workspace for feature teams.',
    placementClass: 'place-project-01',
    imageTitle: 'Signal Board Preview',
    description:
      'Signal Board helps teams track behavioral patterns without drowning in dashboards. It blends event summaries, release context, and lightweight annotation in one place.',
    impact: ['Reduced reporting setup time by 42%', 'Raised team insight-sharing cadence'],
    stack: [
      { name: 'React', primary: true },
      { name: 'TypeScript', primary: true },
      { name: 'PostgreSQL' },
      { name: 'Framer Motion' },
    ],
    links: [
      { label: 'Live Site', href: '#' },
      { label: 'GitHub', href: '#' },
    ],
    layout: {
      column: 'span 5',
    },
  },
  {
    id: 'project-02',
    type: 'project',
    label: 'Project 02',
    title: 'Sprint Atlas',
    summary: 'A planning layer that maps priorities to weekly delivery.',
    placementClass: 'place-project-02',
    imageTitle: 'Sprint Atlas Preview',
    description:
      'Sprint Atlas is a project orchestration tool that turns strategy notes into clear sprint outputs. The interface emphasizes progress confidence and communication clarity.',
    impact: ['Improved planning confidence scores', 'Cut rollover tasks across two squads'],
    stack: [
      { name: 'Next.js', primary: true },
      { name: 'Node', primary: true },
      { name: 'Prisma' },
      { name: 'Railway' },
    ],
    links: [
      { label: 'Live Site', href: '#' },
      { label: 'GitHub', href: '#' },
    ],
    layout: {
      column: 'span 4',
    },
  },
  {
    id: 'project-03',
    type: 'project',
    label: 'Project 03',
    title: 'Briefcase AI',
    summary: 'An assistant for summarizing project context before meetings.',
    placementClass: 'place-project-03',
    imageTitle: 'Briefcase AI Preview',
    description:
      'Briefcase AI pulls from notes and tickets to generate concise pre-read briefs. It helps teams enter meetings with aligned context and fewer repeated explanations.',
    impact: ['Saved prep time before stakeholder syncs', 'Improved handoff quality across teams'],
    stack: [
      { name: 'Python', primary: true },
      { name: 'FastAPI', primary: true },
      { name: 'OpenAI API' },
      { name: 'Docker' },
    ],
    links: [
      { label: 'Live Site', href: '#' },
      { label: 'GitHub', href: '#' },
    ],
    layout: {
      column: 'span 3',
    },
  },
];
