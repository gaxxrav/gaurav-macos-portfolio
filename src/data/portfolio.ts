import { DesktopIcon, FileSystemItem } from '../types';

export const portfolioContent = {
  about: `Hello! I'm a creative developer who loves building delightful digital experiences.

I believe in the intersection of design and engineering, where thoughtful interfaces meet robust systems. This portfolio itself is a testament to that philosophy - a fully functional operating system simulator built to showcase work in an interactive way.

When I'm not coding, you'll find me exploring new technologies, contributing to open source, or discovering hidden gems in video games.

Key Skills:
• Frontend Development (React, TypeScript, Modern CSS)
• System Design & Architecture
• UI/UX Design & Prototyping
• Creative Problem Solving`,

  values: `# Core Values

## Craft Over Speed
Quality takes time. Every detail matters, from animations to accessibility.

## Curiosity-Driven
The best solutions come from asking "what if?" and exploring the unexpected.

## Human-Centered
Technology should feel magical, not mechanical. Design for delight.

## Open & Collaborative
Share knowledge freely. We all stand on the shoulders of giants.`,

  experiences: [
    {
      id: 'exp1',
      company: 'Tech Innovations Inc',
      role: 'Senior Frontend Engineer',
      period: '2022 - Present',
      description: `Led the redesign of the company's flagship product, resulting in a 40% increase in user engagement. Built a component library used across 5+ products.

Key Achievements:
• Architected scalable React application serving 100k+ daily users
• Implemented advanced animation systems using Framer Motion
• Mentored 3 junior developers in modern frontend practices
• Reduced bundle size by 60% through strategic optimization`,
      technologies: 'React, TypeScript, Node.js, GraphQL'
    },
    {
      id: 'exp2',
      company: 'Creative Studio XYZ',
      role: 'Full Stack Developer',
      period: '2020 - 2022',
      description: `Built interactive web experiences for major brands. Collaborated with designers to push the boundaries of what's possible on the web.

Key Achievements:
• Developed award-winning interactive campaigns
• Created custom WebGL experiences for product launches
• Implemented real-time collaborative features
• Established development best practices and workflows`,
      technologies: 'React, Three.js, Node.js, MongoDB'
    },
    {
      id: 'exp3',
      company: 'Startup Labs',
      role: 'Frontend Developer',
      period: '2018 - 2020',
      description: `Joined early-stage startup to build MVP from scratch. Wore multiple hats as part of a small, agile team.

Key Achievements:
• Built entire frontend architecture from ground up
• Implemented responsive design system
• Integrated payment processing and analytics
• Contributed to product strategy and UX decisions`,
      technologies: 'Vue.js, JavaScript, REST APIs, Firebase'
    }
  ],

  projects: [
    {
      id: 'proj1',
      name: 'Quantum Dashboard',
      description: 'A real-time data visualization platform for IoT devices with custom 3D graphics engine.',
      image: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=800',
      tech: 'React, Three.js, WebSocket, D3.js',
      link: '#'
    },
    {
      id: 'proj2',
      name: 'Collaborative Canvas',
      description: 'Multi-user creative workspace with real-time collaboration and version control.',
      image: 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=800',
      tech: 'React, WebRTC, Canvas API, Node.js',
      link: '#'
    },
    {
      id: 'proj3',
      name: 'Motion Library',
      description: 'Open-source animation library for React with physics-based interactions.',
      image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800',
      tech: 'TypeScript, React, GSAP, Framer Motion',
      link: '#'
    },
    {
      id: 'proj4',
      name: 'Neural Playground',
      description: 'Interactive machine learning visualizations for educational purposes.',
      image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
      tech: 'Python, TensorFlow.js, React, D3.js',
      link: '#'
    }
  ],

  testimonials: [
    {
      id: 'test1',
      from: 'Sarah Chen',
      role: 'Product Manager @ Tech Innovations',
      subject: 'Exceptional work on dashboard redesign',
      message: `Working with them was an absolute pleasure. Their attention to detail and ability to balance aesthetics with functionality is remarkable. The new dashboard exceeded all our expectations and user feedback has been overwhelmingly positive.`,
      date: new Date('2024-02-15')
    },
    {
      id: 'test2',
      from: 'Marcus Rodriguez',
      role: 'CTO @ Creative Studio XYZ',
      subject: 'A true craftsperson',
      message: `Rare to find someone who is both deeply technical and highly creative. They consistently delivered pixel-perfect implementations while also contributing valuable ideas to the product vision. A stellar team player.`,
      date: new Date('2023-11-20')
    },
    {
      id: 'test3',
      from: 'Emily Thompson',
      role: 'Design Lead @ Startup Labs',
      subject: 'Bridge between design and engineering',
      message: `The best developer-designer partnership I've ever experienced. They understood design intent intuitively and often improved upon it with technical insights. Their code is as clean as the interfaces they build.`,
      date: new Date('2023-08-10')
    }
  ],

  easterEggs: [
    'konami',
    'matrix',
    'disco',
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
        name: 'values.md',
        type: 'file',
        icon: '📝',
        fileType: 'md',
        fileContent: portfolioContent.values
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
          id: `${proj.id}-preview`,
          name: 'preview.png',
          type: 'file' as const,
          icon: '🖼️',
          fileType: 'img' as const,
          filePath: proj.image
        },
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
        name: 'experiments.txt',
        type: 'file',
        icon: '📄',
        fileType: 'txt',
        fileContent: `# Experimental Zone

This is where I tinker with new ideas and technologies.

Try these commands in the terminal:
• minesweeper - Classic game reimagined
• matrix - Follow the white rabbit
• disco - Light show mode
• konami - Classic cheat code (↑↑↓↓←→←→BA)

Or just explore the interface - there are surprises everywhere!`
      }
    ]
  }
};
