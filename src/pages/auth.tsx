import LoginForm from "../components/login-form";
import SignupForm from "../components/signup-form";
import { useState } from "react";
import { supabase } from "../integrations/supabase/client";

export default function AuthPage() {
  const [showLogin, setShowLogin] = useState(true);
  const [session, setSession] = useState(null);

  // Vérifie la session utilisateur
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session) setSession(session);
  });

  if (session) {
    window.location.href = "/";
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-orange-100">
      <div className="bg-white/90 p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200">
        <div className="flex flex-col items-center mb-6">
          <img src="/favicon.ico" alt="Logo" className="w-16 h-16 mb-2" />
          <h1 className="text-2xl font-extrabold text-gray-800 mb-1 tracking-tight">Sikaa</h1>
          <p className="text-gray-500 text-sm">Gérez vos finances simplement</p>
        </div>
        {showLogin ? <LoginForm /> : <SignupForm />}
        <div className="mt-6 text-center">
          {showLogin ? (
            <button className="text-blue-600 hover:underline font-medium" onClick={() => setShowLogin(false)}>
              Pas de compte ? <span className="underline">S'inscrire</span>
            </button>
          ) : (
            <button className="text-blue-600 hover:underline font-medium" onClick={() => setShowLogin(true)}>
              Déjà un compte ? <span className="underline">Se connecter</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
