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
    <div className="h-full bg-gray-100 flex flex-col">
      <div className="bg-gray-800 text-white p-3 flex items-center justify-between">
        <span className="text-sm font-medium">cv.pdf</span>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded transition-colors text-sm"
        >
          <Download className="w-4 h-4" />
          Download
        </button>
      </div>
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-4xl mx-auto bg-white shadow-lg p-12">
          <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
            {cvContent}
          </pre>
        </div>
      </div>
    </div>
  );
};
