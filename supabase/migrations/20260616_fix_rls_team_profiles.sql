-- ============================================================
-- MIGRACIÓN: Fix RLS - Permitir lectura de team y profiles
-- Fecha: 2026-06-16
-- Problema: La clave anon no podía leer las tablas team/profiles
--           porque las políticas solo cubrían 'authenticated'.
-- ============================================================

-- 1. Ampliar función is_staff() con todos los roles creativos
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() 
    AND UPPER(role) IN (
      'ADMIN', 'CREATOR', 'COMMUNITY', 'TEAM', 'STAFF',
      'FILMMAKER', 'EDITOR', 'DESIGNER', 'AUDIO',
      'FOTOGRAFIA', 'FOTO', 'MODELO', 'MODEL',
      'WEB', 'PRINT', 'IMPRENTA', 'EVENT', 'EVENTO',
      'ESTRATEGA', 'CM'
    )
  );
END;
$function$;

-- 2. Política: cualquiera (anon + authenticated) puede leer la tabla team
DROP POLICY IF EXISTS "Anyone can view team" ON public.team;
CREATE POLICY "Anyone can view team"
ON public.team
FOR SELECT
TO anon, authenticated
USING (true);

-- Política: autenticados pueden insertar en team
DROP POLICY IF EXISTS "Authenticated can insert team" ON public.team;
CREATE POLICY "Authenticated can insert team"
ON public.team
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Política: autenticados pueden actualizar team
DROP POLICY IF EXISTS "Authenticated can update team" ON public.team;
CREATE POLICY "Authenticated can update team"
ON public.team
FOR UPDATE
TO authenticated
USING (true);

-- 3. Política: cualquiera puede leer perfiles de creativos/staff (no clientes)
DROP POLICY IF EXISTS "Anyone can view non-client profiles" ON public.profiles;
CREATE POLICY "Anyone can view non-client profiles"
ON public.profiles
FOR SELECT
TO anon, authenticated
USING (
  UPPER(role) NOT IN ('CLIENT')
  OR (id = auth.uid())
);

-- 4. Política para usuarios autenticados: ver perfiles creativos
DROP POLICY IF EXISTS "Authenticated users can view creative profiles" ON public.profiles;
CREATE POLICY "Authenticated users can view creative profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  (id = auth.uid())
  OR
  (UPPER(role) NOT IN ('CLIENT'))
);
