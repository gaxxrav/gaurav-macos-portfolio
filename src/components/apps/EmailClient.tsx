import { useState } from 'react';
import { Mail, Star, Archive, Inbox } from 'lucide-react';
import { portfolioContent } from '../../data/portfolio';

export const EmailClient = () => {
  const [selectedEmail, setSelectedEmail] = useState(portfolioContent.testimonials[0]);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else if (diffDays < 365) {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="h-full flex bg-gray-50">
      <div className="w-56 bg-gray-100 border-r border-gray-200 p-3">
        <div className="space-y-1">
          <button className="w-full text-left px-3 py-2 rounded-lg bg-blue-100 text-blue-700 font-medium flex items-center gap-2">
            <Inbox className="w-4 h-4" />
            Testimonials
          </button>
          <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 text-gray-600">
            <Star className="w-4 h-4" />
            Starred
          </button>
          <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 text-gray-600">
            <Archive className="w-4 h-4" />
            Archive
          </button>
        </div>
      </div>

      <div className="w-80 bg-white border-r border-gray-200 overflow-auto">
        {portfolioContent.testimonials.map(email => (
          <button
            key={email.id}
            onClick={() => setSelectedEmail(email)}
            className={`w-full text-left p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors ${
              selectedEmail.id === email.id ? 'bg-blue-50' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-1">
              <span className="font-semibold text-sm">{email.from}</span>
              <span className="text-xs text-gray-500">{formatDate(email.date)}</span>
            </div>
            <div className="text-sm text-gray-900 mb-1 font-medium truncate">
              {email.subject}
            </div>
            <div className="text-sm text-gray-600 line-clamp-2">
              {email.message}
            </div>
          </button>
        ))}
      </div>

      <div className="flex-1 bg-white overflow-auto">
        {selectedEmail && (
          <div className="p-8">
            <div className="mb-6 pb-6 border-b border-gray-200">
              <h2 className="text-2xl font-semibold mb-4">{selectedEmail.subject}</h2>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-lg">
                  {selectedEmail.from.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold">{selectedEmail.from}</div>
                  <div className="text-sm text-gray-600">{selectedEmail.role}</div>
                </div>
              </div>
              <div className="text-sm text-gray-500 mt-3">
                {selectedEmail.date.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {selectedEmail.message}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
