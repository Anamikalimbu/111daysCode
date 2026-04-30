/* ════════════════════════════════════════════════
   Async JavaScript + Fetch API — Demo Script
   API: https://jsonplaceholder.typicode.com
   ════════════════════════════════════════════════ */

const BASE = "https://jsonplaceholder.typicode.com";

// ── Helpers ────────────────────────────────────────

/**
 * Returns a random integer between 1 and 100 (post IDs range).
 */
function randomId(max = 100) {
  return Math.floor(Math.random() * max) + 1;
}

/**
 * Sets a result box into "loading" state with a spinner message.
 * @param {string} key - matches the suffix of #result-{key}
 */
function setLoading(key) {
  const el = document.getElementById(`result-${key}`);
  el.className = "result-box loading";
  el.textContent = "⏳ Fetching…";
}

/**
 * Displays a success result (pretty-printed JSON).
 * @param {string} key
 * @param {object} data
 */
function displayResult(key, data) {
  const el = document.getElementById(`result-${key}`);
  el.className = "result-box success";
  el.textContent = JSON.stringify(data, null, 2);
}

/**
 * Displays an error message in the result box.
 * @param {string} key
 * @param {Error}  err
 */
function displayError(key, err) {
  const el = document.getElementById(`result-${key}`);
  el.className = "result-box error-state";
  el.textContent = `✖ ${err.message}`;
}


// ── 01 · Promise Chain ──────────────────────────────

/**
 * Classic .then() / .catch() promise chain.
 * Fetches a random post and displays it.
 */
function fetchWithPromise() {
  const id = randomId();
  setLoading("promise");

  fetch(`${BASE}/posts/${id}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error — status ${response.status}`);
      }
      return response.json();            // returns another Promise
    })
    .then(data => {
      displayResult("promise", data);    // resolved with parsed JSON
    })
    .catch(err => {
      displayError("promise", err);      // any error up the chain lands here
    });
}


// ── 02 · async / await ─────────────────────────────

/**
 * Modern async/await syntax.
 * Functionally identical to the Promise chain above — just cleaner.
 */
async function fetchWithAsync() {
  const id = randomId();
  setLoading("async");

  try {
    const response = await fetch(`${BASE}/posts/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP error — status ${response.status}`);
    }

    const data = await response.json();  // await the second Promise too
    displayResult("async", data);

  } catch (err) {
    displayError("async", err);          // catches both network & HTTP errors
  }
}


// ── 03 · Promise.all — parallel requests ───────────

/**
 * Fires two requests simultaneously using Promise.all().
 * Total time ≈ max(t1, t2) instead of t1 + t2.
 */
async function fetchParallel() {
  setLoading("parallel");

  try {
    // Both requests start at the same time
    const [postResponse, userResponse] = await Promise.all([
      fetch(`${BASE}/posts/1`),
      fetch(`${BASE}/users/1`)
    ]);

    // Check both responses before parsing
    if (!postResponse.ok) throw new Error(`Posts API: ${postResponse.status}`);
    if (!userResponse.ok) throw new Error(`Users API: ${userResponse.status}`);

    // Parse JSON in parallel too
    const [post, user] = await Promise.all([
      postResponse.json(),
      userResponse.json()
    ]);

    displayResult("parallel", {
      post: { id: post.id, title: post.title },
      user: { id: user.id, name: user.name, email: user.email }
    });

  } catch (err) {
    displayError("parallel", err);
  }
}


// ── 04 · Error Handling ────────────────────────────

/**
 * Intentionally requests a non-existent resource (ID 99999 → 404).
 * Demonstrates that fetch() does NOT reject on HTTP errors —
 * you must check response.ok yourself.
 */
async function fetchWithError() {
  setLoading("error");

  try {
    const response = await fetch(`${BASE}/posts/99999`);

    // ⚠️ fetch() only rejects on network failure, NOT on 4xx/5xx
    if (!response.ok) {
      throw new Error(`Resource not found — HTTP ${response.status}`);
    }

    const data = await response.json();
    displayResult("error", data);

  } catch (err) {
    // Caught! Display the error message gracefully
    displayError("error", err);
  }
}


// ── Feed: load multiple posts ───────────────────────

/**
 * Fetches N posts from the API and renders them as cards.
 * Uses AbortController for request cancellation.
 */
let feedController = null;

async function loadFeed() {
  const limitInput = document.getElementById("post-limit");
  const limit = Math.min(Math.max(parseInt(limitInput.value) || 5, 1), 20);
  const grid = document.getElementById("feed-grid");

  // Cancel any previous in-flight request
  if (feedController) feedController.abort();
  feedController = new AbortController();
  const { signal } = feedController;

  // Show skeleton placeholders
  grid.innerHTML = Array.from({ length: limit }, () => `
    <div class="post-card">
      <div class="skeleton short"></div>
      <div class="skeleton"></div>
      <div class="skeleton tall"></div>
    </div>
  `).join("");

  try {
    const response = await fetch(
      `${BASE}/posts?_limit=${limit}`,
      { signal }                          // pass AbortController signal
    );

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const posts = await response.json();

    grid.innerHTML = "";                   // clear skeletons
    posts.forEach((post, i) => {
      const card = document.createElement("div");
      card.className = "post-card";
      card.style.animationDelay = `${i * 0.06}s`;
      card.innerHTML = `
        <div class="post-id">POST #${String(post.id).padStart(3, "0")}</div>
        <div class="post-title">${post.title}</div>
        <div class="post-body">${post.body}</div>
      `;
      grid.appendChild(card);
    });

  } catch (err) {
    if (err.name === "AbortError") return; // silently ignore aborted requests
    grid.innerHTML = `<p style="color:var(--danger);font-size:0.8rem;">✖ ${err.message}</p>`;
  }
}


// ── Tab switcher ────────────────────────────────────

/**
 * Switches the visible code snippet tab.
 * @param {string} tabId   - ID of the <pre> to show
 * @param {HTMLElement} btn - the clicked .tab button
 */
function switchTab(tabId, btn) {
  // Hide all code blocks
  document.querySelectorAll(".code-block").forEach(el => el.classList.remove("active"));
  // Deactivate all tabs
  document.querySelectorAll(".tab").forEach(el => el.classList.remove("active"));

  document.getElementById(tabId).classList.add("active");
  btn.classList.add("active");
}