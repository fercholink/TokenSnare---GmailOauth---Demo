#  TokenSnare – Ethical OAuth Exploitation Demo

**TokenSnare** es una aplicación demostrativa construida con Node.js que muestra cómo una app aparentemente inocente puede capturar y usar tokens OAuth 2.0 para acceder a servicios como Gmail. El objetivo es **educar sobre los riesgos de consentimiento excesivo** y **entrenar a profesionales en ciberseguridad y ethical hacking** en la manipulación controlada de tokens de acceso.

> **Advertencia ética**  
> Esta herramienta tiene fines exclusivamente pedagógicos. No debe utilizarse para acceder a cuentas de terceros sin consentimiento informado. Su uso está orientado a **entornos controlados**, simulaciones de seguridad y programas de formación.

---

## Tecnologías utilizadas

- Node.js + Express
- Google APIs (`googleapis`)
- Bootstrap 5
- Railway (despliegue en producción) //opcional

---

## Funcionalidades destacadas

- Inicio de sesión mediante Google OAuth2
- Acceso al correo del usuario autenticado
- Visualización de las últimas bandejas: Inbox, Sent, Trash, Spam
- Visualización de adjuntos //pdf por lo pronto :)
- Envío de un correo automático como prueba de acceso
- Interfaz modular y extensible para prácticas de seguridad

---

## Requisitos

- Node.js v16 o superior
- Cuenta de Google para pruebas
- Proyecto configurado en Google Cloud Console con:
  - Gmail API habilitada
  - People API habilitada
  - Credenciales OAuth 2.0 configuradas
  - Orígenes autorizados (local y Railway)

---

## Ejecutar en entorno local

1. Clona el repositorio:

```bash
git clone https://github.com/tu-usuario/tokensnare.git
cd tokensnare

2. Instala dependencias

npm install

3. Crea un archivo .env con tus credenciales de google: 
GOOGLE_CLIENT_ID=tu_cliente_id
GOOGLE_CLIENT_SECRET=tu_secreto
REDIRECT_URI=http://localhost:3000/oauth2callback

4. Ejecuta el servidor:

npm start

5. (opcional) despliega en entrono cloud PaaS // configura las variables de entorno en la nube
