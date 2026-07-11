import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

import Navbar from "./components/Navbar.jsx";
import PredictionForm from "./components/PredictionForm.jsx";
import PredictionCard from "./components/PredictionCard.jsx";
import HistoryTable from "./components/HistoryTable.jsx";
import Toast from "./components/Toast.jsx";

// The Vite dev server proxies /predict -> http://localhost:5000/predict (see vite.config.js)
const API_URL = "/predict";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [applicant, setApplicant] = useState(null);
  const [history, setHistory] = useState([]);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  const handlePredict = async (payload) => {
    setLoading(true);
    setResult(null);
    try {
      const response = await axios.post(API_URL, payload);
      const data = response.data;

      setResult(data);
      setApplicant(payload);
      setHistory((prev) => [
        { id: Date.now(), ...payload, ...data },
        ...prev,
      ]);
    } catch (error) {
      const message =
        error?.response?.data?.error ||
        "Something went wrong while predicting. Please make sure the backend server is running.";
      setToastMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-gradient-to-br from-brand-50 via-white to-brand-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-800 dark:text-slate-100">
      {/* Decorative background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-brand-300/40 dark:bg-brand-800/20 rounded-full blur-3xl animate-floatSlow" />
        <div className="absolute top-1/3 -right-24 w-96 h-96 bg-brand-400/30 dark:bg-brand-700/10 rounded-full blur-3xl animate-floatSlow" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-brand-200/40 dark:bg-brand-900/20 rounded-full blur-3xl animate-floatSlow" />
      </div>

      <Toast message={toastMessage} onClose={() => setToastMessage("")} />

      <div className="relative z-10">
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10 sm:mb-14"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-brand-900 dark:text-white">
              Loan Approval{" "}
              <span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">
                Prediction System
              </span>
            </h1>
            <p className="mt-4 text-slate-500 dark:text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
              Predict whether a new applicant will be approved using Machine Learning.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <PredictionForm onPredict={handlePredict} loading={loading} />

            {result ? (
              <PredictionCard result={result} applicant={applicant} />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="glass-card shadow-glass rounded-3xl p-10 w-full h-full flex flex-col items-center justify-center text-center min-h-[320px]"
              >
                <div className="w-16 h-16 rounded-full bg-brand-50 dark:bg-slate-800 flex items-center justify-center mb-4">
                  <span className="text-3xl">📊</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 max-w-xs">
                  Fill in the applicant details and click{" "}
                  <span className="font-semibold text-brand-600 dark:text-brand-300">
                    Predict
                  </span>{" "}
                  to see the result here.
                </p>
              </motion.div>
            )}
          </div>

          <HistoryTable history={history} />
        </main>

        <footer className="text-center py-8 text-sm text-slate-400 dark:text-slate-500">
          Developed using React + Flask + Logistic Regression
        </footer>
      </div>
    </div>
  );
}
