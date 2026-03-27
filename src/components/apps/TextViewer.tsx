interface TextViewerProps {
  content: string;
  fileType?: 'txt' | 'md';
}

export const TextViewer = ({ content, fileType = 'txt' }: TextViewerProps) => {
  const isMarkdown = fileType === 'md';

  const renderMarkdown = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('# ')) {
        return <h1 key={i} className="text-3xl font-bold mt-6 mb-4">{line.slice(2)}</h1>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={i} className="text-2xl font-semibold mt-5 mb-3">{line.slice(3)}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={i} className="text-xl font-semibold mt-4 mb-2">{line.slice(4)}</h3>;
      }
      if (line.startsWith('• ')) {
        return <li key={i} className="ml-6 mb-1">{line.slice(2)}</li>;
      }
      if (line.trim() === '') {
        return <div key={i} className="h-4" />;
      }
      return <p key={i} className="mb-2 leading-relaxed">{line}</p>;
    });
  };

  return (
    <div className="h-full bg-white p-8 overflow-auto">
      <div className="max-w-3xl mx-auto">
        {isMarkdown ? (
          <div className="prose prose-gray">{renderMarkdown(content)}</div>
        ) : (
          <pre className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed">
            {content}
          </pre>
        )}
      </div>
    </div>
  );
};
