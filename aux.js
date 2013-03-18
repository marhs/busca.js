/* Frontend de buscaminas.js
 * Aqui pretendo agrupar todo el js relacionado con el frontend, dejando
 * la parte lógica en server.js (que despues se moverá al servidor)
 */

/* TODO
 * - Comentar funciones
 * - Crear opcion de poner banderas  
 *   Hay que hacer click en Jugar ANTES de empezar a jugar, o si no peta. 
 *     O hacerlo no-clickable mientras no se pueda jugar.
 *   Hacer que el tablero sea no clickable para determinadas cosas. 
 */


/*  Parte de Node.js
 *
 */

var socket = io.connect('http://localhost:1337');

socket.on('click', function(data) {
	console.log('Resultado de click: ' + data);
	cliente.relleno(data);
});
socket.on('mascara', function(data) {
	console.log('Resultado de mascara: ' + data);
});
function creaTablero(minas, m,n) {
	socket.emit('creaTablero', {minas:minas, m:m, n:n});
	console.log("Tablero creado");
}
function click(x,y) {
	// Transmite el click en (x,y)
	socket.emit('click', {x:x,y:y});
}
socket.on('victoria', function() {
	document.getElementById('busca').innerHTML = '<p> Victoria :D </p>';
});
socket.on('derrota', function() {
	document.getElementById('busca').innerHTML = '<p> Derrota :( </p>';
});
/* Fin de node.js
 *
 */
function inicio() {
	console.log("Iniciando partida");
	creaTablero(10, 10, 10);
	cliente.generaTablero(10,10);
}
var mina = '<img src="img/mina.png" />'
var bandera = '<img src="img/bandera.png" />'
var cliente = { 
	tab : new Array(),
	m : 0,
	n : 0,
	generaTablero  : function(m,n) {
		// Genera el tablero del juego.
    var i,j,text;
		this.m = m;
		this.n = n;
    doc = document.getElementById("board");
    text = '<table id="board">'
    for(i=0; i<m;  i++) {
			this.tab[i] = new Array();
      text += "<tr>";
      for(j=0; j<n; j++) {
				this.tab[i][j] = false;
        text += '<td><a href="#" onClick="cliente.descubre('+i+','+j+')"> <div class="casilla" id="'+i+'.'+j+'" > </div></a></td>\n';
       }
      text += '</tr>\n';
    } 
    text += '</table>';
    doc.innerHTML = text;

  },

  descubre : function(x,y){
    click(x,y);
    this.relleno();
  },

  actualizaCasilla : function(x,y,value) {
  // Pinta una casilla con un número o una mina.
		if(!this.tab[x][y]) {
			document.getElementById(''+x+'.'+y).setAttribute('class','casillaPressed');
			res = value;
			if (res > 0) { // Numero
				document.getElementById(''+x+'.'+y).innerHTML = res;
			} 
			if (res < 0) { // Mina
				document.getElementById(''+x+'.'+y).innerHTML = mina;
			}
			this.tab[x][y] == true
		}
	},

  relleno : function(list) {
	/* Actualiza la lista de casillas que recibe del servidor */	
    if (list == null) return 0;
		var i;
		for(i=0;i<list.length;i++) {
			var c = list[i];
			this.actualizaCasilla(c[0], c[1], c[2]);
		}
  }
}

