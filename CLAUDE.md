# DEMO Kenay: pedido → embalaje → boleta

## Objetivo
Demo navegable para mostrar a Walter e Ivanna (Distribuidora Kenay) cómo se trabaja con **una sola carga** del pedido. Sirve para validar el flujo y presupuestar. **No es el sistema final.**

## Reglas
- Todo dato es **ficticio** y debe decir "DEMO" visible en pantalla.
- No inventar funciones fuera de este documento.
- Simple: una sola página web, sin backend, sin login. Guardar en `localStorage`.
- Pensado para **celular** (Walter carga y embala desde el teléfono). Botones grandes, letra legible.
- Idioma: español rioplatense. Moneda: pesos argentinos.

## Problema que resuelve
Hoy Walter lee WhatsApp y escribe a mano una boleta inicial (23:00 a 04:00, y otra vez a las 4:00 con pedidos tardíos). Después embalan marcando en una segunda boleta en papel, y esa es la que se entrega. El mismo dato se escribe dos veces.

## Pantallas (4 del lado de la distribuidora + 1 del lado del cliente)

### 0. Página del cliente (`pedido.html`)
- Página aparte donde **el cliente de Walter carga su propio pedido**: elige su negocio (los 5 clientes ficticios, sin login), agrega productos y cantidades (misma forma de venta: `unidad` / `bulto`) y toca "Enviar pedido".
- No muestra precios.
- El pedido queda **impactado** en la "Lista del día" de Walter con la etiqueta "Del cliente", sin que Walter lo cargue de nuevo. Desde ahí sigue el flujo normal: embalaje → boleta.
- Si el cliente ya tenía pedido ese día, lo que envía se suma al mismo.
- Limitación del demo: sin backend, el pedido solo llega a Walter si ambas páginas se abren **en el mismo navegador/dispositivo** (comparten `localStorage`). En el sistema real hace falta un servidor.
- La pantalla "1. Cargar pedido" de Walter sigue existiendo para pedidos que llegan por WhatsApp.

### 1. Cargar pedido
- Elegir cliente (lista fija de 5 clientes ficticios).
- Elegir producto y cantidad. La cantidad depende de la **forma de venta** del producto:
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
| Cliente | Lista de precio | ve_monto |
|---|---|---|
| Almacén Don Pedro | A | no |
| Kiosco La Esquina | B | sí (paga contado) |
| Despensa Norte | A | no |
| Minimercado Sol | B | no |
| Almacén Los Pinos | A | sí (paga contado) |

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

## Fuera de alcance (no construir)
Cobranza, stock, compras, rutas, recordatorios, seguimiento de clientes, WhatsApp automático, facturación fiscal, usuarios y contraseñas.

## Al terminar
Explicar en 5 líneas cómo abrir el demo y cómo recorrer el flujo completo.
