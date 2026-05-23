import { FileSystemItem } from '../types';

export const portfolioContent = {
  about: `Hi! I'm Gaurav Murali.

I love:

1. Skateboarding
2. Competitive Sports
3. Learning about Human Behaviour
4. Chess
5. Cats

(not necessarily in that order haha)

I like to keep myself as active as I can and interact with people from different walks of life.

Nice to see you here!`,

  values: `Resume Snapshot
Education
Bachelor of Engineering in Computer Science (Infosci) and Engineering
CGPA: 8.8/10 (absolute)

National Public School
Percentage: 96%

Certifications
- CS50's Web Programming with Python and JavaScript
- CS50's Introduction to Artificial Intelligence with Python
- Machine Learning Specialization by DeepLearning.AI and Stanford University

Languages
> C++, Python, JavaScript, C#, Go, SQL, HTML5, CSS, SASS

Backend & APIs
> Django, Django REST Framework, ASP.NET, REST API Design
> JWT, OAuth, Auth0
> Microservices Fundamentals
> Server-side Architecture
> Redis, Twilio, Stripe, Mailtrap

Frameworks & Platforms
> React.js, React Native, Node.js
> .NET, .NET MAUI
> TensorFlow
> Bootstrap

Databases
> PostgreSQL, MongoDB, MySQL, SQLite
> ProgressDB / OpenEdge

DevOps & Cloud
> Docker, Jenkins
> CI/CD
> Git, GitHub
> AWS, Microsoft Azure Machine Learning
> Vercel
> Postman, Swagger

AI & Machine Learning
> Agentic AI, Agent Ops, ADK
> LLMOps
> Model Context Protocol (MCP)

Software Engineering & Methodologies
> SDLC, SIT & UAT
> Scrum`,

  experiences: [
    {
      id: 'exp1',
      company: 'Greenway Health',
      role: 'Assoc. SDE Intern',
      period: '6 months',
      description: `Worked on production software in a professional engineering environment, strengthening backend development, debugging, and delivery discipline.

Key Contributions:
• Built Data Visualisation Sparkline Charts for Patient Vitals
• Database Writeback for missing endpoints via Domain Services and SNS/SQS
• Figma Wireframes for Mobile View
• Gerrit Code Reviews
• Automation Testing`,
      technologies: 'C#, .NET, .NET Maui, Jenkins, Gerrit, AWS Healthlake, FHIR'
    },
    {
      id: 'exp2',
      company: 'HappyFox',
      role: 'Backend Developer Intern',
      period: '3 months',
      description: `My first internship in college.

Designed and implemented a production-grade University Widget integrated across HappyFox products.

Key Contributions:
• Built a modular multi-tenant headless CMS with UUID-based product scoping
• Improved API response times by 40% and reduced database queries by 60% through tuning, prefetching, pagination, and caching
• Delivered secure APIs with authorization, rate limiting, and custom headers
• Added role-based content delivery, search, content reuse, and video progress tracking
• Supported CI/CD, containerization, migrations, and high automated test coverage
• Helped define API design and documentation standards while working with a 3-developer team`,
      technologies: 'React, Wagtail CMS, Django REST Framework, PostgreSQL, Redis, JWT, Docker, CI/CD'
    },
    {
      id: 'exp3',
      company: 'Mphasis',
      role: 'Full Stack Developer Intern',
      period: '3 months',
      description: `Built a meeting notes application with speech-to-text, authentication, and note management features.

Key Contributions:
• Implemented speech-to-text workflow for meeting capture
• Added user authentication, notes management, and notification features
• Contributed to testing and debugging across unit, integration, and user testing flows`,
      technologies: 'Full-stack development, Authentication, Speech-to-Text, Testing, Debugging'
    },
    {
      id: 'exp4',
      company: 'LSSgoBikes',
      role: 'Backend Developer Intern',
      period: '2 months',
      description: `A short term contract based internship with my Seniors in College for their start-up.

Worked on backend modules for a bike rental platform and used Mongo Cloud for application data handling.

Key Contributions:
• Developed backend functionality for rental workflows
• Worked with cloud-hosted MongoDB data storage in a product setting`,
      technologies: 'Backend Development, MongoDB Atlas, APIs'
    }
  ],

  projects: [
    {
      id: 'proj1',
      name: 'AI-Powered ISL Translation System',
      description: 'Built a real-time Indian Sign Language translator with gesture training, context-aware predictions, and multilingual audio output in English and Hindi. Reduced average translation latency to 1.2 seconds and achieved 90% accuracy in controlled environments.',
      tech: 'Python, OpenCV, MediaPipe, NLP, Text-to-Speech',
      link: 'available on my github'
    },
    {
      id: 'proj2',
      name: 'AI Driven Food and Product Insights Platform',
      description: 'Built a barcode-based analysis platform with webcam scanning, nutritional insights, and AI-generated ingredient and environmental analysis using Open Food Facts and Gemini. Reduced manual product lookup time by roughly 80%.',
      tech: 'Flask, OpenCV, Pyzbar, Gemini API, Open Food Facts API, JavaScript, HTML, CSS',
      link: 'available on my github'
    },
    {
      id: 'proj3',
      name: 'Pluggable University Widget for HappyFox',
      description: 'Designed and scaled a multi-tenant widget platform with secure APIs, caching, search, recommendations, and video progress tracking. Improved API performance and supported multiple products from a shared content system.',
      tech: 'React, Wagtail CMS, Django REST Framework, PostgreSQL, Redis, JWT, Docker',
      link: 'Production internship project'
    },
    {
      id: 'proj4',
      name: 'Meeting Notes Application',
      description: 'Built a full-stack application for note-taking with speech-to-text, authentication, notifications, and structured testing coverage during internship work at Mphasis.',
      tech: 'Full-stack web development, Speech-to-Text, Authentication, Testing',
      link: 'Internship project'
    }
  ],

  testimonials: [
    {
      id: 'test1',
      from: 'Smart India Hackathon',
      role: '2024 selection milestone',
      subject: 'Shortlisted for the external hackathon round',
      message: `The AI-Powered ISL Translation System was shortlisted for the external hackathon round at Smart India Hackathon 2024. The project focused on real-time sign recognition, multilingual audio output, and context-aware assistance for smoother communication.`,
      date: new Date('2024-09-01')
    },
    {
      id: 'test2',
      from: 'IEEE Student Branch, BMSIT',
      role: 'Campus achievement',
      subject: 'Winner at the IEEE GitHub Workshop Contest',
      message: `Won the IEEE GitHub Workshop Contest conducted through the IEEE Student Branch at BMSIT. The recognition reflects strong fundamentals in collaboration workflows, version control, and practical software development execution.`,
      date: new Date('2024-03-20')
    },
    {
      id: 'test3',
      from: 'ReapBenefit.org and BBMP',
      role: 'Student Summer Internship',
      subject: 'Built a smart waste management solution for Bengaluru',
      message: `Worked on an engineering solution for waste management using Smart Bins in collaboration with ReapBenefit.org and BBMP. The internship emphasized practical problem-solving, civic impact, and applied product thinking.`,
      date: new Date('2023-06-15')
    }
  ],

  easterEggs: [
    'glitch',
    'secret'
  ]
};

export const fileSystem: Record<string, FileSystemItem> = {
  about: {
    id: 'about',
    name: 'About Me',
    type: 'folder',
    icon: '📁',
    content: [
      {
        id: 'bio',
        name: 'bio.txt',
        type: 'file',
        icon: '📄',
        fileType: 'txt',
        fileContent: portfolioContent.about
      },
      {
        id: 'values',
        name: 'resume.md',
        type: 'file',
        icon: '📝',
        fileType: 'md',
        fileContent: portfolioContent.values
      },
      {
        id: 'links',
        name: 'links.txt',
        type: 'file',
        icon: '🔗',
        fileType: 'txt',
        fileContent: `GitHub
https://github.com/gaxxrav

LinkedIn
https://www.linkedin.com/in/gaurav-murali-9098bb258/

LeetCode
https://leetcode.com/u/gaxxrav/`
      }
    ]
  },
  experience: {
    id: 'experience',
    name: 'Experience',
    type: 'folder',
    icon: '💼',
    content: portfolioContent.experiences.map(exp => ({
      id: exp.id,
      name: exp.company,
      type: 'folder' as const,
      icon: '📂',
      content: [
        {
          id: `${exp.id}-details`,
          name: 'details.txt',
          type: 'file' as const,
          icon: '📄',
          fileType: 'txt' as const,
          fileContent: `${exp.role}\n${exp.period}\n\n${exp.description}\n\nTechnologies: ${exp.technologies}`
        }
      ]
    }))
  },
  projects: {
    id: 'projects',
    name: 'Projects',
    type: 'folder',
    icon: '🎨',
    content: portfolioContent.projects.map(proj => ({
      id: proj.id,
      name: proj.name,
      type: 'folder' as const,
      icon: '📂',
      content: [
        {
          id: `${proj.id}-readme`,
          name: 'README.md',
          type: 'file' as const,
          icon: '📝',
          fileType: 'md' as const,
          fileContent: `# ${proj.name}\n\n${proj.description}\n\n## Technologies\n${proj.tech}\n\n## Link\n${proj.link}`
        }
      ]
    }))
  },
  playground: {
    id: 'playground',
    name: 'Playground',
    type: 'folder',
    icon: '🎮',
    content: [
      {
        id: 'experiments',
        name: 'what is this.txt',
        type: 'file',
        icon: '📄',
        fileType: 'txt',
        fileContent: `Here you can see my stats across various platforms`
      },
      {
        id: 'chess-stats',
        name: 'chess-stats.live',
        type: 'file',
        icon: '♟️',
        fileType: 'txt',
        appType: 'chess-stats',
        fileContent: `Live Chess.com dashboard for mikal_jakson.

Open this file to view current ratings, records, puzzles, and account status pulled from the backend.`
      },
      {
        id: 'monkeytype-stats',
        name: 'monkeytype.live',
        type: 'file',
        icon: '⌨️',
        fileType: 'txt',
        appType: 'monkeytype-stats',
        fileContent: `Live Monkeytype dashboard.

Open this file to load a public Monkeytype profile and view live typing stats, streaks, activity, and personal bests.`
      }
    ]
  },
  trash: {
    id: 'trash',
    name: 'Trash',
    type: 'folder',
    icon: '🗑️',
    content: [
      {
        id: 'draft-manifesto',
        name: 'draft-manifesto.txt',
        type: 'file',
        icon: '📄',
        fileType: 'txt',
        fileContent: `Not ready yet. Maybe never.`
      },
      {
        id: 'old-moodboard',
        name: 'old-moodboard.md',
        type: 'file',
        icon: '📝',
        fileType: 'md',
        fileContent: `# Old Moodboard

- too polished
- not enough personality
- more texture, less template
- keep the weird parts that still feel useful`
      }
    ]
  }
};
