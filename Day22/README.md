# Day 22: React `useEffect` Hook (Deep Dive)

Today's focus is mastering `useEffect`, one of the most crucial and powerful Hooks in React.

## 🔍 Concepts to Learn

### 1. What is `useEffect`?
`useEffect` is a React Hook that allows you to perform side effects in functional components. A "side effect" is anything that affects something outside the scope of the function being executed (e.g., fetching data, directly updating the DOM, setting up subscriptions, or timers). In class-based components, these were typically handled in lifecycle methods like `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount`. `useEffect` unifies all these into a single API.

### 2. Why do we need `useEffect`?
React components are supposed to be pure functions: given the same inputs (props and state), they should always render the same output. They shouldn't have hidden side effects during the rendering phase.
We need `useEffect` to safely step out of the pure React rendering cycle and interact with the outside world, ensuring these interactions happen *after* the render is committed to the screen, preventing blocking the UI.

### 3. Types of effects based on the Dependency Array

The dependency array (the second argument to `useEffect`) dictates *when* the effect should re-run.

#### A. Without dependency array → Runs on every render
If you omit the dependency array entirely, the effect will run after the initial render AND after every subsequent re-render of the component.
```javascript
useEffect(() => {
  // This runs after every render
  console.log("Component rendered or updated!");
});
```
*Use case:* Rarely used. Can lead to infinite loops if you update state inside it without conditions.

#### B. Empty dependency array `[]` → Runs once (on mount)
If you pass an empty array, the effect will only run once after the initial render. It behaves like `componentDidMount`.
```javascript
useEffect(() => {
  // This runs only once when the component mounts
  console.log("Component mounted!");
  fetchData();
}, []); // Empty array!
```
*Use case:* Initial data fetching, setting up one-time subscriptions, initializing third-party libraries.

#### C. With specific dependencies `[var1, var2]` → Runs when a variable changes
If you pass variables inside the array, the effect will run on the initial render, and then again *only* if any of the specified variables have changed since the last render.
```javascript
const [count, setCount] = useState(0);

useEffect(() => {
  // This runs on mount AND whenever 'count' changes
  document.title = `You clicked ${count} times`;
}, [count]); // Dependency array with 'count'
```
*Use case:* Re-fetching data when an ID changes, syncing state with local storage, reacting to prop changes.

### 4. Cleanup Function (`return` inside `useEffect`)
Some effects require cleanup to prevent memory leaks, such as clearing timers, unsubscribing from websockets, or removing event listeners. You can return a function from your `useEffect` callback to handle this.
React runs the cleanup function:
1. Before the component unmounts (like `componentWillUnmount`).
2. Before re-running the effect on subsequent renders (if dependencies changed).

```javascript
useEffect(() => {
  const timerId = setInterval(() => {
    console.log("Tick");
  }, 1000);

  // Cleanup function
  return () => {
    clearInterval(timerId); // Clear the interval before unmount or next run
    console.log("Cleanup ran!");
  };
}, []);
```

### 5. Common Mistakes to Avoid

*   **Missing Dependencies:** Leaving variables out of the dependency array that are used inside the effect. This leads to the effect using stale closures (old values). Always include all reactive values (props, state, and functions derived from them) used in the effect. Use the `eslint-plugin-react-hooks` exhaustive-deps rule to help catch this.
*   **Infinite Loops:** Updating a state variable inside an effect without a proper dependency array or condition. If an effect runs on every render and updates state, the state update triggers a re-render, which triggers the effect, creating an infinite loop.
*   **Overusing `useEffect`:** Not everything needs an effect. If you can calculate a value during render based on existing state or props, do it directly instead of using an effect to set another state variable. Similarly, handle user actions (like clicks) in event handlers, not in `useEffect`.
*   **Functions as Dependencies:** If you define a function outside the `useEffect` but inside the component, it gets re-created on every render. If you add it to the dependency array, it will trigger the effect on every render. Solution: Move the function inside the `useEffect`, or wrap it in `useCallback`.
