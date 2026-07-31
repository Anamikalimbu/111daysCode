import { motion } from 'framer-motion';
import TopicCard from '../components/Cards/TopicCard';
import EmptyState from '../components/Common/EmptyState';
import ErrorState from '../components/Common/ErrorState';
import { NewsCardSkeleton } from '../components/Common/Skeleton';
import { useTopics } from '../hooks/useTopics';

export default function Topics() {
  const { data: topics, isLoading, isError, refetch } = useTopics();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Topics</h1>
        <p className="text-sm text-ink-soft dark:text-paper/50">
          Every story cluster the AI has discovered, grouped automatically
          from article content.
        </p>
      </div>

      {isError ? (
        <ErrorState onRetry={refetch} />
      ) : isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <NewsCardSkeleton key={i} />
          ))}
        </div>
      ) : !topics || topics.length === 0 ? (
        <EmptyState
          title="No topics yet"
          message="Run the clustering pipeline on the backend to discover topics."
        />
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.04 } },
          }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {topics.map((topic) => (
            <motion.div
              key={topic.cluster_id}
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <TopicCard topic={topic} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
