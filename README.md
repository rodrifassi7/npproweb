# NPPRO Web - Trelew

Web de pedidos por WhatsApp para NPPRO. Minimalista, premium y optimizada para alto rendimiento.

## 🚀 Cómo empezar

1. Instalar dependencias: `npm install`
2. Correr en desarrollo: `npm run dev`
3. Construir para producción: `npm run build`

## ⚙️ Configuración

Toda la configuración principal se encuentra en `src/data/data.ts`.

### Cambiar WhatsApp
Modificá `WHATSAPP_NUMBER` con el formato internacional (ej: `549280XXXXXXX`).

### Cambiar Color de Acento
Modificá `ACCENT_COLOR` y también actualizá el valor en `tailwind.config.js` y `src/index.css` si es necesario (el diseño usa variables de Tailwind).

### Días de Entrega y Dirección
Editá `DELIVERY_DAYS` y `PICKUP_ADDRESS` en `src/data/data.ts`.

### Descuentos de Packs
Editá `DISCOUNT_TIERS` para cambiar las reglas de 5%, 10% y 15%.

## 🖼️ Personalización de Marca

### Logos
Reemplazá los siguientes archivos en la carpeta `/public`:
- `logo.png`: Logo principal.
- `logo-mark.png`: Isotipo (solo el símbolo).
- `og-image.jpg`: Imagen para compartir en redes sociales.

### Imágenes de Menú
Las imágenes del menú en `src/data/data.ts` usan URLs de Unsplash por defecto. Podés reemplazarlas por rutas locales (ej: `/images/plato1.jpg`) después de colocar las fotos en `/public/images/`.

## 🌐 Deploy en Netlify

1. Sube el código a un repositorio de GitHub.
2. Conecta el repo con Netlify.
3. Comando de build: `npm run build`
4. Directorio de salida: `dist`
5. ¡Listo!
