# Guía de Verificación de Google Cloud (Gmail, Calendario y Drive)

Esta guía detalla los pasos para registrar tu aplicación en **Google Cloud Console**, configurar la pantalla de consentimiento de OAuth, añadir los permisos (Scopes) de Gmail y Calendario, y conectarlo con Supabase.

---

## Enlaces Oficiales
* 🛠️ **Google Cloud Console:** [console.cloud.google.com](https://console.cloud.google.com)
* 🔐 **Pantalla de Consentimiento OAuth:** [console.cloud.google.com/apis/credentials/consent](https://console.cloud.google.com/apis/credentials/consent)
* ⚡ **Consola de Supabase:** [supabase.com/dashboard](https://supabase.com/dashboard)

---

## PASO 1: Crear el Proyecto en Google Cloud
1. Entra a [console.cloud.google.com](https://console.cloud.google.com) e inicia sesión con tu correo de Gmail/Google Workspace.
2. En la barra superior, haz clic en el menú desplegable de proyectos y selecciona **"Proyecto nuevo"**.
3. Ponle un nombre representativo (ej: `DIIC ZONE`) y haz clic en **"Crear"**.

---

## PASO 2: Configurar la Pantalla de Consentimiento de OAuth
1. En el menú lateral izquierdo, ve a **APIs y servicios > Pantalla de consentimiento de OAuth**.
2. Selecciona el tipo de usuario:
   * **Externo (External):** Si quieres que cualquier cliente con cuenta de Gmail pueda vincular su calendario.
   * Haz clic en **Crear**.
3. Llena la información de la aplicación:
   * **Nombre de la aplicación:** `DIIC ZONE`.
   * **Correo electrónico de asistencia:** Tu correo de soporte.
   * **Información de contacto del desarrollador:** Tu correo electrónico.
4. En **Dominios autorizados**, añade:
   * `diiczone.com` (Tu dominio web oficial).
   * `supabase.co` (Requerido para permitir las redirecciones de Supabase).
5. Haz clic en **Guardar y continuar**.

---

## PASO 3: Agregar los Permisos Especiales (Scopes)
Para permitir que la app gestione el Calendario, Gmail y Drive:
1. En el paso de **Permisos (Scopes)**, haz clic en **"Agregar o quitar permisos"**.
2. Busca y selecciona los siguientes permisos específicos según tu código de DIIC ZONE:
   * **Calendario:**
     * `.../auth/calendar` (Ver, editar y eliminar calendarios de forma permanente).
     * `.../auth/calendar.events` (Ver y editar eventos del calendario).
   * **Gmail (Mensajería):**
     * `.../auth/gmail.send` (Enviar correos electrónicos a tu nombre).
     * `.../auth/gmail.readonly` (Leer correos para clasificar leads).
   * **Google Drive (DAM/Biblioteca):**
     * `.../auth/drive.file` (Ver y gestionar archivos creados por la aplicación).
3. Haz clic en **Actualizar** y luego en **Guardar y continuar**.

---

## PASO 4: Generar Credenciales y Conectar con Supabase
1. En el menú izquierdo, ve a **APIs y servicios > Credenciales**.
2. Haz clic en **"+ Crear credenciales"** (arriba) y selecciona **ID de cliente de OAuth**.
3. **Tipo de aplicación:** Elige **Aplicación web**.
4. **Nombre:** `DIIC ZONE Web Client`.
5. **Orígenes de JavaScript autorizados:** Añade la URL de tu backend y frontend:
   * `https://api.diiczone.com`
   * `https://diiczone.com`
   * `http://localhost:3000` *(para tus pruebas locales)*
6. **URIs de redireccionamiento autorizados:**
   * Entra a la consola de [Supabase > Authentication > Providers > Google](https://supabase.com/dashboard).
   * Copia la **Redirect URI** que te da Supabase (se verá como `https://pigojfotwzgahcmtvyko.supabase.co/auth/v1/callback`).
   * Pégala aquí en Google Cloud Console.
7. Haz clic en **Crear**. Google te mostrará:
   * **ID de cliente (Client ID)**.
   * **Secreto de cliente (Client Secret)**.
8. **Guardar en Supabase:** Pega el *ID de cliente* y el *Secreto de cliente* en la sección de Google de Supabase, activa el interruptor y haz clic en **Guardar**.

---

## PASO 5: Modo de Prueba (Testing) y Verificación
* **Modo de Prueba (Development):** Mientras la app esté en desarrollo, Google bloqueará a cualquier usuario no registrado. Debes ir a la pestaña **Pantalla de consentimiento de OAuth > Usuarios de prueba** y añadir los correos de Gmail que vas a usar para realizar pruebas.
* **Verificación de Google (Producción):** Cuando solicites permisos sensibles como `gmail.send` o `calendar`, Google te mostrará una pantalla de advertencia roja de "App no verificada". Para quitarla:
  1. Haz clic en **"Preparar para la verificación"** en la consola de Google.
  2. Sube los enlaces de tu política de privacidad.
  3. Sube un video en YouTube de demostración en modo oculto mostrando cómo tu app se conecta a Google Calendar y sincroniza un evento de DIIC ZONE.
  4. Google revisará tu solicitud en un lapso de 3 a 7 días.
