import React from "react";
import { motion } from "framer-motion";
import { FiClock, FiCheckCircle, FiXCircle } from "react-icons/fi";

export default function HistoryTable({ history }) {
  if (!history || history.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card shadow-glass rounded-3xl p-6 sm:p-8 w-full mt-8"
    >
      <div className="flex items-center gap-2 mb-5">
        <FiClock className="text-brand-500" size={20} />
        <h2 className="text-xl font-bold text-brand-900 dark:text-white">
          Prediction History
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
              <th className="py-2 pr-4 font-semibold">#</th>
              <th className="py-2 pr-4 font-semibold">Age</th>
              <th className="py-2 pr-4 font-semibold">Income</th>
              <th className="py-2 pr-4 font-semibold">Credit</th>
              <th className="py-2 pr-4 font-semibold">Loan</th>
              <th className="py-2 pr-4 font-semibold">Emp. Yrs</th>
              <th className="py-2 pr-4 font-semibold">Probability</th>
              <th className="py-2 pr-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {history.map((row, idx) => (
              <tr
                key={row.id}
                className="border-b border-slate-100 dark:border-slate-800 hover:bg-brand-50/50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <td className="py-2.5 pr-4 text-slate-400">{history.length - idx}</td>
                <td className="py-2.5 pr-4 text-slate-700 dark:text-slate-200">{row.Age}</td>
                <td className="py-2.5 pr-4 text-slate-700 dark:text-slate-200">
                  ${row.Annual_Income.toLocaleString()}
                </td>
                <td className="py-2.5 pr-4 text-slate-700 dark:text-slate-200">{row.Credit_Score}</td>
                <td className="py-2.5 pr-4 text-slate-700 dark:text-slate-200">
                  ${row.Loan_Amount.toLocaleString()}
                </td>
                <td className="py-2.5 pr-4 text-slate-700 dark:text-slate-200">{row.Employment_Years}</td>
                <td className="py-2.5 pr-4 font-semibold text-brand-600 dark:text-brand-300">
                  {Math.round(row.probability * 100)}%
                </td>
                <td className="py-2.5 pr-4">
                  {row.prediction === 1 ? (
                    <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                      <FiCheckCircle size={14} /> Approved
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-red-500 dark:text-red-400 font-semibold">
                      <FiXCircle size={14} /> Denied
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
