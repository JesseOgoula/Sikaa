import { ModernFinancialDashboard } from "@/components/modern-financial-dashboard";
import { useEffect, useState } from "react";
import { supabase } from "../integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setSession(session);
      }
      setLoading(false);
    });
  }, [navigate]);

  if (loading) return <div>Chargement...</div>;
  if (!session) return null;
  return <ModernFinancialDashboard />;
};

export default Index;
