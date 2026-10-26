const API = '/api';

function mostrarAlerta(mensaje, tipo) {
  const el = document.getElementById('alerta');
  el.className = 'alert alert-fixed alert-' + (tipo || 'success');
  el.textContent = mensaje;
  el.style.display = 'block';
  setTimeout(function () {
    el.style.display = 'none';
  }, 3000);
}

function mostrarSeccion(seccion) {
  var secciones = document.querySelectorAll('[id^="seccion-"]');
  for (var i = 0; i < secciones.length; i++) {
    secciones[i].style.display = 'none';
  }
  document.getElementById('seccion-' + seccion).style.display = 'block';

  var links = document.querySelectorAll('.nav-link');
  for (var j = 0; j < links.length; j++) {
    links[j].classList.remove('active');
  }
  var nav = document.getElementById('nav-' + seccion);
  if (nav) nav.classList.add('active');

  if (seccion === 'dashboard') cargarDashboard();
  if (seccion === 'restaurantes') cargarRestaurantes();
  if (seccion === 'repartidores') cargarRepartidores();
  if (seccion === 'clientes') cargarClientes();
  if (seccion === 'pedidos') cargarPedidos();
}

async function cargarDashboard() {
  try {
    var rest = await fetch(API + '/restaurantes').then(function (r) { return r.json(); });
    var rep = await fetch(API + '/repartidores').then(function (r) { return r.json(); });
    var cli = await fetch(API + '/clientes').then(function (r) { return r.json(); });
    var ped = await fetch(API + '/pedidos').then(function (r) { return r.json(); });

    document.getElementById('count-restaurantes').textContent = rest.length || 0;
    document.getElementById('count-repartidores').textContent = rep.length || 0;
    document.getElementById('count-clientes').textContent = cli.length || 0;
    document.getElementById('count-pedidos').textContent = ped.length || 0;
  } catch (e) {
    console.error(e);
  }
}

async function cargarRestaurantes() {
  try {
    var data = await fetch(API + '/restaurantes').then(function (r) { return r.json(); });
    var tbody = document.getElementById('tabla-restaurantes');
    if (!Array.isArray(data)) {
      tbody.innerHTML = '<tr><td colspan="5">Error al cargar</td></tr>';
      return;
    }
    tbody.innerHTML = data.map(function (r) {
      var especialidades = (r.especialidades || []).map(function (e) {
        return '<span class="badge bg-secondary me-1">' + e + '</span>';
      }).join('');
      return '<tr>' +
        '<td><strong>' + r.codigo + '</strong></td>' +
        '<td>' + r.nombre + '</td>' +
        '<td>' + especialidades + '</td>' +
        '<td>' + (r.productos ? r.productos.length : 0) + ' productos</td>' +
        '<td><button class="btn btn-sm btn-outline-danger" onclick="eliminarRestaurante(\'' + r._id + '\')">Eliminar</button></td>' +
        '</tr>';
    }).join('');
  } catch (e) {
    console.error(e);
    mostrarAlerta('Error al cargar restaurantes', 'danger');
  }
}

async function crearRestaurante() {
  var codigo = document.getElementById('rest-codigo').value.trim();
  var nombre = document.getElementById('rest-nombre').value.trim();
  var especialidadesRaw = document.getElementById('rest-especialidades').value.trim();
  var prodCodigo = document.getElementById('rest-prod-codigo').value.trim();
  var prodNombre = document.getElementById('rest-prod-nombre').value.trim();
  var prodPrecio = document.getElementById('rest-prod-precio').value;

  if (!codigo || !nombre) {
    mostrarAlerta('Codigo y nombre son obligatorios', 'warning');
    return;
  }

  var especialidades = especialidadesRaw
    ? especialidadesRaw.split(',').map(function (s) { return s.trim(); }).filter(Boolean)
    : [];

  var productos = [];
  if (prodCodigo && prodNombre && prodPrecio) {
    productos.push({
      codigo: prodCodigo,
      nombre: prodNombre,
      precio: Number(prodPrecio)
    });
  }

  var body = {
    codigo: codigo,
    nombre: nombre,
    especialidades: especialidades,
    productos: productos
  };

  try {
    var res = await fetch(API + '/restaurantes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    var data = await res.json();
    if (!res.ok) {
      mostrarAlerta(data.error || 'Error al crear', 'danger');
      return;
    }
    bootstrap.Modal.getInstance(document.getElementById('modalRestaurante')).hide();
    document.getElementById('rest-codigo').value = '';
    document.getElementById('rest-nombre').value = '';
    document.getElementById('rest-especialidades').value = '';
    document.getElementById('rest-prod-codigo').value = '';
    document.getElementById('rest-prod-nombre').value = '';
    document.getElementById('rest-prod-precio').value = '';
    mostrarAlerta('Restaurante creado');
    cargarRestaurantes();
    cargarDashboard();
  } catch (e) {
    console.error(e);
    mostrarAlerta('Error de conexion', 'danger');
  }
}

async function eliminarRestaurante(id) {
  if (!confirm('Eliminar restaurante?')) return;
  try {
    var res = await fetch(API + '/restaurantes/' + id, { method: 'DELETE' });
    if (!res.ok) {
      var data = await res.json();
      mostrarAlerta(data.error || 'Error al eliminar', 'danger');
      return;
    }
    mostrarAlerta('Restaurante eliminado');
    cargarRestaurantes();
    cargarDashboard();
  } catch (e) {
    mostrarAlerta('Error de conexion', 'danger');
  }
}

async function cargarRepartidores() {
  try {
    var data = await fetch(API + '/repartidores').then(function (r) { return r.json(); });
    var tbody = document.getElementById('tabla-repartidores');
    if (!Array.isArray(data)) {
      tbody.innerHTML = '<tr><td colspan="6">Error al cargar</td></tr>';
      return;
    }
    tbody.innerHTML = data.map(function (r) {
      var supervisor = r.supervisor_id
        ? (r.supervisor_id.nombre + ' ' + r.supervisor_id.apellidos)
        : 'Sin supervisor';
      var licencia = r.licencia
        ? (r.licencia.numero + ' (' + r.licencia.tipo + ')')
        : '-';
      return '<tr>' +
        '<td><strong>' + r.placa + '</strong></td>' +
        '<td>' + r.nombre + ' ' + r.apellidos + '</td>' +
        '<td>' + (r.telefonos || []).join(', ') + '</td>' +
        '<td>' + licencia + '</td>' +
        '<td>' + supervisor + '</td>' +
        '<td><button class="btn btn-sm btn-outline-danger" onclick="eliminarRepartidor(\'' + r._id + '\')">Eliminar</button></td>' +
        '</tr>';
    }).join('');
  } catch (e) {
    console.error(e);
    mostrarAlerta('Error al cargar repartidores', 'danger');
  }
}

async function crearRepartidor() {
  var placa = document.getElementById('rep-placa').value.trim();
  var nombre = document.getElementById('rep-nombre').value.trim();
  var apellidos = document.getElementById('rep-apellidos').value.trim();
  var telefonosRaw = document.getElementById('rep-telefonos').value.trim();
  var licNumero = document.getElementById('rep-lic-numero').value.trim();
  var licTipo = document.getElementById('rep-lic-tipo').value.trim();
  var licFecha = document.getElementById('rep-lic-fecha').value;

  if (!placa || !nombre || !apellidos || !licNumero || !licTipo || !licFecha) {
    mostrarAlerta('Complete todos los campos obligatorios', 'warning');
    return;
  }

  var body = {
    placa: placa,
    nombre: nombre,
    apellidos: apellidos,
    telefonos: telefonosRaw
      ? telefonosRaw.split(',').map(function (s) { return s.trim(); }).filter(Boolean)
      : [],
    licencia: {
      numero: licNumero,
      tipo: licTipo,
      fecha_vencimiento: licFecha
    }
  };

  try {
    var res = await fetch(API + '/repartidores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    var data = await res.json();
    if (!res.ok) {
      mostrarAlerta(data.error || 'Error al crear', 'danger');
      return;
    }
    bootstrap.Modal.getInstance(document.getElementById('modalRepartidor')).hide();
    document.getElementById('rep-placa').value = '';
    document.getElementById('rep-nombre').value = '';
    document.getElementById('rep-apellidos').value = '';
    document.getElementById('rep-telefonos').value = '';
    document.getElementById('rep-lic-numero').value = '';
    document.getElementById('rep-lic-tipo').value = '';
    document.getElementById('rep-lic-fecha').value = '';
    mostrarAlerta('Repartidor creado');
    cargarRepartidores();
    cargarDashboard();
  } catch (e) {
    console.error(e);
    mostrarAlerta('Error de conexion', 'danger');
  }
}

async function eliminarRepartidor(id) {
  if (!confirm('Eliminar repartidor y su licencia?')) return;
  try {
    var res = await fetch(API + '/repartidores/' + id, { method: 'DELETE' });
    if (!res.ok) {
      var data = await res.json();
      mostrarAlerta(data.error || 'Error al eliminar', 'danger');
      return;
    }
    mostrarAlerta('Repartidor eliminado');
    cargarRepartidores();
    cargarDashboard();
  } catch (e) {
    mostrarAlerta('Error de conexion', 'danger');
  }
}

async function cargarClientes() {
  try {
    var data = await fetch(API + '/clientes').then(function (r) { return r.json(); });
    var tbody = document.getElementById('tabla-clientes');
    if (!Array.isArray(data)) {
      tbody.innerHTML = '<tr><td colspan="5">Error al cargar</td></tr>';
      return;
    }
    tbody.innerHTML = data.map(function (c) {
      return '<tr>' +
        '<td><strong>' + c.dni + '</strong></td>' +
        '<td>' + (c.direccion ? c.direccion.calle : '') + '</td>' +
        '<td>' + (c.direccion ? c.direccion.numero : '') + '</td>' +
        '<td>' + (c.direccion ? c.direccion.zona : '') + '</td>' +
        '<td><button class="btn btn-sm btn-outline-danger" onclick="eliminarCliente(\'' + c._id + '\')">Eliminar</button></td>' +
        '</tr>';
    }).join('');
  } catch (e) {
    console.error(e);
    mostrarAlerta('Error al cargar clientes', 'danger');
  }
}

async function crearCliente() {
  var dni = document.getElementById('cli-dni').value.trim();
  var calle = document.getElementById('cli-calle').value.trim();
  var numero = document.getElementById('cli-numero').value.trim();
  var zona = document.getElementById('cli-zona').value.trim();

  if (!dni || !calle || !numero || !zona) {
    mostrarAlerta('Complete todos los campos', 'warning');
    return;
  }

  var body = {
    dni: dni,
    direccion: {
      calle: calle,
      numero: numero,
      zona: zona
    }
  };

  try {
    var res = await fetch(API + '/clientes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    var data = await res.json();
    if (!res.ok) {
      mostrarAlerta(data.error || 'Error al crear', 'danger');
      return;
    }
    bootstrap.Modal.getInstance(document.getElementById('modalCliente')).hide();
    document.getElementById('cli-dni').value = '';
    document.getElementById('cli-calle').value = '';
    document.getElementById('cli-numero').value = '';
    document.getElementById('cli-zona').value = '';
    mostrarAlerta('Cliente creado');
    cargarClientes();
    cargarDashboard();
  } catch (e) {
    console.error(e);
    mostrarAlerta('Error de conexion', 'danger');
  }
}

async function eliminarCliente(id) {
  if (!confirm('Eliminar cliente?')) return;
  try {
    var res = await fetch(API + '/clientes/' + id, { method: 'DELETE' });
    if (!res.ok) {
      var data = await res.json();
      mostrarAlerta(data.error || 'Error al eliminar', 'danger');
      return;
    }
    mostrarAlerta('Cliente eliminado');
    cargarClientes();
    cargarDashboard();
  } catch (e) {
    mostrarAlerta('Error de conexion', 'danger');
  }
}

async function cargarPedidos() {
  try {
    var data = await fetch(API + '/pedidos').then(function (r) { return r.json(); });
    var tbody = document.getElementById('tabla-pedidos');
    if (!Array.isArray(data)) {
      tbody.innerHTML = '<tr><td colspan="8">Error al cargar</td></tr>';
      return;
    }
    tbody.innerHTML = data.map(function (p) {
      var estado = 'Sin estado';
      if (p.historial_estados && p.historial_estados.length > 0) {
        estado = p.historial_estados[p.historial_estados.length - 1].descripcion;
      }
      var restaurante = p.restaurante_id ? p.restaurante_id.nombre : '-';
      var cliente = p.cliente_id ? p.cliente_id.dni : '-';
      var repartidor = p.repartidor_id
        ? (p.repartidor_id.nombre + ' ' + p.repartidor_id.apellidos)
        : 'Sin asignar';
      var fecha = p.fecha ? new Date(p.fecha).toLocaleString() : '-';
      return '<tr>' +
        '<td><strong>' + p.numero + '</strong></td>' +
        '<td>' + fecha + '</td>' +
        '<td>Bs. ' + p.monto_total + '</td>' +
        '<td>' + restaurante + '</td>' +
        '<td>' + cliente + '</td>' +
        '<td>' + repartidor + '</td>' +
        '<td><span class="badge bg-info">' + estado + '</span></td>' +
        '<td><button class="btn btn-sm btn-outline-danger" onclick="eliminarPedido(\'' + p._id + '\')">Eliminar</button></td>' +
        '</tr>';
    }).join('');
  } catch (e) {
    console.error(e);
    mostrarAlerta('Error al cargar pedidos', 'danger');
  }
}

async function cargarSelectsPedido() {
  try {
    var rest = await fetch(API + '/restaurantes').then(function (r) { return r.json(); });
    var cli = await fetch(API + '/clientes').then(function (r) { return r.json(); });
    var rep = await fetch(API + '/repartidores').then(function (r) { return r.json(); });

    document.getElementById('ped-restaurante').innerHTML = (rest || []).map(function (r) {
      return '<option value="' + r._id + '">' + r.nombre + '</option>';
    }).join('');

    document.getElementById('ped-cliente').innerHTML = (cli || []).map(function (c) {
      return '<option value="' + c._id + '">' + c.dni + '</option>';
    }).join('');

    document.getElementById('ped-repartidor').innerHTML =
      '<option value="">Sin asignar</option>' +
      (rep || []).map(function (r) {
        return '<option value="' + r._id + '">' + r.nombre + ' ' + r.apellidos + '</option>';
      }).join('');
  } catch (e) {
    console.error(e);
  }
}

async function crearPedido() {
  var numero = document.getElementById('ped-numero').value.trim();
  var monto = document.getElementById('ped-monto').value;
  var restauranteId = document.getElementById('ped-restaurante').value;
  var clienteId = document.getElementById('ped-cliente').value;
  var repartidorId = document.getElementById('ped-repartidor').value;
  var prodCodigo = document.getElementById('ped-prod-codigo').value.trim();
  var prodNombre = document.getElementById('ped-prod-nombre').value.trim();
  var prodPrecio = document.getElementById('ped-prod-precio').value;
  var prodCantidad = document.getElementById('ped-prod-cantidad').value;

  if (!numero || !monto || !restauranteId || !clienteId || !prodCodigo || !prodNombre || !prodPrecio) {
    mostrarAlerta('Complete los campos obligatorios', 'warning');
    return;
  }

  var body = {
    numero: numero,
    monto_total: Number(monto),
    restaurante_id: restauranteId,
    cliente_id: clienteId,
    repartidor_id: repartidorId || null,
    detalles: [{
      producto_codigo: prodCodigo,
      producto_nombre: prodNombre,
      precio_unitario: Number(prodPrecio),
      cantidad: Number(prodCantidad) || 1
    }]
  };

  try {
    var res = await fetch(API + '/pedidos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    var data = await res.json();
    if (!res.ok) {
      mostrarAlerta(data.error || 'Error al crear', 'danger');
      return;
    }
    bootstrap.Modal.getInstance(document.getElementById('modalPedido')).hide();
    document.getElementById('ped-numero').value = '';
    document.getElementById('ped-monto').value = '';
    document.getElementById('ped-prod-codigo').value = '';
    document.getElementById('ped-prod-nombre').value = '';
    document.getElementById('ped-prod-precio').value = '';
    document.getElementById('ped-prod-cantidad').value = '1';
    mostrarAlerta('Pedido creado');
    cargarPedidos();
    cargarDashboard();
  } catch (e) {
    console.error(e);
    mostrarAlerta('Error de conexion', 'danger');
  }
}

async function eliminarPedido(id) {
  if (!confirm('Eliminar pedido, detalles e historial?')) return;
  try {
    var res = await fetch(API + '/pedidos/' + id, { method: 'DELETE' });
    if (!res.ok) {
      var data = await res.json();
      mostrarAlerta(data.error || 'Error al eliminar', 'danger');
      return;
    }
    mostrarAlerta('Pedido eliminado');
    cargarPedidos();
    cargarDashboard();
  } catch (e) {
    mostrarAlerta('Error de conexion', 'danger');
  }
}

cargarDashboard();
