import React from "react";
import { CheckCircle2 } from "lucide-react";

export function ValidatePotentialIncomeButton({ onValidate }: { onValidate: () => Promise<void> }) {
  const [loading, setLoading] = React.useState(false);
  return (
    <button
      type="button"
      className={`flex items-center gap-1 mt-1 px-3 py-1 rounded-full bg-green-500 hover:bg-green-600 text-white text-xs font-semibold shadow transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed`}
      onClick={async () => {
        setLoading(true);
        await onValidate();
        setLoading(false);
      }}
      disabled={loading}
      title="Valider ce revenu potentiel"
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4 mr-1" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      ) : (
        <CheckCircle2 className="h-4 w-4 mr-1" />
      )}
      Valider
    </button>
  );
}
