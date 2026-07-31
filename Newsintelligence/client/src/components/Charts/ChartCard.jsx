import { motion } from 'framer-motion';

export default function ChartCard({ title, subtitle, children, className = '' }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4 }}
      className={`rounded-2xl border border-void-line bg-white p-5 dark:bg-void-raised ${className}`}
    >
      <div className="mb-4">
        <h3 className="font-display text-base font-semibold">{title}</h3>
        {subtitle && (
          <p className="text-xs text-ink-soft dark:text-paper/50">{subtitle}</p>
        )}
      </div>
      {children}
    </motion.section>
  );
}
