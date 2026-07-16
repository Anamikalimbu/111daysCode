# Day 94 · Counter App

A small React + Vite project built to practice `useState` before moving
deeper into Phase 7's backend-focused MERN work.

## What it teaches

- Declaring state with `useState` and reading/updating it through its setter.
- Using the functional updater form (`prev => prev + step`) so updates are
  always based on the latest value.
- Managing more than one independent piece of state in the same component
  (`count` and `step`).
- Deriving UI (the padded digit display, the negative sign) from state
  instead of storing it separately.

## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL in your browser.

## Project structure

```
counter-app/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx          # React entry point
    ├── App.jsx           # App shell
    ├── App.css
    ├── index.css         # global reset + font
    └── components/
        ├── Counter.jsx   # the useState logic lives here
        └── Counter.css
```

## Try extending it

- Add keyboard shortcuts (↑ to increment, ↓ to decrement).
- Persist `count` to `localStorage` so it survives a refresh.
- Add a history list of past values using an array in state.
