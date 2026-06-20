import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import LoadingSpinner from "../components/LoadingSpinner";
import Alert from "../components/Alert";
import * as authService from "../services/authService";

export default function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      try {
        const data = await authService.verifyEmail(token);
        if (isMounted) {
          setStatus("success");
          setMessage(data.message);
        }
      } catch (err) {
        if (isMounted) {
          setStatus("error");
          setMessage(err.response?.data?.message || "Verification failed. The link may have expired.");
        }
      }
    };

    run();
    return () => {
      isMounted = false;
    };
  }, [token]);

  return (
    <AuthLayout eyebrow="Email verification" title="Confirming your email">
      <div className="space-y-5">
        {status === "loading" && (
          <div className="flex flex-col items-center gap-3 py-4">
            <LoadingSpinner size="lg" label="Verifying" />
            <p className="text-sm text-slate-400">Verifying your link…</p>
          </div>
        )}

        {status === "success" && (
          <>
            <Alert type="success" message={message} />
            <Link
              to="/login"
              className="block w-full rounded-lg bg-teal-500 py-2.5 text-center text-sm font-semibold text-ink-950 hover:bg-teal-400 transition-colors"
            >
              Continue to log in
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <Alert type="error" message={message} />
            <Link
              to="/login"
              className="block w-full rounded-lg border border-ink-700 py-2.5 text-center text-sm font-medium text-slate-300 hover:border-teal-500 hover:text-teal-400 transition-colors"
            >
              Back to log in
            </Link>
          </>
        )}
      </div>
    </AuthLayout>
  );
}
