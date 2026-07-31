import { Link } from 'react-router-dom';
import { useTrending } from '../../hooks/useTopics';

/**
 * The one bold signature element of this design: a continuously
 * scrolling ticker strip of trending topics, echoing the wire-service /
 * stock-ticker motif that anchors the whole visual identity.
 */
export default function WireTicker() {
  const { data } = useTrending({ top_n: 10 });
  const topics = data?.trending_topics || [];

  if (topics.length === 0) return null;

  // Duplicate the list so the CSS animation (-50%) loops seamlessly.
  const looped = [...topics, ...topics];

  return (
    <div className="overflow-hidden border-b border-void-line bg-void text-paper">
      <div className="flex w-max animate-ticker items-center gap-8 whitespace-nowrap py-2 text-xs font-mono">
        {looped.map((topic, i) => (
          <Link
            key={`${topic.cluster_id}-${i}`}
            to={`/topics/${topic.cluster_id}`}
            className="flex items-center gap-2 px-2 hover:text-wire-dark"
          >
            <span className="text-wire-dark">●</span>
            <span className="font-medium">{topic.topic}</span>
            <span className="text-paper/50">{topic.articles} articles</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
