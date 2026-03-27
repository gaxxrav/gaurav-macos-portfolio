import { useState } from 'react';
import { Star, Archive, Inbox } from 'lucide-react';
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
    <div className="flex h-full bg-[var(--color-panel-bg)] text-[var(--color-text)]">
      <div className="w-56 border-r p-3 bg-[var(--color-panel-soft)] border-[var(--color-border)]">
        <div className="space-y-1">
          <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left font-medium bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
            <Inbox className="w-4 h-4" />
            Testimonials
          </button>
          <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left transition-colors hover:bg-[var(--color-accent-soft)] text-[var(--color-text-muted)]">
            <Star className="w-4 h-4" />
            Starred
          </button>
          <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left transition-colors hover:bg-[var(--color-accent-soft)] text-[var(--color-text-muted)]">
            <Archive className="w-4 h-4" />
            Archive
          </button>
        </div>
      </div>

      <div className="w-80 overflow-auto border-r bg-[var(--color-panel-bg)] border-[var(--color-border)]">
        {portfolioContent.testimonials.map(email => (
          <button
            key={email.id}
            onClick={() => setSelectedEmail(email)}
            className={`w-full border-b p-4 text-left transition-colors border-[var(--color-border)] hover:bg-[var(--color-accent-soft)] ${
              selectedEmail.id === email.id ? 'bg-[var(--color-accent-soft)]' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-1">
              <span className="font-semibold text-sm">{email.from}</span>
              <span className="text-xs text-[var(--color-text-subtle)]">{formatDate(email.date)}</span>
            </div>
            <div className="mb-1 truncate text-sm font-medium text-[var(--color-text)]">
              {email.subject}
            </div>
            <div className="line-clamp-2 text-sm text-[var(--color-text-muted)]">
              {email.message}
            </div>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto bg-[var(--color-panel-bg)]">
        {selectedEmail && (
          <div className="p-8">
            <div className="mb-6 border-b pb-6 border-[var(--color-border)]">
              <h2 className="text-2xl font-semibold mb-4">{selectedEmail.subject}</h2>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-semibold text-white" style={{ background: 'linear-gradient(135deg, var(--color-accent), var(--color-window-title))' }}>
                  {selectedEmail.from.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold">{selectedEmail.from}</div>
                  <div className="text-sm text-[var(--color-text-muted)]">{selectedEmail.role}</div>
                </div>
              </div>
              <div className="mt-3 text-sm text-[var(--color-text-subtle)]">
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
            <div className="max-w-none">
              <p className="whitespace-pre-wrap leading-relaxed text-[var(--color-text)]">
                {selectedEmail.message}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
