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

Se construye **sobre** el Demo 1, reutilizando sus clientes, productos, pedidos y estilo, en 3 tandas:
1. **Cuenta corriente y Mi cuenta del cliente** (pago por boleta). ✔ *Tanda 1.*
2. **Ficha de cliente y Seguimiento.** ✔ *Tanda 2.*
3. Mensajes. *(pendiente)*

La pestaña Mensajes (tanda 3) tiene una primera versión ya construida pero **oculta** de la barra; se vuelve a sumar y se rehace en la tanda 3.

## Archivos
- `datos.js`: clientes, productos, íconos y utilidades **compartidos** por las tres páginas (no hay datos duplicados) + modelo de la Fase 2 (boletas, pagos, avisos) y datos de ejemplo.
- `cobranza.html`: lado distribuidora. Acceso desde la barra de arriba de las otras páginas ("💰 Cobranza y clientes"). Pestañas: **Cuenta corriente** (tanda 1), **Ficha de cliente** y **Seguimiento** (tanda 2). Mensajes llega en la tanda 3.
- `pedido.html`: lado cliente. Tras validar el negocio hay una pantalla de inicio con dos botones: **Hacer pedido** y **Mi cuenta**.
- `localStorage`: `demo-kenay-v1` (Demo 1: pedidos del día y clientes nuevos, igual que antes) y `demo-kenay-f2` (Fase 2, versión 2). Si el navegador tenía datos de la versión anterior de la Fase 2, se reemplazan por los datos de ejemplo la primera vez.

# Fase 2, tanda 1: Cuenta corriente y Mi cuenta

## Reglas de montos
- Al **armar su pedido**, el cliente **nunca** ve precios ni montos.
- En **Mi cuenta**, después de la entrega, ve **solo el total de cada boleta pendiente** (y lo que resta si ya hubo un pago parcial). Nunca ve productos, precios ni el detalle. Esto vale para todos los clientes, tengan o no `ve_monto`: necesita saber cuánto paga.
- Los mensajes de WhatsApp **nunca** incluyen montos. La boleta impresa sigue la regla `ve_monto` del Demo 1.

## Flujo del pago (siempre por boleta)
1. Se embala y se confirma al cliente (Demo 1): la boleta queda **Pendiente** y su total se suma al saldo.
2. El cliente entra a **Mi cuenta** y ve cada boleta pendiente por separado, más la opción **Pago parcial (otro monto)**.
3. Tilda una o más boletas **o** elige pago parcial (no las dos cosas a la vez). Lo que va a avisar se muestra en "Vas a avisar: $X".
4. Completa fecha (hoy por defecto, no futura), "a nombre de" (opcional) y comprobante (opcional) y toca **Avisar pago**. **Recién ahí** el aviso aparece en la cuenta corriente de la distribuidora.
5. Walter abre la fila del cliente (se despliega ahí mismo), valida contra su billetera, corrige monto o fecha si hace falta y **confirma**: baja el saldo.
6. Cada boleta pasa a **Pagada** o **Parcial** (con lo que resta).
7. El cliente se entera en Mi cuenta: **"Pago confirmado el [fecha]"**, o **"No pudimos verificar este pago. Comunicate con la distribuidora."** si Walter lo descartó (las boletas vuelven a Pendiente y se pueden volver a pagar).

**Camino alternativo (pago en la entrega):** Walter lo carga desde el desplegable del cliente con "Registrar pago en la entrega": efectivo o transferencia, tilda boletas (monto completo de lo que resta) o carga un pago parcial. Queda **Confirmado** de inmediato.

**Asignación:** un pago parcial se aplica primero a la boleta **más antigua**. Si Walter corrige un monto al confirmar, el sistema reasigna desde la boleta más antigua; si no lo toca, se respeta lo que eligió el cliente.

**Estados de boleta:** Pendiente → Pago avisado → Parcial o Pagada (calculados, nunca escritos a mano). **Estados de aviso:** Avisado → Confirmado, o Descartado. Un aviso sin confirmar **no** descuenta del saldo.
**Saldo = boletas generadas − pagos confirmados.**

## Lado cliente: "Mi cuenta" (`pedido.html`)
- Una sola pantalla. Si no debe nada: "No debés nada. ¡Gracias!".
- Lista de boletas (la más antigua primero) con casilla, fecha, etiqueta ("semana pasada, vencida" o "esta semana") y solo el total / lo que resta. Si la boleta ya tiene un aviso sin confirmar: "Pago avisado. Lo estamos verificando." y no se puede tildar.
- Pago parcial: campo numérico; no admite cero, negativos ni más que lo que debe (saldo menos avisos sin confirmar).
- Fecha, "a nombre de" (opcional, con ayuda), comprobante (opcional: foto, captura o PDF, con vista previa) y botón **Avisar pago**. Solo aparecen cuando hay una selección.
- Imágenes reducidas a 1000 px máx. (JPEG); PDF máx. 1 MB ("El archivo es muy pesado, probá con una captura"). Si `localStorage` se llena, mensaje amable sin romper la página.
- Al enviar: "Listo, recibimos tu aviso. La distribuidora lo va a verificar."
- **Estado de mis pagos:** los últimos 5 avisos con fecha, monto y estado en palabras simples.

## Lado distribuidora: Cuenta corriente (`cobranza.html`)
- Lista de clientes que deben, de mayor a menor saldo, con etiquetas **Vencido** y **Aviso por confirmar (n)**. Filtros: **Todos / Avisos por confirmar / Vencidos**. Los clientes sin deuda van plegados aparte.
- **Al tocar la fila, el detalle se despliega ahí mismo (acordeón).** Muestra: boletas (fecha, total, pagado, resta, estado); pagos y avisos discriminados (estado, monto, forma, fecha, "a nombre de", **a qué boleta corresponde y cuánto a cada una**, comprobante tocable, fecha y hora del aviso; si no hay: "Sin pagos ni avisos todavía."); **Total a cobrar** (suma de lo que resta); y las acciones: corregir monto/fecha, **Confirmar**, **Descartar**, y **Registrar pago en la entrega**.
- En el filtro "Avisos por confirmar", cada fila tiene una casilla que elige todos los avisos de ese cliente, y el botón **Confirmar seleccionados**.
- Botones al pie: "Cargar datos de ejemplo de nuevo" y "Limpiar historial (empezar de cero)".

## Decisiones tomadas
- **Vencida:** una boleta con más de 7 días desde su fecha ("semana pasada, vencida"). Si no, es de "esta semana". Así funciona cualquier día de la semana.
- **Pago avisado** tiene prioridad sobre Parcial en la etiqueta de una boleta mientras haya un aviso sin confirmar.
- Un aviso no se puede confirmar por más de lo que el cliente debe en ese momento ("El monto supera lo que debe el cliente").
- Los montos negativos se rechazan (no se les descarta el signo).
- En "Registrar pago en la entrega" Walter puede tildar boletas que tienen un aviso pendiente; si después confirma ese aviso, se vuelve a asignar o se rechaza si ya no entra.
- "Total a cobrar" es la suma de lo que resta de las boletas generadas. Ya no se muestra "boleta nueva pendiente de entrega".
- Se quitó la pestaña "Pagos avisados": se integró a Cuenta corriente.
- Los datos de ejemplo se cargan solos la primera vez que se usa cualquier página (el cliente necesita boletas para ver "Mi cuenta").
- Una boleta cuenta como entregada cuando se confirma el cliente en el Demo 1 (suma como Pendiente); si se reabre el embalaje, esa boleta deja de contar.
- Un cliente nuevo (alta desde `pedido.html`) tiene lista A y `ve_monto = no` por defecto.
- **Limpiar historial (empezar de cero):** botón en las tres páginas (Lista del día, Cuenta corriente y pantalla de validación del cliente), con confirmación. Borra pedidos, clientes nuevos, boletas, pagos, avisos, mensajes y observaciones y **no** vuelve a cargar los datos de ejemplo. "Cargar datos de ejemplo de nuevo" los recupera.

## Datos de ejemplo (fechas relativas a hoy)
- Días de visita: Don Pedro lunes, La Esquina martes, Norte miércoles, Sol jueves, Los Pinos viernes. Dos semanas de pedidos y boletas.
- **Don Pedro:** boletas de la semana pasada y de esta semana; un aviso a nombre de un tercero (Marta Gómez, esposa) que paga las dos.
- **La Esquina:** aviso que paga la boleta de la semana pasada con comprobante de ejemplo dibujado, y un aviso de pago parcial sin comprobante (cae en la otra boleta).
- **Despensa Norte:** boleta de la semana pasada **Parcial** (pagó una parte en efectivo) y la de esta semana Pendiente. Pidió menos que la semana anterior.
- **Minimercado Sol:** una boleta Pendiente, sin pagos ni avisos, y no pidió esta semana.
- **Los Pinos:** todo Pagado: una por transferencia (aviso confirmado) y otra en efectivo en la entrega.
- Fechas de transferencia distintas a la del aviso en dos de los avisos. Ningún comprobante es real.

## Criterios de aceptación de la tanda 1
1. Al generarse la boleta final (Demo 1), queda **Pendiente** y suma al saldo.
2. En Mi cuenta el cliente ve cada boleta pendiente por separado, solo con su total, sin productos ni precios.
3. Puede tildar una o varias boletas, o elegir pago parcial, pero no las dos cosas a la vez.
4. Con boletas tildadas, el monto a avisar es la suma de lo que resta y no se edita.
5. Con pago parcial, no se acepta cero, negativos ni más de lo que debe.
6. Hasta que toca "Avisar pago", no aparece nada de ese cliente en avisos.
7. Al avisar, la fila del cliente muestra "Aviso por confirmar".
8. Al tocar la fila, el detalle se despliega en la misma pantalla.
9. El desplegable muestra cada pago o aviso con monto, forma, fecha, a nombre de y a qué boleta corresponde y cuánto a cada una.
10. Un cliente sin pagos ni avisos muestra "Sin pagos ni avisos todavía."
11. Un aviso sin confirmar no cambia el saldo y el cliente ve "Pago avisado. Lo estamos verificando."
12. Walter puede corregir monto y fecha y confirmar; baja el saldo y cada boleta pasa a Pagada o Parcial.
13. Se pueden confirmar varios avisos a la vez desde el filtro "Avisos por confirmar".
14. Un aviso descartado no afecta el saldo y las boletas vuelven a Pendiente.
15. "Registrar pago en la entrega" permite efectivo o transferencia, tildar boletas o pago parcial, y queda confirmado de inmediato.
16. Un pago parcial se aplica primero a la boleta más antigua y lo que resta queda visible.
17. El saldo siempre coincide con boletas generadas menos pagos confirmados.
18. En Mi cuenta el cliente ve el estado de sus últimos avisos.
19. Al armar un pedido el cliente no ve precios.
20. El Demo 1 sigue funcionando completo.
21. Todo se usa bien en celular.

## Limitación conocida (no resolver en el demo)
Sin servidor, lo que hace el cliente **solo llega a la distribuidora si ambas páginas se abren en el mismo navegador y dispositivo** (comparten `localStorage`). La versión real necesita un servidor con base de datos y almacenamiento de imágenes.

## Fuera de alcance de la tanda 1
Mensajes (tanda 3), botones "Avisar al cliente", stock y compras, envío real de WhatsApp, notificaciones, lectura automática del comprobante, integración con bancos, rutas, facturación fiscal, usuarios y contraseñas, inteligencia artificial.

---

# Fase 2, tanda 2: Ficha de cliente y Seguimiento

Dos pestañas nuevas en `cobranza.html`, junto a Cuenta corriente (que no se tocó). Todo se calcula desde los datos de la tanda 1 (boletas, pagos, avisos); no hay datos nuevos duplicados.

## Ficha de cliente
Se elige el cliente en un desplegable (incluye los clientes nuevos dados de alta desde `pedido.html`). Muestra:
- **Datos:** negocio, teléfono, dirección de entrega.
- **Día de visita** semanal, **lista de precios** (A o B) y **`ve_monto`**.
- **Pagos y saldo:** el saldo (siempre igual al de Cuenta corriente), los avisos sin confirmar (que no descuentan) y los últimos pagos confirmados, con forma y "a nombre de". Botón para ir a la cuenta corriente del cliente.
- **Pagadores habituales:** nombres de "a nombre de" en sus **pagos confirmados**, con cuántas veces aparece cada uno. Se agrupan sin importar mayúsculas ni espacios de más ("tío raúl" y "Tío Raúl" cuentan como uno). Un aviso sin confirmar no suma.
- **Productos habituales:** los 4 que aparecen en más pedidos del historial ("en 2 de 2 pedidos"); si hay empate, el de más cantidad total.
- **Historial de pedidos:** fecha y cantidad de ítems (productos distintos) de cada pedido, incluido el pedido pendiente que haya en el Demo 1.
- **Observaciones:** texto libre con botón "Guardar observaciones". Se conserva al cambiar de pestaña y al recargar. Aviso: si escribís "pausa" o "pausó", el cliente no aparece en Seguimiento.

## Seguimiento
Lista de clientes a contactar, calculada sola, con **dos reglas**:
- **No pidió:** el cliente no tiene ningún pedido desde su visita anterior y ya pasó su último día de visita. (El mismo día de visita todavía no cuenta: se evalúa contra la visita de la semana pasada.)
- **Pidió menos:** el último pedido tiene menos **productos distintos** (ítems) que el anterior.

Cada fila muestra cliente, motivo y etiqueta. El botón **"Armar mensaje" aparece deshabilitado** con el texto "Disponible en la próxima etapa" (se activa en la tanda 3). Aviso visible: **"Criterios de demo. Los criterios reales se definen con datos reales."**

## Decisiones tomadas
- Las reglas usan la fecha de hoy y la visita **más reciente ya pasada**, no la semana calendario. Así Seguimiento da resultados cualquier día (se probó con cada día de la semana simulado) y los datos de ejemplo siempre incluyen un cliente que no pidió (Minimercado Sol) y uno que pidió menos (Despensa Norte: 3 productos contra 6).
- Un cliente sin día de visita (por ejemplo, uno dado de alta nuevo) no aparece en "No pidió", y uno que nunca hizo un pedido no aparece en Seguimiento (no "dejó de pedir" quien nunca pidió).
- Un pedido recién cargado cuenta como el último pedido: si es más chico que el anterior, el cliente pasa de "No pidió" a "Pidió menos".
- "Cantidad total de ítems" se interpreta como cantidad de productos distintos del pedido (no la suma de unidades, que mezclaría bultos con unidades).
- La pausa se detecta por el texto de la observación; no hay un campo aparte.
- La pestaña Mensajes se ocultó de la barra hasta la tanda 3.

## Criterios de aceptación de la tanda 2
1. Hay dos pestañas nuevas, Ficha de cliente y Seguimiento; Cuenta corriente sigue igual.
2. La ficha muestra datos, día de visita, lista, `ve_monto`, historial de pedidos, pagos y saldo (coincide con Cuenta corriente).
3. La ficha muestra productos habituales calculados del historial.
4. La ficha muestra pagadores habituales calculados de los pagos confirmados.
5. Observaciones se edita y se guarda.
6. Seguimiento lista al cliente que no pidió (y ya pasó su día de visita), con su motivo.
7. Seguimiento lista al que pidió menos, con su motivo.
8. Un cliente con observación de pausa no aparece.
9. Se ve "Criterios de demo. Los criterios reales se definen con datos reales."
10. "Armar mensaje" está deshabilitado.
11. Todo lo de la tanda 1 y el Demo 1 sigue funcionando.
12. Todo se usa bien en celular.

## Limitación conocida (no resolver en el demo)
Sin servidor, lo que hace el cliente solo llega a la distribuidora si ambas páginas se abren en el mismo navegador y dispositivo. La versión real necesita un servidor con base de datos y almacenamiento de imágenes.

## Fuera de alcance de la tanda 2
Mensajes y plantillas (tanda 3), botones "Avisar al cliente", stock y compras, envío real de WhatsApp, notificaciones, rutas, facturación fiscal, usuarios y contraseñas, inteligencia artificial.
