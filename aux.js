/* Frontend de buscaminas.js
 * Aqui pretendo agrupar todo el js relacionado con el frontend, dejando
 * la parte lógica en server.js (que despues se moverá al servidor)
 */

/* TODO
 * - Comentar funciones
 * - Crear opcion de poner banderas  
 */


/*  Parte de Node.js
 *
 */

var socket = io.connect('http://localhost');

socket.on('click', function(data) {
	console.log('Resultado de click: ' + data);
});
socket.on('mascara', function(data) {
	console.log('Resultado de mascara: ' + data);
});
function creaTablero(minas, m,n) {
	socket.emit('creaTablero', {minas:minas, m:m, n:n});
	console.log('Tablero señalado con: ' + minas +' '+m+n);
}
function click(x,y) {
	socket.emit('click', {x:x,y:y});
}
function mascara(x,y) {
	socket.emit('mascara', {x:x,y:y});
  return socket.on('mascara', function(data) {
		return data;
	});
	
}
/* Fin de node.js
 *
 */
function inicio() {
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
        // text += '</div></td>';
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

  actualizaCasilla : function(x,y,tipo) {
  // Pinta una casilla con un número o una mina.
		if(!this.tab[x][y]) {
			document.getElementById(''+x+'.'+y).setAttribute('class','casillaPressed');
			res = getMina(x,y)
			if (res > 0) { // Numero
				document.getElementById(''+x+'.'+y).innerHTML = res;
			} 
			if (res < 0) { // Mina
				document.getElementById(''+x+'.'+y).innerHTML = mina;
			}
			this.tab[x][y] == true
		}
	},

  relleno : function() {
  /* Recorre el tablero entero y actualiza las casillas que estan abiertas.*/

    var i,j;
    for(i=0;i<this.m;i++) {
      for(j=0;j<this.n;j++) {
        if(mascara(x,y)) this.actualizaCasilla(i,j,0);
      }
    }
  }
}

