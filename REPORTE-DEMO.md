# Reporte del demo "pedido → embalaje → boleta" (Distribuidora Kenay)

Fecha: 2026-10-05 · Repo: `fzappetti-cloud/demo-sistema-kenay` · Rama publicada: `main`
Link público (GitHub Pages): https://fzappetti-cloud.github.io/demo-sistema-kenay/ · Página del cliente: `.../pedido.html`

## 1. Qué es y para qué sirve
Demo navegable (HTML + JavaScript, sin servidor, sin login, datos en `localStorage`) para mostrar a Walter e Ivanna que el pedido se carga **una sola vez** y de ahí sale el embalaje y la boleta. Sirve para **validar el flujo y presupuestar**. **No es el sistema final.** Todo dato es ficticio y la pantalla dice "DEMO".

Problema que ataca: hoy Walter lee WhatsApp y escribe a mano una boleta inicial (23:00 a 04:00, y otra vez a las 4:00 con pedidos tardíos); después embalan marcando una segunda boleta en papel. El mismo dato se escribe dos veces.

## 2. Qué se construyó
Archivos: `index.html` (lado distribuidora), `pedido.html` (lado cliente), `CLAUDE.md` (especificación viva, actualizada con cada cambio).

**Lado cliente (`pedido.html`)**
- Validación del negocio por **DNI del titular** (dato ficticio asociado a cada cliente). Si el DNI no está cargado, ofrece la **carga inicial del negocio** (nombre, DNI, teléfono, dirección de entrega).
- Selección de productos en un **tablero de mosaicos con miniatura**; cada mosaico tiene botones − / + y un desplegable de cantidad. Los productos por bulto admiten "medio bulto", "1 bulto", "2 bultos"…; los de unidad, 1, 2, 3…
- "Enviar pedido" → el pedido queda impactado del lado de la distribuidora, sin recarga manual.
- No muestra precios.

**Lado distribuidora (`index.html`)**
1. Cargar pedido (para lo que llega por WhatsApp), con el mismo tablero, resumen previo y opción "Pedido tardío (madrugada)" con etiqueta NUEVO.
2. Lista del día: estados Sin empezar / Embalando / Embalado; etiquetas NUEVO, "Del cliente" y "Cliente nuevo".
3. Embalaje por cliente: tilde "embalado" (se guarda al instante y sobrevive a cerrar el navegador), botón "faltante" (otro color), "Confirmar cliente" bloqueado mientras haya ítems sin resolver; se puede destildar.
4. Boleta final: se genera sola solo con lo embalado (faltantes excluidos). Según `ve_monto`: con precios unitarios y total, o solo productos y cantidades sin ningún precio. Walter siempre ve el total en un recuadro que no se imprime. Botón "Imprimir / guardar PDF" (impresión del navegador).

**Experiencia de demo guiada:** barra "Soy el cliente / Soy la distribuidora" en ambas páginas y botón "Ver cómo le llega a la distribuidora" al enviar el pedido.

## 3. Verificación
Probado con un navegador automatizado a ancho de celular: flujo completo cliente → lista → embalaje → boleta; persistencia de tildes tras recargar; bloqueo de confirmación con ítems sin resolver; boleta sin precios para `ve_monto = no`; exclusión de faltantes; cliente nuevo dado de alta y visible para la distribuidora; sin errores de JavaScript.
**No verificado:** impresión/PDF real, uso en un celular físico, ni la página pública desde el entorno de trabajo (GitHub confirmó los despliegues de Pages como exitosos).

## 4. Decisiones tomadas (a validar)
- Un negocio nuevo entra por defecto con **lista de precios A y `ve_monto = no`**; el demo no tiene pantalla para que Walter lo cambie.
- Si un cliente ya tiene pedido en el día, lo nuevo **se suma al mismo** y el cliente vuelve a "por controlar".
- Las imágenes del tablero son **íconos de ejemplo**, no fotos reales.
- El repo pasó a público para usar GitHub Pages (el repo contiene nombres reales: Walter, Ivanna, Distribuidora Kenay, en `CLAUDE.md`; los datos del demo son ficticios).

## 5. Limitaciones del demo y su incidencia en las otras fases
1. **Sin servidor:** el pedido del cliente solo llega a la distribuidora si ambas páginas se abren **en el mismo navegador y dispositivo**. En el sistema real hace falta backend y base de datos compartida. **Es el principal punto del presupuesto.**
2. **Identificación del cliente:** el DNI solo valida contra clientes cargados; no es seguridad. Definir mecanismo real (código por WhatsApp, link propio por cliente, usuario) y quién aprueba los clientes nuevos.
3. **Maestros de datos reales:** hay que cargar clientes reales (con DNI/CUIT, lista de precios, `ve_monto`, forma de pago) y productos reales (forma de venta bulto/unidad, precios por lista, fotos).
4. **Pedidos por WhatsApp:** siguen entrando; el sistema real debe contemplar la carga manual de Walter y decidir si en una fase posterior se automatiza (hoy fuera de alcance).
5. **Boleta:** es de demo, sin valor fiscal. La facturación fiscal queda fuera de alcance.
6. **Reglas por confirmar con Walter/Ivanna:** horarios de corte (23:00–04:00 y reproceso de las 4:00), qué pasa si llega un pedido tardío cuando el cliente ya fue embalado/confirmado (el demo lo reabre), y si el faltante debe notificarse al cliente.

## 6. Fuera de alcance (según `CLAUDE.md`)
Cobranza, stock, compras, rutas, recordatorios, seguimiento de clientes, WhatsApp automático, facturación fiscal, usuarios y contraseñas.

## 7. Pendientes sugeridos
- Mostrar el demo a Walter e Ivanna y recoger feedback sobre las reglas del punto 5.6.
- Con ese feedback, definir alcance y presupuesto de la versión real (backend, identificación de clientes, maestros, fotos).
- Decidir si se mantienen las dos ramas del repo (`main` y la de trabajo `claude/brave-ride-ld0zj9`, hoy con el mismo contenido) o se deja solo `main`.
