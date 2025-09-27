-- Création de la table profiles pour les informations utilisateur
CREATE TABLE public.profiles (
	id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
	user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
	display_name TEXT,
	avatar_url TEXT,
	created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
	updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Fonction pour créer un profil lors de l'inscription d'un utilisateur
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
	INSERT INTO public.profiles (user_id)
	VALUES (NEW.id);
	RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger sur l'ajout d'un utilisateur dans auth.users
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
