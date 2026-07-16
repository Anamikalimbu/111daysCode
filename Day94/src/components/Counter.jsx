import { useState } from "react";
import "./Counter.css";

const STEP_OPTIONS = [1, 5, 10];

function Counter() {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);

  const increment = () => setCount((prev) => prev + step);
  const decrement = () => setCount((prev) => prev - step);
  const reset = () => setCount(0);

  const isNegative = count < 0;
  const digits = String(Math.abs(count)).padStart(5, "0");

  return (
    <section className="counter" aria-label="Counter">
      <p className="counter__plate">useState Counter</p>

      <div className="counter__window">
        {isNegative && <span className="counter__sign">−</span>}
        <span className="counter__digits">{digits}</span>
      </div>

      <div className="counter__steps" role="group" aria-label="Step size">
        <span className="counter__steps-label">step</span>
        {STEP_OPTIONS.map((s) => (
          <button
            key={s}
            type="button"
            className={`counter__step-btn${step === s ? " is-active" : ""}`}
            onClick={() => setStep(s)}
            aria-pressed={step === s}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="counter__controls">
        <button
          type="button"
          className="counter__lever counter__lever--coral"
          onClick={decrement}
        >
          − {step}
        </button>
        <button type="button" className="counter__reset" onClick={reset}>
          reset
        </button>
        <button
          type="button"
          className="counter__lever counter__lever--mint"
          onClick={increment}
        >
          + {step}
        </button>
      </div>
    </section>
  );
}

export default Counter;
