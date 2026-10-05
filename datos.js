/* DEMO Kenay – datos y utilidades compartidos (todo ficticio).
   Lo usan index.html, pedido.html y cobranza.html. */

const KEY = 'demo-kenay-v1';      // Demo 1: pedidos del día + clientes nuevos
const KEY_F2 = 'demo-kenay-f2';   // Demo 2: boletas, pagos, avisos, mensajes, fichas

const CLIENTES = [
  {id:1, nombre:'Almacén Don Pedro',  dni:'11.111.111', lista:'A', ve_monto:false, diaVisita:1, tel:'11 5550-0101', dir:'Calle Falsa 101'},
  {id:2, nombre:'Kiosco La Esquina',  dni:'22.222.222', lista:'B', ve_monto:true,  diaVisita:2, tel:'11 5550-0202', dir:'Av. Ejemplo 202'},
  {id:3, nombre:'Despensa Norte',     dni:'33.333.333', lista:'A', ve_monto:false, diaVisita:3, tel:'11 5550-0303', dir:'Calle Norte 303'},
  {id:4, nombre:'Minimercado Sol',    dni:'44.444.444', lista:'B', ve_monto:false, diaVisita:4, tel:'11 5550-0404', dir:'Calle del Sol 404'},
  {id:5, nombre:'Almacén Los Pinos',  dni:'55.555.555', lista:'A', ve_monto:true,  diaVisita:5, tel:'11 5550-0505', dir:'Ruta de los Pinos 505'},
];
const PRODUCTOS = [
  {id:1, nombre:'Papel higiénico (pack)', forma:'bulto', A:18000, B:19500},
  {id:2, nombre:'Rollos de cocina', forma:'bulto', A:9000, B:9800},
  {id:3, nombre:'Harina común 1 kg', forma:'bulto', A:12000, B:13000},
  {id:4, nombre:'Harina leudante 1 kg', forma:'unidad', A:1500, B:1650},
  {id:5, nombre:'Arroz 1 kg', forma:'bulto', A:14000, B:15200},
  {id:6, nombre:'Cereales', forma:'unidad', A:2200, B:2400},
  {id:7, nombre:'Galletitas', forma:'unidad', A:900, B:1000},
  {id:8, nombre:'Dulce de leche', forma:'unidad', A:2800, B:3000},
  {id:9, nombre:'Fideos 500 g', forma:'bulto', A:10500, B:11300},
  {id:10, nombre:'Aceite 900 ml', forma:'unidad', A:3000, B:3300},
  {id:11, nombre:'Yerba 1 kg', forma:'unidad', A:4200, B:4600},
  {id:12, nombre:'Gaseosa 1,5 L', forma:'bulto', A:16000, B:17200},
];
const ICONOS = {1:['🧻','#e3f0fb'],2:['🧻','#fdf0d5'],3:['🌾','#fbf3d0'],4:['🌾','#f3e6c9'],5:['🍚','#eef2f3'],6:['🥣','#fde4d5'],
 7:['🍪','#f5e1c8'],8:['🍯','#f7dfc2'],9:['🍝','#fdeec2'],10:['🫒','#e4f1d4'],11:['🧉','#dbeed8'],12:['🥤','#fbdada']};
const DIAS = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];

/* ---------- utilidades ---------- */
const fmt = n => '$ ' + Math.round(n).toLocaleString('es-AR');
const prod = id => PRODUCTOS.find(p => p.id === id);
function cantLabel(p, q){
  if (p.forma === 'unidad') return q + (q === 1 ? ' unidad' : ' unidades');
  if (q === 0.5) return 'medio bulto';
  return (q === 1 ? '1 bulto' : q + ' bultos');
}
const pad2 = n => String(n).padStart(2, '0');
const isoDe = d => d.getFullYear() + '-' + pad2(d.getMonth()+1) + '-' + pad2(d.getDate());
const hoyISO = () => isoDe(new Date());
function sumarDias(iso, n){ const [y,m,d] = iso.split('-').map(Number); return isoDe(new Date(y, m-1, d+n)); }
function diaSem(iso){ const [y,m,d] = iso.split('-').map(Number); return new Date(y, m-1, d).getDay(); }
function fmtFecha(iso){ const [y,m,d] = iso.split('-'); return d + '/' + m + '/' + y; }
function fmtFechaHora(ts){ const t = new Date(ts); return pad2(t.getDate()) + '/' + pad2(t.getMonth()+1) + ' ' + pad2(t.getHours()) + ':' + pad2(t.getMinutes()); }
function ultimaFecha(wd){ let f = sumarDias(hoyISO(), -1); while (diaSem(f) !== wd) f = sumarDias(f, -1); return f; } // último día wd anterior a hoy
function nuevoId(p){ return p + Date.now().toString(36) + Math.random().toString(36).slice(2,6); }
function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

/* ---------- Demo 1 (solo lectura desde acá) ---------- */
function dbLoad(){ try { return JSON.parse(localStorage.getItem(KEY)) || {pedidos:[]}; } catch(e){ return {pedidos:[]}; } }
function clientesTodos(){ return CLIENTES.concat(dbLoad().clientes || []); }
function clienteDe(id){ return clientesTodos().find(c => c.id === id); }
function totalItems(c, items){ return items.reduce((s,i) => s + prod(i.productoId)[c.lista] * i.cant, 0); }

/* ---------- Demo 2: almacenamiento ---------- */
function f2Vacio(){ return {v:1, seeded:false, boletas:[], pagos:[], avisos:[], mensajes:[], fichas:{}}; }
function f2Load(){ try { const s = JSON.parse(localStorage.getItem(KEY_F2)); if (s && s.v === 1) return s; } catch(e){} return f2Vacio(); }
function f2Save(s){ try { localStorage.setItem(KEY_F2, JSON.stringify(s)); return true; } catch(e){ return false; } }

// Saldo = boletas entregadas − pagos confirmados. Siempre calculado.
function f2Saldo(s, clienteId){
  const c = clienteDe(clienteId); if (!c) return 0;
  const deb = s.boletas.filter(b => b.clienteId === clienteId).reduce((t,b) => t + totalItems(c, b.items), 0);
  const hab = s.pagos.filter(p => p.clienteId === clienteId).reduce((t,p) => t + p.monto, 0);
  return deb - hab;
}

// Demo 1 → Demo 2: una boleta confirmada pasa a ser deuda; si se reabre, deja de serlo.
function f2SyncBoleta(ped){
  if (!ped.id) ped.id = nuevoId('p');
  if (!ped.fecha) ped.fecha = hoyISO();
  const s = f2Load();
  s.boletas = s.boletas.filter(b => b.pedidoId !== ped.id);
  if (ped.confirmado){
    s.boletas.push({id:'b-' + ped.id, pedidoId:ped.id, clienteId:ped.clienteId, pedidoFecha:ped.fecha, fecha:hoyISO(),
      items:ped.items.filter(i => i.estado === 'ok').map(i => ({productoId:i.productoId, cant:i.cant}))});
  }
  f2Save(s);
}

/* ---------- Datos de ejemplo ---------- */
function comprobanteEjemplo(monto){
  const c = document.createElement('canvas'); c.width = 500; c.height = 700;
  const g = c.getContext('2d');
  g.fillStyle = '#fff'; g.fillRect(0,0,500,700);
  g.strokeStyle = '#999'; g.lineWidth = 2; g.strokeRect(10,10,480,680);
  g.fillStyle = '#1d5fa8'; g.fillRect(10,10,480,90);
  g.fillStyle = '#fff'; g.font = 'bold 30px sans-serif'; g.fillText('Transferencia realizada', 40, 66);
  g.fillStyle = '#1f2933'; g.font = '24px sans-serif';
  g.fillText('Importe: ' + fmt(monto), 40, 170);
  g.fillText('Estado: Aprobada', 40, 215);
  g.fillText('Referencia: 000123456', 40, 260);
  g.save(); g.translate(250,440); g.rotate(-0.35); g.textAlign = 'center';
  g.fillStyle = 'rgba(192,57,43,.85)'; g.font = 'bold 38px sans-serif'; g.fillText('COMPROBANTE', 0, -20); g.fillText('DE EJEMPLO', 0, 24);
  g.restore();
  g.fillStyle = '#6b7280'; g.font = '18px sans-serif'; g.textAlign = 'center'; g.fillText('DEMO – dato ficticio', 250, 660);
  return c.toDataURL('image/jpeg', 0.7);
}

function f2Sembrar(s){
  const V = {}; // visita más reciente de cada cliente
  CLIENTES.forEach(c => V[c.id] = ultimaFecha(c.diaVisita));
  // [clienteId, items de la visita anterior (V2), items de la última visita (V1)]
  const plan = [
    [1, [[1,1],[5,2],[9,1],[4,6],[7,10]], [[1,1],[5,1],[9,2],[10,3],[11,2]]],
    [2, [[2,1],[3,1],[6,6],[8,4]],        [[2,1],[3,2],[6,4],[8,6]]],
    [3, [[1,2],[3,1],[5,1],[7,12],[10,4],[12,1]], [[3,1],[7,10],[10,2]]],
    [4, [[1,1],[2,1],[4,6],[6,3],[8,2]],  null],
    [5, [[2,2],[5,1],[11,3],[6,4]],       [[2,1],[5,2],[11,2],[6,6]]],
  ];
  const tot = {};
  plan.forEach(([cid, i2, i1]) => {
    const c = CLIENTES.find(x => x.id === cid), v1 = V[cid], v2 = sumarDias(v1, -7);
    [[i2, v2, 2], [i1, v1, 1]].forEach(([its, v, n]) => {
      if (!its) return;
      const items = its.map(([productoId, cant]) => ({productoId, cant}));
      s.boletas.push({id:'ej-b-' + cid + '-' + n, clienteId:cid, pedidoFecha:sumarDias(v, -1), fecha:v, items});
      tot[cid + '-' + n] = totalItems(c, items);
    });
  });
  const pago = (clienteId, forma, monto, fecha, aNombreDe, tipo) =>
    s.pagos.push({id:nuevoId('pg'), clienteId, forma, monto, fecha, aNombreDe:aNombreDe || '', tipo:tipo || 'total', origen:'ejemplo'});
  // Don Pedro: transferencia a nombre de un tercero (la boleta anterior); la última sigue sin pagar
  pago(1, 'transferencia', tot['1-2'], V[1], 'Marta Gómez, esposa');
  // La Esquina y Los Pinos: pagan de contado
  pago(2, 'efectivo', tot['2-2'], sumarDias(V[2], -7)); pago(2, 'efectivo', tot['2-1'], V[2]);
  pago(5, 'efectivo', tot['5-2'], sumarDias(V[5], -7)); pago(5, 'efectivo', tot['5-1'], V[5]);
  // Despensa Norte: pago parcial
  pago(3, 'efectivo', 50000, V[3], '', 'parcial');
  // Minimercado Sol: sin pagar
  const ahora = Date.now(), hoy = hoyISO();
  const aviso = (clienteId, monto, fechaTransf, aNombreDe, comprobante, minAtras) =>
    s.avisos.push({id:nuevoId('av'), clienteId, monto, fechaTransf, aNombreDe:aNombreDe || '', comprobante:comprobante || null,
      enviadoAt:new Date(ahora - minAtras*60000).toISOString(), estado:'avisado', origen:'ejemplo'});
  aviso(1, tot['1-1'], hoy, '', {tipo:'img', nombre:'comprobante-ejemplo.jpg', data:comprobanteEjemplo(tot['1-1'])}, 180);
  aviso(3, tot['3-2'] - 50000, sumarDias(hoy, -2), '', null, 60);
  aviso(4, tot['4-2'], sumarDias(hoy, -1), 'Lucas Ríos, hijo', null, 30);
  s.seeded = true;
}

function f2Reiniciar(){
  const s = f2Vacio();
  const db = dbLoad(); // las boletas de pedidos ya confirmados en el Demo 1 se conservan
  db.pedidos.forEach(p => { if (p.confirmado) {
    if (!p.id) p.id = nuevoId('p'); if (!p.fecha) p.fecha = hoyISO();
    s.boletas.push({id:'b-' + p.id, pedidoId:p.id, clienteId:p.clienteId, pedidoFecha:p.fecha, fecha:hoyISO(),
      items:p.items.filter(i => i.estado === 'ok').map(i => ({productoId:i.productoId, cant:i.cant}))});
  }});
  try { localStorage.setItem(KEY, JSON.stringify(db)); } catch(e){}
  f2Sembrar(s);
  return f2Save(s);
}

// Deja el demo en blanco: sin pedidos, clientes nuevos, boletas, pagos, avisos ni mensajes.
// (seeded=true evita que vuelvan a cargarse solos los datos de ejemplo.)
function limpiarTodo(){
  try { localStorage.removeItem(KEY); } catch(e){}
  const s = f2Vacio(); s.seeded = true;
  return f2Save(s);
}
const MSG_LIMPIAR = '¿Limpiar todo el historial del demo?\n\nSe borran pedidos, boletas, pagos, avisos, mensajes y clientes nuevos. Queda todo en blanco para empezar de cero.\n\nNo se puede deshacer.';
