import { TOPICS } from '../data/topics';

interface TopicBadgeProps {
  topicId: string;
  size?: 'sm' | 'md';
}

export function TopicBadge({ topicId, size = 'sm' }: TopicBadgeProps) {
  const topic = TOPICS.find((t) => t.id === topicId);
  if (!topic) return null;

  const px = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span
      className={`inline-flex items-center rounded-full font-mono font-medium ${px}`}
      style={{
        background: `${topic.color}22`,
        color: topic.color,
        border: `1px solid ${topic.color}44`,
      }}
    >
      {topic.title}
    </span>
  );
}
