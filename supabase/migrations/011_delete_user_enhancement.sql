-- Migration: 011_delete_user_enhancement.sql
-- Description: Updates delete_user_by_id and delete_own_user to comprehensively delete clients, team/creatives, profiles, and auth.users, releasing their email for re-registration.

CREATE OR REPLACE FUNCTION public.delete_user_by_id(user_uuid UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER -- Runs with elevated privileges to delete from auth.users
AS $$
DECLARE
  caller_role TEXT;
  target_client_id TEXT;
  target_team_id TEXT;
  target_email TEXT;
BEGIN
  -- 1. Get role of the caller
  SELECT role INTO caller_role FROM public.profiles WHERE id = auth.uid();
  
  -- 2. Restrict to ADMIN or the owner themselves
  IF caller_role != 'ADMIN' AND auth.uid() != user_uuid THEN
    RAISE EXCEPTION 'Acceso denegado: No tienes permisos para eliminar esta cuenta.';
  END IF;

  -- 3. Get email, client_id, and team_id associated with the user
  SELECT email, client_id, team_id INTO target_email, target_client_id, target_team_id FROM public.profiles WHERE id = user_uuid;

  IF target_email IS NULL THEN
    SELECT email INTO target_email FROM auth.users WHERE id = user_uuid;
  END IF;

  -- 4. Clean up team requests and team member record if exists
  IF target_team_id IS NOT NULL THEN
    DELETE FROM public.team_requests WHERE cm_id = target_team_id;
    DELETE FROM public.team WHERE id = target_team_id;
  ELSIF target_email IS NOT NULL THEN
    SELECT id INTO target_team_id FROM public.team WHERE email = target_email LIMIT 1;
    IF target_team_id IS NOT NULL THEN
      DELETE FROM public.team_requests WHERE cm_id = target_team_id;
      DELETE FROM public.team WHERE id = target_team_id;
    END IF;
  END IF;

  -- 5. Clean up client record (cascades to related models and profiles)
  IF target_client_id IS NOT NULL THEN
    DELETE FROM public.clients WHERE id = target_client_id;
  END IF;

  -- 6. Clean up other user specific dependencies
  DELETE FROM public.notifications WHERE user_id = user_uuid;
  DELETE FROM public.social_connections WHERE user_id = user_uuid;
  DELETE FROM public.social_ad_accounts WHERE user_id = user_uuid;
  DELETE FROM public.brand_connections WHERE user_id = user_uuid;
  DELETE FROM public.ai_agents WHERE user_id = user_uuid;
  DELETE FROM public.ai_brand_settings WHERE user_id = user_uuid;
  DELETE FROM public.ai_knowledge_base WHERE user_id = user_uuid;
  DELETE FROM public.ai_conversation_drafts WHERE user_id = user_uuid;
  DELETE FROM public.messages WHERE sender_id = user_uuid;

  -- 7. Delete profile and auth.user
  DELETE FROM public.profiles WHERE id = user_uuid;
  DELETE FROM auth.users WHERE id = user_uuid;
END;
$$;

-- Redefine delete_own_user to call delete_user_by_id securely
CREATE OR REPLACE FUNCTION public.delete_own_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'No autenticado';
  END IF;
  PERFORM public.delete_user_by_id(auth.uid());
END;
$$;
