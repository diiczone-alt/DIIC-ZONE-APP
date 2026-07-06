# Guía de Verificación de Meta & Configuración de Producción

Esta guía contiene el procedimiento paso a paso para dar de alta la aplicación en **Meta for Developers**, realizar la **Verificación de Empresa** y configurar la integración con **Supabase** en producción.

---

## Enlaces Oficiales
* 🛠️ **Meta para Desarrolladores:** [developers.facebook.com](https://developers.facebook.com)
* 💼 **Configuración del Negocio (Business Settings):** [business.facebook.com/settings](https://business.facebook.com/settings)
* ⚡ **Consola de Supabase:** [supabase.com/dashboard](https://supabase.com/dashboard)

---

## PASO 1: Registro de la App en Meta Developers
1. Ingresa a [developers.facebook.com](https://developers.facebook.com) e inicia sesión con tu perfil de Facebook.
2. Ve a **Mis aplicaciones** (esquina superior derecha) y haz clic en **Crear aplicación**.
3. Selecciona el tipo de caso de uso:
   * **Recomendado:** Elige **Otros** > **Negocios** (esto te permitirá vincular la app a tu portafolio comercial, usar inicio de sesión con permisos avanzados de páginas, Instagram y WhatsApp).
4. Llena los detalles básicos:
   * **Nombre de la app:** Pon un nombre representativo (ej: `DIIC ZONE`).
   * **Correo de contacto:** Tu correo administrativo.
   * **Portafolio comercial:** Selecciona tu portafolio empresarial (`DIIC ZONE`).
5. Haz clic en **Crear aplicación** e ingresa tu contraseña de Facebook.

---

## PASO 2: Configuración Básica de la App
Dentro del panel de tu aplicación en Meta Developers, ve a **Configuración > Básica** (menú lateral izquierdo):
1. **URL de la política de privacidad:** Usa la ruta de privacidad que ya tiene tu app:
   * `https://tu-dominio.com/privacy` *(durante pruebas puedes usar provisionalmente la URL de tu despliegue de Vercel)*.
2. **URL de condiciones del servicio:**
   * `https://tu-dominio.com/terms` (o la misma de privacidad temporalmente).
3. **Icono de la aplicación:** Sube una imagen cuadrada de `1024x1024` con el logo de tu marca.
4. **Categoría:** Elige la que mejor se adapte (ej: **Negocios y páginas**).
5. Guarda los cambios. Al final de esta página verás:
   * **Identificador de la aplicación (App ID)**.
   * **Clave secreta de la aplicación (Client Secret)** *(haz clic en "Mostrar" para copiarla)*.

---

## PASO 3: Configuración de Supabase OAuth
1. Abre tu proyecto en la [Consola de Supabase](https://supabase.com/dashboard).
2. Ve a **Authentication > Providers** y despliega **Facebook**.
3. Activa el interruptor (**Enable Facebook Enabled**).
4. Pega los campos que obtuviste en el Paso 2:
   * **Facebook Client ID:** Copia el *App ID* de Meta.
   * **Facebook Client Secret:** Copia la *Clave secreta* de Meta.
5. Copia la **Redirect URI** que te proporciona Supabase en esa misma pantalla (se verá como `https://pigojfotwzgahcmtvyko.supabase.co/auth/v1/callback`).
6. **Regresa a Meta Developers:**
   * Haz clic en **Añadir producto** (menú izquierdo) y selecciona **Inicio de sesión con Facebook**.
   * Ve a **Inicio de sesión con Facebook > Configuración**.
   * En el campo **URIs de redireccionamiento de OAuth válidos**, pega la *Redirect URI* que copiaste de Supabase.
   * Guarda los cambios.

---

## PASO 4: Verificación de Empresa (Business Verification)
Para poder usar la aplicación en producción con usuarios reales, Meta requiere verificar tu entidad legal:
1. Entra a [business.facebook.com/settings](https://business.facebook.com/settings).
2. Selecciona tu portafolio comercial (**DIIC ZONE**).
3. Ve a **Centro de seguridad** (menú izquierdo, abajo).
4. En la sección **Verificación de la empresa**, haz clic en **Iniciar verificación**.
5. Completa la información legal exacta de tu empresa (Debe coincidir idénticamente con tus documentos legales):
   * Razón Social.
   * Dirección comercial física.
   * Teléfono.
   * Sitio web oficial (debe estar activo y con tu dominio comercial).
6. **Subir documentos probatorios:**
   * Sube tu documento tributario (RUT, RFC, RUC o Registro Mercantil) para verificar la Razón Social.
   * Sube una factura de servicio público (agua, luz, internet) o estado de cuenta bancario a nombre de la empresa para verificar la dirección física y el teléfono.
7. **Verificación de contacto:**
   * Meta te enviará un código de verificación. Elige recibirlo por **correo electrónico corporativo** (ej: `contacto@tu-dominio.com`) o por llamada/SMS al número registrado en la factura.
8. Envía los datos. El proceso de revisión suele tardar entre 2 y 5 días hábiles.

---

## PASO 5: Revisión de la App (App Review)
Para que usuarios externos puedan loguearse y conectar sus cuentas sin ser administradores de desarrollo:
1. En **Meta Developers**, ve a **Revisión de la aplicación > Permisos y funciones**.
2. Solicita acceso avanzado para los siguientes permisos según tus necesidades de DIIC ZONE:
   * `email` y `public_profile` (para el Login básico).
   * `instagram_basic` y `instagram_manage_insights` (para leer métricas de posts e historias).
   * `pages_show_list` y `pages_read_engagement` (para ver las páginas de Facebook conectadas).
   * `ads_read` (para obtener métricas de campañas de anuncios).
3. Meta te pedirá crear una **Solicitud de revisión**:
   * Graba un video corto (screencast de 1-2 minutos) donde muestres cómo el usuario inicia sesión en DIIC ZONE mediante el botón "Vincular Meta" y cómo se cargan los gráficos de métricas.
   * Escribe una breve explicación en inglés o español de para qué sirve cada permiso (ej: *"Usamos `instagram_manage_insights` para mostrar al cliente gráficos automatizados de sus impresiones y alcance en nuestro dashboard"*).
4. Envía la solicitud de revisión.
5. Una vez aprobada, cambia el interruptor en la barra superior de Meta Developers de **Desarrollo** a **Activo** (Live Mode).

¡Felicidades! Tu integración de Meta estará lista al 100% para producción.
