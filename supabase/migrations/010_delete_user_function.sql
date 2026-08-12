-- Función segura para permitir a administradores o al propio usuario eliminar su cuenta
CREATE OR REPLACE FUNCTION public.delete_user_by_id(user_uuid UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER -- Ejecuta con privilegios de superusuario para modificar auth.users
AS $$
DECLARE
  caller_role TEXT;
  target_client_id TEXT;
BEGIN
  -- 1. Obtener el rol del usuario que realiza la petición
  SELECT role INTO caller_role FROM public.profiles WHERE id = auth.uid();
  
  -- 2. Restringir la ejecución solo a administradores o al propio usuario dueño de la cuenta
  IF caller_role != 'ADMIN' AND auth.uid() != user_uuid THEN
    RAISE EXCEPTION 'Acceso denegado: No tienes permisos para eliminar esta cuenta.';
  END IF;

  -- 3. Obtener el client_id asociado a la cuenta que se va a eliminar
  SELECT client_id INTO target_client_id FROM public.profiles WHERE id = user_uuid;

  -- 4. Si hay un cliente asociado, eliminarlo. 
  -- Esto disparará las reglas ON DELETE CASCADE en cascada para content, strategies, crm_leads, profiles, etc.
  IF target_client_id IS NOT NULL THEN
    DELETE FROM public.clients WHERE id = target_client_id;
  END IF;

  -- 5. Eliminar el usuario de auth.users (en caso de que no se haya borrado por cascada)
  DELETE FROM auth.users WHERE id = user_uuid;
END;
$$;
