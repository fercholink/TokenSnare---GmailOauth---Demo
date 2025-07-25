#  Gmail OAuth Demo – Node.js

Esta es una demo educativa para mostrar cómo una aplicación web puede obtener acceso al correo electrónico de un usuario mediante OAuth 2.0, sin necesidad de conocer su contraseña. El objetivo es sensibilizar sobre los permisos excesivos y el uso indebido de aplicaciones aparentemente inofensivas.
########################### Advertencia Ética ###########################

    Esta aplicación tiene fines pedagógicos. Demuestra cómo una app puede obtener acceso sensible a través de consentimiento mal entendido. No debe usarse para prácticas de phishing reales ni contra usuarios sin consentimiento informado.

##### Autor
    Ricardo Medina

#### Tecnologías utilizadas

- Node.js + Express
- Google APIs (`googleapis`)
- Railway para despliegue en producción

---

##  Requisitos

- Node.js ≥ 16.x
- Cuenta de Google
- Proyecto en Google Cloud Console con:
  - Gmail API habilitada
  - People API
  - ID de cliente OAuth 2.0 configurado

---

##  Ejecutar en entorno local
 -- npm start
### 1. Clona el repositorio

```bash
