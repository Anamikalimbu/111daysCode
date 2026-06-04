export default function CodeBlock({ code, highlight = [] }) {
  const lines = code.split("\n");
  return (
    <div className="code-block">
      <div className="code-header">
        <span className="dot red" />
        <span className="dot yellow" />
        <span className="dot green" />
        <span className="code-label">JavaScript</span>
      </div>
      <pre>
        {lines.map((line, i) => {
          const isHighlighted = highlight.some((kw) => line.includes(kw));
          return (
            <div key={i} className={`code-line ${isHighlighted ? "hl" : ""}`}>
              <span className="ln">{i + 1}</span>
              <span>{line}</span>
            </div>
          );
        })}
      </pre>
    </div>
  );
}