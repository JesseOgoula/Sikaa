import { useState } from "react";
import { supabase } from "../integrations/supabase/client";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    } else {
      window.location.href = "/";
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full">
      <h2 className="text-2xl font-extrabold text-center text-orange-500 mb-2 tracking-tight">Connexion</h2>
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Adresse email</label>
        <input
          id="email"
          type="email"
          placeholder="Entrez votre email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 transition"
          autoComplete="email"
          required
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
        <input
          id="password"
          type="password"
          placeholder="Votre mot de passe"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 transition"
          autoComplete="current-password"
          required
        />
      </div>
      {error && <div className="text-red-500 text-center font-medium bg-red-50 border border-red-200 rounded p-2">{error}</div>}
      <button
        type="submit"
        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-xl shadow transition disabled:opacity-50"
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
            Connexion...
          </span>
        ) : "Se connecter"}
      </button>
    </form>
  );
}
