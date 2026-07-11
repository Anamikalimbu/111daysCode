import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FiUser,
  FiDollarSign,
  FiTrendingUp,
  FiHome,
  FiBriefcase,
  FiSearch,
  FiRefreshCw,
} from "react-icons/fi";

const initialForm = {
  Age: "",
  Annual_Income: "",
  Credit_Score: "",
  Loan_Amount: "",
  Employment_Years: "",
};

const fieldConfig = [
  {
    name: "Age",
    label: "Age",
    icon: FiUser,
    placeholder: "e.g. 35",
    hint: "Must be greater than 18",
  },
  {
    name: "Annual_Income",
    label: "Annual Income ($)",
    icon: FiDollarSign,
    placeholder: "e.g. 65000",
    hint: "Yearly income in USD",
  },
  {
    name: "Credit_Score",
    label: "Credit Score",
    icon: FiTrendingUp,
    placeholder: "e.g. 720",
    hint: "Between 300 and 850",
  },
  {
    name: "Loan_Amount",
    label: "Loan Amount ($)",
    icon: FiHome,
    placeholder: "e.g. 20000",
    hint: "Requested loan amount",
  },
  {
    name: "Employment_Years",
    label: "Employment Years",
    icon: FiBriefcase,
    placeholder: "e.g. 5",
    hint: "Years at current job",
  },
];

export default function PredictionForm({ onPredict, loading }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const newErrors = {};

    fieldConfig.forEach(({ name, label }) => {
      const value = form[name];
      if (value === "" || value === null || value === undefined) {
        newErrors[name] = `${label} is required.`;
      }
    });

    if (form.Age !== "" && Number(form.Age) <= 18) {
      newErrors.Age = "Age must be greater than 18.";
    }

    if (
      form.Credit_Score !== "" &&
      (Number(form.Credit_Score) < 300 || Number(form.Credit_Score) > 850)
    ) {
      newErrors.Credit_Score = "Credit score must be between 300 and 850.";
    }

    if (form.Annual_Income !== "" && Number(form.Annual_Income) < 0) {
      newErrors.Annual_Income = "Annual income cannot be negative.";
    }

    if (form.Loan_Amount !== "" && Number(form.Loan_Amount) < 0) {
      newErrors.Loan_Amount = "Loan amount cannot be negative.";
    }

    if (form.Employment_Years !== "" && Number(form.Employment_Years) < 0) {
      newErrors.Employment_Years = "Employment years cannot be negative.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      Age: Number(form.Age),
      Annual_Income: Number(form.Annual_Income),
      Credit_Score: Number(form.Credit_Score),
      Loan_Amount: Number(form.Loan_Amount),
      Employment_Years: Number(form.Employment_Years),
    };

    onPredict(payload);
  };

  const handleReset = () => {
    setForm(initialForm);
    setErrors({});
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass-card shadow-glass rounded-3xl p-6 sm:p-8 w-full"
    >
      <h2 className="text-xl font-bold text-brand-900 dark:text-white mb-6">
        Applicant Information
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {fieldConfig.map(({ name, label, icon: Icon, placeholder, hint }) => (
          <div key={name} className="flex flex-col gap-1.5">
            <label
              htmlFor={name}
              className="text-sm font-semibold text-slate-700 dark:text-slate-200"
            >
              {label}
            </label>
            <div
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border bg-white/80 dark:bg-slate-800/70 transition-colors ${
                errors[name]
                  ? "border-red-400 focus-within:ring-2 focus-within:ring-red-300"
                  : "border-slate-200 dark:border-slate-600 focus-within:ring-2 focus-within:ring-brand-300"
              }`}
            >
              <Icon
                className={errors[name] ? "text-red-400" : "text-brand-500"}
                size={18}
              />
              <input
                id={name}
                name={name}
                type="number"
                value={form[name]}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full bg-transparent outline-none text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
              />
            </div>
            {errors[name] ? (
              <span className="text-xs text-red-500 font-medium">
                {errors[name]}
              </span>
            ) : (
              <span className="text-xs text-slate-400 dark:text-slate-500">
                {hint}
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-8">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-brand-500 to-brand-700 hover:from-brand-600 hover:to-brand-800 text-white font-semibold py-3 rounded-xl shadow-lg shadow-brand-500/30 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Predicting...
            </>
          ) : (
            <>
              <FiSearch size={18} />
              Predict
            </>
          )}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          type="button"
          onClick={handleReset}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 bg-white/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold py-3 rounded-xl transition-all"
        >
          <FiRefreshCw size={18} />
          Reset
        </motion.button>
      </div>
    </motion.form>
  );
}
