# DEMO Kenay: pedido → embalaje → boleta

## Objetivo
Demo navegable para mostrar a Walter e Ivanna (Distribuidora Kenay) cómo se trabaja con **una sola carga** del pedido. Sirve para validar el flujo y presupuestar. **No es el sistema final.**

## Reglas
- Todo dato es **ficticio** y debe decir "DEMO" visible en pantalla.
- No inventar funciones fuera de este documento.
- Simple: páginas web estáticas (HTML + JavaScript), sin backend, sin login. Guardar en `localStorage`.
- Pensado para **celular** (Walter carga y embala desde el teléfono). Botones grandes, letra legible.
- Idioma: español rioplatense. Moneda: pesos argentinos.

## Problema que resuelve
Hoy Walter lee WhatsApp y escribe a mano una boleta inicial (23:00 a 04:00, y otra vez a las 4:00 con pedidos tardíos). Después embalan marcando en una segunda boleta en papel, y esa es la que se entrega. El mismo dato se escribe dos veces.

## Pantallas (4 del lado de la distribuidora + 1 del lado del cliente)

### 0. Página del cliente (`pedido.html`)
- Página aparte donde **el cliente de Walter carga su propio pedido**: **valida su negocio con el DNI del titular** (dato ficticio que ya está asociado a cada uno de los 5 clientes; sin login ni contraseña). Si el DNI no está cargado, la página ofrece la **carga inicial del negocio** (nombre, DNI, teléfono, dirección de entrega): queda guardado como cliente nuevo (lista A, no ve monto, por defecto) y a Walter le aparece con la etiqueta "Cliente nuevo" para validarlo. Después elige los productos en un **tablero de mosaicos con imagen en miniatura** (ver "Selección por tablero") y toca "Enviar pedido".
- No muestra precios.
- El pedido queda **impactado** en la "Lista del día" de Walter con la etiqueta "Del cliente", sin que Walter lo cargue de nuevo. Desde ahí sigue el flujo normal: embalaje → boleta.
- Si el cliente ya tenía pedido ese día, lo que envía se suma al mismo.
- Limitación del demo: sin backend, el pedido solo llega a Walter si ambas páginas se abren **en el mismo navegador/dispositivo** (comparten `localStorage`). En el sistema real hace falta un servidor.
- La pantalla "1. Cargar pedido" de Walter sigue existiendo para pedidos que llegan por WhatsApp.

### Selección por tablero (cliente y Walter)
- Los productos se eligen en un **tablero de 2 columnas**: cada mosaico tiene imagen en miniatura, nombre, forma de venta (`bulto` / `unidad`) y botones **− / +** y un **desplegable** para elegir la cantidad directamente (las dos formas conviven y se mantienen sincronizadas).
- `unidad`: el + suma de a 1. `bulto`: el primer + da "medio bulto", después "1 bulto", "2 bultos"... (la etiqueta dice siempre "bulto").
- El mosaico elegido se marca en verde con una insignia de cantidad; abajo queda el resumen del pedido.
- Las imágenes son **íconos de ejemplo** (no hay fotos reales); la pantalla lo aclara. En la versión final irían fotos de los productos de Kenay.
- Se usa en `pedido.html` y en la pantalla "1. Cargar pedido" de Walter.

### 1. Cargar pedido
- Elegir cliente (lista fija de 5 clientes ficticios).
- Elegir producto y cantidad en el tablero de mosaicos. La cantidad depende de la **forma de venta** del producto:
  - `unidad`: 1, 2, 3...
  - `bulto`: opciones "1 bulto", "medio bulto", "2 bultos"... (la etiqueta dice siempre "bulto", nunca un número suelto).
- Antes de guardar, mostrar un **resumen** del pedido con un botón "Confirmar y guardar".
- Opción "Pedido tardío (madrugada)": se guarda en la misma lista del día con la etiqueta **NUEVO**.

### 2. Lista del día
- Lista de clientes con pedido cargado, con estado: `Sin empezar`, `Embalando`, `Embalado`.
- Los pedidos tardíos se ven con la etiqueta NUEVO.
- Tocar un cliente abre su pantalla de embalaje.

### 3. Embalaje y control (por cliente)
- Muestra **solo lo que pidió ese cliente**.
- Cada ítem tiene: tilde "embalado" y botón "faltante".
- El tilde se guarda al instante: si cierran la pantalla y vuelven, **sigue marcado**.
- Un ítem faltante se ve en otro color.
- El botón "Confirmar cliente" queda **bloqueado** mientras haya ítems sin tilde y sin marca de faltante.
- Un ítem tildado se puede destildar.

### 4. Boleta final
- Se genera **sola** al confirmar el cliente, solo con lo realmente embalado (los faltantes no entran).
- Cada cliente tiene el campo `ve_monto` (sí/no):
  - `sí`: la boleta muestra precios unitarios y total.
  - `no`: la boleta muestra solo productos y cantidades, **sin ningún precio ni total**.
- Walter siempre ve el total en su pantalla (aunque el cliente no lo vea).
- Botón "Imprimir / guardar PDF" (usar la impresión del navegador).

## Datos de demo (ficticios)

### Clientes
| Cliente | DNI titular (ficticio) | Lista de precio | ve_monto |
|---|---|---|---|
| Almacén Don Pedro | 11.111.111 | A | no |
| Kiosco La Esquina | 22.222.222 | B | sí (paga contado) |
| Despensa Norte | 33.333.333 | A | no |
| Minimercado Sol | 44.444.444 | B | no |
| Almacén Los Pinos | 55.555.555 | A | sí (paga contado) |

### Productos (marcar como "ejemplo")
| Producto | Forma de venta | Precio lista A | Precio lista B |
|---|---|---|---|
| Papel higiénico (pack) | bulto | 18000 | 19500 |
| Rollos de cocina | bulto | 9000 | 9800 |
| Harina común 1 kg | bulto | 12000 | 13000 |
| Harina leudante 1 kg | unidad | 1500 | 1650 |
| Arroz 1 kg | bulto | 14000 | 15200 |
| Cereales | unidad | 2200 | 2400 |
| Galletitas | unidad | 900 | 1000 |
| Dulce de leche | unidad | 2800 | 3000 |
| Fideos 500 g | bulto | 10500 | 11300 |
| Aceite 900 ml | unidad | 3000 | 3300 |
| Yerba 1 kg | unidad | 4200 | 4600 |
| Gaseosa 1,5 L | bulto | 16000 | 17200 |

Precio del bulto = precio por bulto completo; medio bulto = la mitad.

## Criterios de aceptación
1. Cargar un pedido de punta a punta sin escribir nada dos veces.
2. Un pedido tardío aparece en la lista del día con NUEVO, sin rehacer nada.
3. Cerrar y reabrir el navegador mantiene los tildes.
4. No se puede confirmar un cliente con ítems sin resolver.
5. La boleta de un cliente con `ve_monto = no` no muestra ningún precio.
6. La boleta no incluye los faltantes.
7. Funciona bien en pantalla de celular.
8. Un pedido enviado desde `pedido.html` aparece en la lista del día de Walter sin recargarlo a mano.
9. Si el DNI no está cargado, el cliente puede cargar su negocio y seguir con su pedido; a Walter le aparece como "Cliente nuevo".
10. La selección de productos es un tablero de mosaicos con miniatura y botones − / + y desplegable de cantidad (cliente y Walter).

## Fuera de alcance (no construir)
Cobranza, stock, compras, rutas, recordatorios, seguimiento de clientes, WhatsApp automático, facturación fiscal, usuarios y contraseñas.

## Al terminar
Explicar en 5 líneas cómo abrir el demo y cómo recorrer el flujo completo.

---

# Fase 2: Cobranza y CRM con mensajes (Demo 2)

Se construye **sobre** el Demo 1, reutilizando sus clientes, productos, pedidos y estilo. No se rompió nada del Demo 1.

## Archivos
- `datos.js`: clientes, productos, íconos y utilidades **compartidos** por las tres páginas (no hay datos duplicados) + almacenamiento y datos de ejemplo de la Fase 2.
- `cobranza.html`: lado distribuidora, 5 pestañas. Acceso desde la barra de arriba de las otras páginas ("💰 Cobranza y clientes").
- `pedido.html`: lado cliente. Tras validar el negocio hay una pantalla de inicio con dos botones: **Hacer pedido** y **Avisar pago**.
- `localStorage`: `demo-kenay-v1` (Demo 1: pedidos del día y clientes nuevos, igual que antes) y `demo-kenay-f2` (Fase 2: boletas, pagos, avisos, mensajes, observaciones).

## Idea central del pago
El cliente avisa su pago desde el sistema; Walter lo reconoce por el cliente (sin importar de qué cuenta salió), busca la transferencia en su billetera y confirma. **Solo al confirmar baja el saldo.** Estados del aviso: `Avisado` → `Confirmado`, o `Descartado`. Lo obligatorio para el cliente es lo más fácil de dar: el **monto**. El comprobante es opcional.

## Lado cliente: "Avisar pago"
- Monto (obligatorio, teclado numérico), fecha de la transferencia (hoy por defecto, no admite fechas futuras), "¿A nombre de quién salió la transferencia?" (opcional), comprobante (opcional: foto, captura o PDF, con vista previa).
- Las imágenes se reducen solas (máx. 1000 px, JPEG). PDF: máximo 1 MB ("El archivo es muy pesado, probá con una captura"). Si `localStorage` se llena, se muestra un mensaje amable y la página no se rompe.
- Mensaje final: "Listo, recibimos tu aviso. No tenés que hacer nada más."
- **El lado cliente nunca muestra saldos ni deudas.**

## Lado distribuidora (`cobranza.html`)
1. **Cuenta corriente:** clientes ordenados por saldo (los de saldo cero, aparte). Detalle con boletas, pagos confirmados, "Avisado, sin confirmar" (no descuenta) y "Total a cobrar en la próxima visita" = saldo anterior + boleta nueva pendiente de entrega. "Registrar pago": efectivo o transferencia, total o parcial, fecha, y "Pagó a nombre de" (solo transferencia). Queda confirmado de inmediato.
2. **Pagos avisados:** pendientes (con contador en la pestaña), detalle con comprobante en grande, corrección de monto y fecha, Confirmar uno o en bloque, Descartar, e historial aparte. Al confirmar se crea un pago por transferencia con la fecha de la transferencia.
3. **Ficha de cliente:** datos, día de visita, lista de precios, `ve_monto`, historial de pedidos, pagos y saldo, **pagadores habituales** y **productos habituales** (calculados), y observaciones de texto libre.
4. **Seguimiento:** lista calculada con "No pidió" y "Pidió menos". Cada fila tiene "Armar mensaje". Aviso visible: "Criterios de demo. Los criterios reales se definen con datos reales."
5. **Mensajes:** plantillas "día anterior a la visita" y "seguimiento", con el nombre ya cargado y texto editable, vista previa tipo WhatsApp, "Copiar texto" y "Marcar como enviado" (queda en el historial). **No se envía nada real.**

## Reglas de cálculo y decisiones tomadas
- **Saldo = boletas entregadas − pagos confirmados.** Siempre se calcula, nunca se escribe a mano. Los avisos sin confirmar no descuentan.
- Una boleta cuenta como **entregada cuando se confirma el cliente en el Demo 1**; así cada boleta del Demo 1 suma sola al saldo. Si después se destilda o se agrega algo al pedido, esa boleta deja de contar hasta volver a confirmar.
- **Un cliente con `ve_monto = no` nunca ve montos**; ningún mensaje para él puede llevar importes (si se escribe uno, se bloquean "Copiar" y "Marcar como enviado").
- **No pidió:** el cliente no tiene ningún pedido desde su visita anterior y ya pasó su último día de visita (el día de visita en sí todavía no cuenta). **Pidió menos:** el último pedido tiene menos productos distintos que el anterior. Los criterios usan la fecha de hoy, así que funcionan cualquier día.
- Un cliente cuya observación dice "pausa/pausó" no aparece en Seguimiento. Los clientes sin día de visita (los dados de alta nuevos) tampoco.
- Días de visita de ejemplo: Don Pedro lunes, La Esquina martes, Norte miércoles, Sol jueves, Los Pinos viernes.
- Datos de ejemplo (fechas relativas a hoy): 2 semanas de pedidos y boletas; pago de contado (La Esquina y Los Pinos), por transferencia a nombre de un tercero (Don Pedro), parcial (Norte) y sin pagar (Sol); 3 avisos pendientes (uno con comprobante de ejemplo dibujado, uno sin comprobante con fecha de transferencia distinta, uno a nombre de un tercero). "Cargar datos de ejemplo de nuevo" (en Cuenta corriente) no borra los pedidos del Demo 1.
- Un cliente nuevo (alta desde `pedido.html`) tiene lista A y `ve_monto = no` por defecto.
- **Limpiar historial (empezar de cero):** botón disponible en las tres páginas (Lista del día, Cuenta corriente y pantalla de validación del cliente), con confirmación. Borra pedidos, clientes nuevos, boletas, pagos, avisos, mensajes y observaciones, y **no** vuelve a cargar los datos de ejemplo (se pueden recuperar con "Cargar datos de ejemplo de nuevo"). Sirve para que quien prueba el demo arranque desde cero.
- Seguimiento no marca a un cliente que nunca hizo un pedido (no "dejó de pedir" quien nunca pidió), así que un demo en blanco no muestra a todos como "No pidió".

## Criterios de aceptación de la Fase 2
1. Un pago total deja el saldo en cero. 2. Un pago parcial reduce el saldo por el monto indicado. 3. Un pago por transferencia permite anotar "Pagó a nombre de" y se ve en el detalle. 4. El saldo siempre coincide con boletas menos pagos confirmados. 5. El cliente avisa un pago con solo el monto (fecha de hoy ya cargada), sin adjuntar nada y sin usuario nuevo. 6. El aviso aparece en "Pagos avisados" como Avisado, con su comprobante y su "a nombre de" si los trae. 7. Un aviso sin confirmar no cambia el saldo. 8. Walter puede corregir el monto y confirmar uno o varios avisos; al confirmar baja el saldo. 9. No se puede enviar un aviso sin monto ni con fecha futura. 10. Un aviso descartado no afecta el saldo. 11. La ficha muestra productos y pagadores habituales calculados. 12. Seguimiento lista al que no pidió y al que pidió menos, con su motivo. 13. Desde Seguimiento se llega al mensaje con el nombre cargado. 14. Marcar como enviado agrega una línea al historial. 15. Ningún mensaje para un cliente con `ve_monto = no` contiene montos, y el lado cliente no muestra saldos. 16. El Demo 1 sigue funcionando completo. 17. Todo se usa bien en celular.

## Limitación conocida (no resolver en el demo)
Sin servidor, el aviso del cliente **solo llega a la distribuidora si ambas páginas se abren en el mismo navegador y dispositivo** (comparten `localStorage`). La versión real necesita un servidor con base de datos y almacenamiento de imágenes.

## Fuera de alcance de la Fase 2
Stock y compras, envío real de WhatsApp, notificaciones a Walter cuando llega un aviso, lectura automática del comprobante, integración con bancos o billeteras, conciliación automática, rutas, facturación fiscal, usuarios y contraseñas, inteligencia artificial.
