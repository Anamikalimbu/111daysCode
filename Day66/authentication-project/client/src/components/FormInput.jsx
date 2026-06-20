export default function FormInput({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  rightElement = null,
}) {
  return (
    <div className="w-full">
      <label htmlFor={name} className="block text-sm font-medium text-slate-300 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full rounded-lg bg-ink-800 border px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-colors focus:ring-2 focus:ring-teal-500/60 ${
            error ? "border-danger" : "border-ink-700 focus:border-teal-500"
          }`}
        />
        {rightElement && (
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2">{rightElement}</div>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
    </div>
  );
}
