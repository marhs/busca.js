/* Frontend de buscaminas.js
 * Aqui pretendo agrupar todo el js relacionado con el frontend, dejando
 * la parte lógica en server.js (que despues se moverá al servidor)
 */

/* TODO
 * - Comentar funciones
 * - Crear opcion de poner banderas  
 */

var mina = '<img src="img/mina.png" />'
var bandera = '<img src="img/bandera.png" />'
var cliente = {
	tablero : new Array(),
	generaTablero : function() {
		// Genera el tablero del juego.
		var m = tablero.m;
		var n = tablero.n
    var i,j,text;
    doc = document.getElementById("board");
    text = '<table id="board">'
    for(i=0; i<m; i++) {
			this.tablero[i] = new Array();
      text += "<tr>";
      for(j=0; j<n; j++) {
				this.tablero[i][j] = false;
        text += '<td><a href="#" onClick="cliente.descubre('+i+','+j+')"> <div class="casilla" id="'+i+'.'+j+'" > </div></a></td>\n';
        // text += '</div></td>';
      }
      text += '</tr>\n';
    }
    text += '</table>';
    doc.innerHTML = text;

  },

  descubre : function(x,y){
    tablero.click(x,y);
    this.relleno();
  },

  actualizaCasilla : function(x,y,tipo) {
  // Pinta una casilla con un número o una mina.
		if(!this.tablero[x][y]) {
			document.getElementById(''+x+'.'+y).setAttribute('class','casillaPressed');
			res = tablero.getMina(x,y)
			if (res > 0) { // Numero
				document.getElementById(''+x+'.'+y).innerHTML = res;
			} 
			if (res < 0) { // Mina
				document.getElementById(''+x+'.'+y).innerHTML = mina;
			}
			this.tablero[x][y] == true
		}
	},

  relleno : function() {
  /* Recorre el tablero entero y actualiza las casillas que estan abiertas.*/

    var i,j;
    for(i=0;i<tablero.m;i++) {
      for(j=0;j<tablero.n;j++) {
        if(tablero.tableroMascara[i][j]) this.actualizaCasilla(i,j,0);
      }
    }
  }
}

