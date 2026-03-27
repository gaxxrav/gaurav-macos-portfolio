interface AchievementDefinition {
  id: string;
  name: string;
  description: string;
}

interface AchievementsProps {
  achievements: AchievementDefinition[];
  unlockedIds: Set<string>;
}

export const Achievements = ({ achievements, unlockedIds }: AchievementsProps) => {
  return (
    <div className="h-full bg-[var(--color-panel-bg)] text-[var(--color-text)]">
      <div className="border-b px-6 py-5 backdrop-blur-sm bg-[var(--color-panel-soft)] border-[var(--color-border)]">
        <div className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-text-subtle)]">Achievements</div>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight">Quietly earned</h2>
      </div>

      <div className="p-6">
        <div className="space-y-2 rounded-3xl border p-4 shadow-sm bg-[var(--color-panel-bg)] border-[var(--color-border)]">
          {achievements.map((achievement) => {
            const unlocked = unlockedIds.has(achievement.id);

            return (
              <div
                key={achievement.id}
                className={`flex items-start gap-3 rounded-2xl px-4 py-3 transition-colors ${
                  unlocked ? 'text-[var(--color-text)]' : 'text-[var(--color-text-muted)]'
                }`}
                style={{ backgroundColor: unlocked ? 'var(--color-accent-soft)' : 'var(--color-panel-soft)' }}
              >
                <span className="pt-0.5 text-base" style={{ color: unlocked ? 'var(--color-accent)' : 'var(--color-text-subtle)' }}>
                  {unlocked ? '✓' : '•'}
                </span>
                <div className="min-w-0">
                  <div className={unlocked ? 'text-sm font-medium' : 'text-sm font-medium opacity-90'}>
                    {achievement.name}
                  </div>
                  <div className="mt-1 text-xs" style={{ color: unlocked ? 'var(--color-text-muted)' : 'var(--color-text-subtle)' }}>
                    {unlocked ? achievement.description : '???'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
