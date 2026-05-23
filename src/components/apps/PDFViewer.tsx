import { Download } from 'lucide-react';
import { portfolioContent } from '../../data/portfolio';

const CONTACT = {
  name: 'GAURAV MURALI',
  email: 'gaurav.murali3@gmail.com',
  phone: '+91 7026878784',
  location: 'Bengaluru, Karnataka',
  github: 'https://github.com/gaxxrav',
  linkedIn: 'https://www.linkedin.com/in/gaurav-murali-9098bb258/',
  leetCode: 'https://leetcode.com/u/gaxxrav/'
};

const RESUME_HEADINGS = new Set([
  'Resume Snapshot',
  'Education',
  'Certifications',
  'Languages',
  'Backend & APIs',
  'Frameworks & Platforms',
  'Databases',
  'DevOps & Cloud',
  'AI & Machine Learning',
  'Software Engineering & Methodologies'
]);

const parseResumeSections = (content: string) => {
  const sections: Record<string, string[]> = {};
  let currentSection: string | null = null;

  content
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .forEach(line => {
      if (RESUME_HEADINGS.has(line)) {
        currentSection = line;
        sections[currentSection] = [];
        return;
      }

      if (currentSection) {
        sections[currentSection].push(line);
      }
    });

  return sections;
};

const cleanListItem = (line: string) => line.replace(/^[-•>]\s*/, '').trim();

const takeContributionBullets = (description: string, count = 3) =>
  description
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.startsWith('•'))
    .map(cleanListItem)
    .slice(0, count);

const resumeSections = parseResumeSections(portfolioContent.values);
const educationLines = (resumeSections['Education'] || []).map(cleanListItem);
const certificationLines = (resumeSections['Certifications'] || []).map(cleanListItem);
const skillSections = [
  'Languages',
  'Backend & APIs',
  'Frameworks & Platforms',
  'Databases',
  'DevOps & Cloud',
  'AI & Machine Learning',
  'Software Engineering & Methodologies'
]
  .map(sectionName => {
    const lines = (resumeSections[sectionName] || []).map(cleanListItem);
    return lines.length ? `${sectionName}: ${lines.join(', ')}` : null;
  })
  .filter(Boolean) as string[];

const cvContent = `
${CONTACT.name}
${CONTACT.email} | ${CONTACT.phone} | ${CONTACT.location}
GitHub: ${CONTACT.github}
LinkedIn: ${CONTACT.linkedIn}
LeetCode: ${CONTACT.leetCode}

SUMMARY
Computer Science undergraduate focused on backend systems, AI-powered products, and full-stack development.
Built production APIs, multi-tenant platforms, and computer vision projects with measurable performance gains.

EXPERIENCE

${portfolioContent.experiences
  .map(
    exp => `${exp.role} | ${exp.company}
${exp.period}
${takeContributionBullets(exp.description)
  .map(point => `• ${point}`)
  .join('\n')}
Tech: ${exp.technologies}`
  )
  .join('\n\n')}

SKILLS

${skillSections.join('\n')}

EDUCATION

${educationLines.join('\n')}

CERTIFICATIONS

${certificationLines.map(item => `• ${item}`).join('\n')}

PROJECTS

${portfolioContent.projects
  .map(
    project => `• ${project.name}
  ${project.description}
  Tech: ${project.tech}`
  )
  .join('\n\n')}

ACHIEVEMENTS

${portfolioContent.testimonials
  .map(testimonial => `• ${testimonial.subject}`)
  .join('\n')}
`;

export const PDFViewer = () => {
  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = '/resume.pdf';
    a.download = 'resume.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
