-- 1. Add birth_date column to profiles, team, and clients tables
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS birth_date DATE;
ALTER TABLE public.team ADD COLUMN IF NOT EXISTS birth_date DATE;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS birth_date DATE;

-- 2. Update trigger function handle_new_user to safely capture birth_date from raw_user_meta_data
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role, birth_date)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    COALESCE(new.raw_user_meta_data->>'role', 'client'),
    CASE 
      WHEN new.raw_user_meta_data->>'birth_date' IS NOT NULL AND new.raw_user_meta_data->>'birth_date' <> '' 
      THEN (new.raw_user_meta_data->>'birth_date')::date 
      ELSE NULL 
    END
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
