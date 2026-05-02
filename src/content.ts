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
  skills: TagItem[];
  isRecent: boolean;
  logo?: string;
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
  links?: ExternalLink[];
  challenges?: string;
  grade?: string;
}

export interface CertItem {
  name: string;
  issuer: string;
  date: string;
  icon: string;
  takeaway: string;
}

export interface EducationEntry {
  degree: string;
  institution: string;
  dates: string;
  details: string;
  modules: string[];
  isRecent?: boolean;
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
      'Hi! I\'m Kian, a Computer Science student excited about building things people actually want to use.',
      'I work at the intersection of engineering and design — I care as much about how software feels as how it works.',
      'In my free time, you can find me listening to and/or playing jazz, in the gym, or exploring new food spots.',
      'Take a look around to learn a little more about me; feel free to reach out via the social card below.',
    ],
    beliefs: [
      '"Fail early, fail often, but always fail forward" - John C. Maxwell',
      '"While great art makes you wonder, great design makes things clear" - John Maeda',
      '"Anyone can make the simple complicated. Creativity is making the complicated simple" - Charles Mingus',
    ],
  },
  {
    id: 'social',
    type: 'social',
    label: 'Social',
    title: 'How to get in touch',
    summary: 'Find me across the platforms where I build and share.',
    placementClass: 'place-social',
    links: [
      {
        platform: 'GitHub',
        handle: '@kian-tamjidi04',
        description: 'Code, experiments, and archived product prototypes.',
        href: 'https://github.com/kian-tamjidi04',
        icon: './github.svg',
      },
      {
        platform: 'LinkedIn',
        handle: '/in/kian-tamjidi',
        description: 'Experience highlights and writing about shipping teams.',
        href: 'https://www.linkedin.com/in/kian-tamjidi',
        icon: './linkedin.svg',
      },
      {
        platform: 'Email',
        handle: 'kian.tamjidi2004@gmail.com',
        description: 'A concise one-page resume with impact-focused metrics.',
        href: 'mailto:kian.tamjidi2004@gmail.com',
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
        role: 'Frontend Engineer and Designer',
        company: 'UBS',
        dates: '2025 - Present',
        impact: 'Part of a small frontend team keeping a self-support site running for 140k UBS employees. Prototyped and deployed a conversational internal chatbot and gamified dashboards to cut ticket volume. Redesigned the mobile app from the ground up alongside developers and business analysts.',
        skills: [
          { name: 'React', primary: true },
          { name: 'TypeScript', primary: true },
          { name: 'Angular', primary: true },
          { name: 'Figma', primary: true },
          { name: 'HTML', primary: true },
          { name: 'CSS', primary: true },
          { name: 'UX Design', primary: true },
          { name: 'Communication' },
          { name: 'Innovation' }
        ],
        isRecent: true,
        logo: './UBS.svg',
      },
      {
        role: 'IEUK Technology Stream Participant',
        company: 'Bright Network',
        dates: '2024',
        impact: "Delivered a strategic presentation, emulating the role of a product manager, aiming to increase an app's paid subscriber count by 20%. Selected in the top 1% of 2,500+ attendees at IEUK — invited to a BT Group event in recognition of outstanding contribution across workshops spanning data science and software engineering.",
        skills: [{ name: 'Collaboration' }, { name: 'Communication' }, { name: 'Research' }],
        isRecent: false,
        logo: './bright_network.svg',
      },
    ],
  },
  {
    id: 'education',
    type: 'education',
    label: 'Education',
    title: "Where I've studied",
    summary: 'Formal foundations in computing, design, and systems thinking.',
    placementClass: 'place-education',
    entries: [
      {
        degree: 'BSc Computer Science with Intercalated Year',
        institution: 'University of Warwick',
        dates: '2023 - 2027',
        details: 'Achieved First Class (1:1) in my first two years. Member of the University Small Band, playing multiple gigs throughout the year for paying clients.',
        modules: ['Data Structures & Algorithms', 'Artificial Intelligence', 'Formal Languages', 'Software Engineering', 'Database Systems', 'Operating Systems and Computer Networks', 'Data Analytics'],
        isRecent: true,
      },
      {
        degree: 'A Levels',
        institution: 'Hill House School',
        dates: '2021 - 2023',
        details: 'Selected as Head Boy, delivering a speech to 200+ attendees and organising a team of 10+ prefects. Lead saxophonist in Jazz Orchestra and member of student-led Jazz Quartet.',
        modules: ['Further Mathematics (A*)', 'Mathematics (A*)', 'Computer Science (A*)', 'Music (A)'],
      },
    ],
  },
  {
    id: 'certifications',
    type: 'certifications',
    label: 'Certifications',
    title: "What I've earnt",
    summary: 'Verified skills across cloud, AI, and engineering.',
    placementClass: 'place-certifications',
    certs: [
      {
        name: 'UX Design Professional Certificate',
        issuer: 'Google',
        date: 'In progress',
        takeaway: 'Developing a strong understanding of the entire UX flow, from conducting user research and paper prototyping for quick feedback, to lo-fi and hi-fi digital prototypes using Figma.',
        icon: './google.svg',
      },
      {
        name: 'Introduction to Agent Skills',
        issuer: 'Anthropic',
        date: '2026',
        takeaway: 'Understood how to leverage skills when coding with agentic tools, alongside fundamentals of tools such as MCP servers, hooks and subagents',
        icon: './anthopic.svg',
      },
      {
        name: 'Advanced React',
        issuer: 'Meta',
        date: '2026',
        takeaway: 'Learnt a greater array of React skills, putting them into practice during my Year in Industry',
        icon: './meta.svg',
      },
      {
        name: 'AI-900 Azure AI Fundamentals',
        issuer: 'Microsoft',
        date: '2025',
        takeaway: 'Gained a strong understanding of core AI concepts and how they relate to Microsoft Azure, including Generative AI, Natural Language Processing, Computer Vision and Responsible AI.',
        icon: './microsoft.svg',
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
        items: ['Java', 'TypeScript', 'Python', 'JavaScript', 'SQL', 'HTML / CSS', 'Swift / SwiftUI', 'Haskell'],
      },
      {
        label: 'AI Tools',
        items: ['OpenAI API', 'Figma MCP', 'Claude', 'Cursor', 'Github Copilot', 'Figma Make'],
      },
      {
        label: 'Dev Tools',
        items: ['React', 'Xcode', 'Node.js', 'Git', 'GitLab', 'PostgreSQL', 'Angular', 'Jupyter Notebook'],
      },
      {
        label: 'Design',
        items: ['Figma', 'Prototyping', 'Design Systems'],
      },
      {
        label: 'Soft Skills',
        items: ['Product Thinking', 'Cross-Functional Collaboration', 'Time Management', 'Attention to Detail', 'Adaptability'],
      },
    ],
  },
  {
    id: 'projects',
    type: 'projects',
    label: 'Projects',
    title: 'What I build',
    summary: 'Selected experiments, products, and systems in progress.',
    placementClass: 'place-projects',
    items: [
      {
        id: 'project-02',
        title: 'Traffic Junction Simulator',
        summary: 'Led a group of 6 students as project manager to execute a full stack junction modelling application, based on a brief from Dorset Software. Designed the UI using paper prototyping and iteratively improved the UI with the frontend subteam. Oversaw project management using a kanban methodology, achieving an overall first for the project.',
        stack: [{ name: 'React', primary: true }, { name: 'Java', primary: true }, { name: 'Springboot', primary: true }, { name: 'Version Control', primary: true }, { name: 'Test Driven Development', primary: true }, { name: 'Project Management' }, { name: 'Leadership' }, { name: 'Kanban' }, { name: 'Gantt Charts' },],
        challenges: "The harder challenge wasn't the technical stack — it was keeping six people aligned when priorities and working styles clashed. I had to learn quickly how to have direct conversations about progress without killing team morale and momentum.",
        links: [{ label: 'GitHub', href: 'https://github.com/ascomlexicon/junction-model' }],
        grade: '70%'
      },
      {
        id: 'project-03',
        title: 'Intrusion Detection System',
        summary: 'Engineered a multithreaded packet sniffing system in C to analyze network traffic. Ensured strict memory safety by utilising Valgrind to verify zero memory leaks upon execution. Added mutex locks to prevent race conditions and deadlocks.',
        stack: [{ name: 'C', primary: true }, { name: 'Multithreading', primary: true }, { name: 'pthreads', primary: true }, { name: 'Resilience' }, { name: 'Efficiency' }],
        challenges: "Translating a working single-threaded design into a concurrent, race-condition-safe system required a complete rethink of state management — something the lecture content hadn\'t fully prepared me for.",
        grade: '89%'
      },
      {
        id: 'project-07',
        title: 'Daily UI Challenge',
        summary: 'Working through daily UI prompts to sharpen my design eye. Researching best practices on Dribbble and Mobbin, then building hi-fi prototypes in Figma to put them into practice. Using AI tools to ideate mock content, keeping my focus on design structure and visual decisions.',
        stack: [{ name: 'Figma Design', primary: true }, { name: 'UX Design', primary: true }, { name: 'Prototyping', primary: true }, { name: 'Prompt Engineering', primary: true }, { name: 'Claude', primary: true }],
        challenges: "Early on I kept designing what I thought looked good rather than what made sense for the user. Studying references on Dribbble and Mobbin helped me understand the gap — I now start with the flow before touching aesthetics."
      },
      {
        id: 'project-06',
        title: 'Binary Options XR Trading Simulator Game',
        summary: 'Developed a game for the Apple Vision Pro that allowed users to buy/sell tech stocks based on historical data. Presented the application at UBS Digital Day in London to employees from across the bank. Received interest from multiple divisions across the bank about deploying the technology within their own teams."',
        stack: [{ name: 'MR / XR', primary: true }, { name: 'Swift', primary: true }, { name: 'visionOS', primary: true }, { name: 'AI-assisted development', primary: true }, { name: 'Blender', primary: true }, { name: 'Reality Composer Pro', primary: true }],
        challenges: 'I had three weeks to learn visionOS and RealityKit from scratch, build a working MVP, and present it at a bank-wide event in London. Good time management and leaning heavily on AI-assisted learning got me there.'
      },
      {
        id: 'project-01',
        title: 'AI Connect 4',
        summary: 'Implemented the minimax adversarial search algorithm in Python 3, applying concepts from lectures to development. Optimised my code through the use of alpha-beta pruning. Evaluated algorithm performance by tracking expanded nodes and pruning frequency across varying board sizes and win conditions.',
        stack: [{ name: 'Python', primary: true }, { name: 'Minimax', primary: true }, { name: 'Adversarial Search', primary: true }],
        challenges: 'It forced a better habit: stepping back from the code entirely, reasoning through the algorithm abstractly, then returning to implement. That shift alone cut my debugging time significantly.',
        grade: '74%'
      },
      {
        id: 'project-08',
        title: 'Music Practice App',
        summary: 'Built a gamified mobile app for musicians to log practice sessions, encouraging improved practice habits. Conducted market research and user interviews prior to design and development. Fully documented as part of the A Level Computer Science qualification and used as an exemplar project for future year groups.',
        stack: [{ name: 'Swift / SwiftUI', primary: true }, { name: 'iOS', primary: true }, { name: 'Mobile Development', primary: true }, { name: 'Project Management' }, { name: 'UX Research' }],
        links: [{ label: 'GitHub', href: 'https://github.com/kian-tamjidi04/MusicApp' }],
        challenges: "Beyond building a working app, I had to conduct and document market research, usability testing, and system design to a professional standard — all simultaneously. It taught me that shipping software is the smallest part of building a product.",
        grade: '100%'
      },
      {
        id: 'project-04',
        title: 'Full-Stack Ticketing Web Application',
        summary: 'Designed and implemented a web app for users to purchase tickets for various events. Implemented secure user registration and role-based authentication for superusers and general attendees. Highlighted for a "significant quantity of heuristic design towards usability".',
        stack: [{ name: 'Python', primary: true }, { name: 'Flask', primary: true }, { name: 'SQLAlchemy', primary: true }, { name: 'Web Design', primary: true }, { name: 'Jinja', primary: true }, { name: 'JavaScript', primary: true }, { name: 'HTML / CSS', primary: true }, { name: 'UX / UI', primary: true }, { name: 'Bootstrap 5', primary: true }],
        challenges: 'I had prior experience with HTML, however learning industry standard Bootstrap and Jinja were new to me. Thankfully, the lecture content was comprehensive and the lab tutors helped with my questions.',
        grade: '84%'
      },
      {
        id: 'project-05',
        title: 'Custom Java Interpreter',
        summary: 'Developed a custom lexer, parser and interpreter using JavaCC. Engineered the system to validate positive linear arithmetic, evaluate conditional step instructions and detect invalid programs. Decoded JavaCC exceptions to build a robust error-reporting system that accurately flags syntax violations.',
        stack: [{ name: 'JavaCC', primary: true }, { name: 'Parser', primary: true }, { name: 'Semantic Analysis', primary: true }, { name: 'Exception Handling', primary: true }, { name: 'Time Management' }],
        challenges: 'This coursework was placed at the end of Year 2 Term 2, when I also had 2 other difficult module courseworks to complete. In order to excel, I had to effectively manage my time and optimise my learning, seeking advise from older students which was invaluable.',
        grade: '83%'
      },
    ],
  },
  {
    id: 'vision',
    type: 'vision',
    label: 'Vision',
    title: "Where I'm going",
    summary: 'What I want to build, and the kind of work that drives me forward.',
    placementClass: 'place-vision',
    body: [
      "My favourite version of a project is one where I get to go from rough idea to shipped thing. I care about the gap between 'technically works' and 'actually good to use' — and I want to keep closing it."
    ],
    goals: [
      'Expand my skills in UX and product design, connecting with professionals from various backgrounds.',
      'Build fluency in AI-first products — understanding not just how to use the tools, but how to design experiences around them that genuinely change how people work.',
      'Ship products that measurably improve how people work, interact and live.',
    ],
  },
];
