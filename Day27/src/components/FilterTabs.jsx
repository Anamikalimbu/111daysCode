
const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'completed', label: 'Completed' },
];

function FilterTabs({ activeFilter, onFilterChange }) {
  return (
    <div className="filter-tabs" id="filter-tabs">
      {FILTERS.map((filter) => (
        <button
          key={filter.key}
          id={`filter-${filter.key}`}
          className={`filter-tabs__btn${activeFilter === filter.key ? ' filter-tabs__btn--active' : ''}`}
          onClick={() => onFilterChange(filter.key)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}

export default FilterTabs;
