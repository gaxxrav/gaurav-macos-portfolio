import { Download } from 'lucide-react';

export const PDFViewer = () => {
  const cvContent = `
GAURAV MURALI
gaurav.murali3@gmail.com | +91 7026878784 | Bengaluru, Karnataka
GitHub: https://github.com/gaxxrav
LinkedIn: https://www.linkedin.com/in/gaurav-murali-9098bb258/
LeetCode: https://leetcode.com/u/gaxxrav/

SUMMARY
Computer Science undergraduate focused on backend systems, AI-powered products, and full-stack development.
Experience spans production APIs, computer vision workflows, and practical product engineering with measurable outcomes.

EXPERIENCE

Associate Software Developer Trainee | Greenway Health
6 months
• Contributed in a professional product engineering environment with implementation, debugging, and testing support
• Strengthened backend development and delivery workflow fundamentals

Backend Developer Intern | HappyFox
2 months
• Built a modular multi-tenant University Widget integrated across HappyFox products
• Improved API response times by 40% and reduced queries by 60% through caching, query tuning, selective prefetching, and pagination
• Delivered secure APIs with authorization, rate limiting, and custom request headers
• Supported CI/CD, containerization, automated migrations, and high test coverage

Full Stack Developer Intern | Mphasis
3 months
• Built a meeting notes application with speech-to-text, authentication, notes, and notification management
• Contributed to testing and debugging across unit, integration, and user validation flows

Backend Developer Intern | LSSgoBikes
2 months
• Worked on backend modules for a bike rental platform using Mongo Cloud database services

SKILLS

Languages: C++, Python, JavaScript, HTML, CSS, SQL
Backend and APIs: REST API Design, Server-side Architecture, JWT, OAuth
Libraries and Tools: React, Node.js, Bootstrap, OpenCV, MediaPipe, Docker, Swagger, Postman, Vercel
Frameworks: Django, Wagtail, TensorFlow, Material UI, Godot
Databases: PostgreSQL, MongoDB, MySQL, SQLite
Other: DSA, SDLC, Microservices Fundamentals, Technical Documentation, SIT, UAT

EDUCATION

Bachelor of Engineering in Computer Science and Engineering
BMS Institute of Technology, Bangalore
CGPA: 8.7/10

National Public School, Yelahanka
Percentage: 96%

CERTIFICATIONS

• CS50's Web Programming with Python and JavaScript
• CS50's Introduction to Artificial Intelligence with Python
• Machine Learning Specialization by DeepLearning.AI and Stanford University

PROJECTS

• AI-Powered ISL Translation System
  Real-time Indian Sign Language translator with gesture training and multilingual audio output
  Achieved 1.2s average response time and 90% accuracy in controlled environments

• AI Driven Food and Product Insights Platform
  Barcode-based analysis with webcam scanning, nutritional insights, and AI-powered ingredient review
  Reduced manual lookup time by roughly 80%

• Pluggable University Widget for HappyFox
  Multi-tenant widget and content platform with secure APIs, role-based delivery, search, and caching

ACHIEVEMENTS

• Winner, IEEE GitHub Workshop Contest at BMSIT
• Shortlisted for the external hackathon round at Smart India Hackathon 2024
  `;

  const handleDownload = () => {
    const blob = new Blob([cvContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gaurav-murali-cv.txt';
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
