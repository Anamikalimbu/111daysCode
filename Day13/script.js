document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchBar = document.querySelector('.search-bar');
    const searchForm = document.getElementById('search-form');
    const luckyBtn = document.getElementById('lucky-btn');

    // Add focus styling to the search bar wrapper
    searchInput.addEventListener('focus', () => {
        searchBar.classList.add('focused');
    });

    searchInput.addEventListener('blur', () => {
        searchBar.classList.remove('focused');
    });

    // Handle standard search submission
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
            // Redirect to Google search
            window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        }
    });

    // Handle "I'm Feeling Lucky" button
    luckyBtn.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            // "I'm Feeling Lucky" typically directs to the first result
            // For a clone, we can just use the standard search but append 'btnI'
            window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}&btnI=1`;
        } else {
            // If empty, redirect to Google Doodles
            window.location.href = 'https://doodles.google/';
        }
    });

    // Keep focus on input for the Google feel
    document.addEventListener('keydown', (e) => {
        // If they press a key that isn't a special key, focus the input
        if (e.key.length === 1 && document.activeElement !== searchInput) {
            searchInput.focus();
        }
    });
});
