import { Download } from 'lucide-react';

export const PDFViewer = () => {
  const cvContent = `
CREATIVE DEVELOPER

SUMMARY
Passionate developer with expertise in building delightful digital experiences.
Specialized in frontend development, system design, and creative problem-solving.

EXPERIENCE

Senior Frontend Engineer | Tech Innovations Inc
2022 - Present
• Led redesign of flagship product, increasing user engagement by 40%
• Built component library used across 5+ products
• Architected scalable React application serving 100k+ daily users
• Mentored 3 junior developers in modern frontend practices

Full Stack Developer | Creative Studio XYZ
2020 - 2022
• Developed award-winning interactive campaigns for major brands
• Created custom WebGL experiences for product launches
• Implemented real-time collaborative features
• Established development best practices and workflows

Frontend Developer | Startup Labs
2018 - 2020
• Built entire frontend architecture from ground up
• Implemented responsive design system
• Integrated payment processing and analytics
• Contributed to product strategy and UX decisions

SKILLS

Frontend: React, TypeScript, Modern CSS, Next.js
Backend: Node.js, GraphQL, REST APIs
Tools: Git, Webpack, Vite, Docker
Design: Figma, Adobe Creative Suite
Other: Three.js, WebGL, Canvas API, Animation Libraries

EDUCATION

Bachelor of Science in Computer Science
University of Technology, 2018

PROJECTS

• Quantum Dashboard - Real-time data visualization platform with custom 3D engine
• Collaborative Canvas - Multi-user creative workspace with real-time features
• Motion Library - Open-source animation library for React
• Neural Playground - Interactive ML visualizations for education
  `;

  const handleDownload = () => {
    const blob = new Blob([cvContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cv.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-full flex-col bg-[var(--color-panel-soft)] text-[var(--color-text)]">
      <div className="flex items-center justify-between p-3 bg-[var(--color-window-header)] text-[var(--color-window-title)]">
        <span className="text-sm font-medium">cv.pdf</span>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 rounded px-3 py-1.5 text-sm text-white transition-colors"
          style={{ backgroundColor: 'var(--color-accent)' }}
        >
          <Download className="w-4 h-4" />
          Download
        </button>
      </div>
      <div className="flex-1 overflow-auto p-8">
        <div className="mx-auto max-w-4xl p-12 shadow-lg bg-[var(--color-panel-bg)] text-[var(--color-text)]">
          <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
            {cvContent}
          </pre>
        </div>
      </div>
    </div>
  );
};
