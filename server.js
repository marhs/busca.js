/* TODO
 *  - Cuando se gana, no permitir interactuar con el juego. 
 */


/*  Parte de Node.js
 */

// Iniciamos el servidor, escuchando en el 8080
// Los sockets están iniciados. 
var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
server.listen(1337);


app.get('/', function(req,res) {
	res.sendfile(__dirname+'/buscaminas.html');
});

app.get('/*', function(req, res) {
	res.sendfile(__dirname+'/'+req.params[0]);
});


//  Manejo de eventos //

// Conexión iniciada
io.sockets.on('connection', function(socket) {

	console.log("Jugador conectado");
	socket.on('click', function(o) {
		io.sockets.emit('click', tablero.click(o.x,o.y));
	});
	
	socket.on('mascara', function(o) {
		socket.emit('mascara', tablero.tableroMascara[o.x][o.y]);
	});
	socket.on('getMina', function(x,y) {
		socket.emit('getMina', tablero.getMina(x,y))
	});

	socket.on('creaTablero', function(o) {
		tablero.generaTablero(o.minas,o.m,o.n);
		if (tablero.tableroMinas[0][0] == 0) {
			console.log("Tablero creado con " + o.minas + 'minas');
		} else {
			console.log("Error");
		}
	});
	
	socket.on('boton', function(data) {
		console.log("Boton recibido con: "+data);
		socket.emit('prueba', {data:'data LOCO'});
	});
});	

// No
function enviarFin(estado) {
	if (estado == false) {
		io.sockets.emit('derrota');
	} else if (estado == true) {
		io.sockets.emit('victoria');
	}
}

/*  Fin de Node.js
 */

var tablero = {
  numMinas : 0,
  n : 0,
  m : 0,
  juego: 0,
  tableroMinas : new Array(), 
	tableroMascara : new Array(),
	
	generaTablero : function(nminas,n,m) {
		console.log("Tablero generado");
		var i;
		var j;
		this.numMinas = nminas;
		this.n = n;
		this.m = m;
		for(i = 0; i<n; i++) {
			this.tableroMinas[i] = new Array();
			this.tableroMascara[i] = new Array();
		}
		
		for(i = 0; i<n; i++) //inicializamos las dos tablas, una a 0 y la otra a false
		{
			for(j = 0; j<m; j++)
			{
				this.tableroMinas[i][j] = 0;
				this.tableroMascara[i][j] = false;
			}
		}
	
		//añadimos a tableroMinas los valores dei las casillas
		for(i = 0; i< this.numMinas; i++)
		{
			var x = Math.floor(Math.random()*n);
			var y = Math.floor(Math.random()*m);
		
			while(this.compruebaMina(x,y)) //comprueba si la posición X Y tiene una mina y devuelve un boolean, por hacer
			{
				 x = Math.floor(Math.random()*n);
				 y = Math.floor(Math.random()*m);
			}
		
			//Aquí añadimos las minas y los números de las casillas de alrededor 
		
			var t,k;
			for(t = -1; t <= 1; t++) {
				for(k = -1;k <= 1; k++)	{
					if(k == 0 && t == 0) // Es la mina y es un número negativo
						this.tableroMinas[x][y] = -this.numMinas;
					else { //aumentamos el número en 1 para decir que tiene una mina alrededor
						if( x+t < n && y+k < m && x+t > -1 && y+k > -1)
							this.tableroMinas[x+t][y+k] += 1; 
					}
				}
			}
		}
	},

	compruebaMina : function(x, y) {
		return this.tableroMinas[x][y] < 0;
	},

	click: function(x, y, r){
    /* Se llama a esta funcion cuando se hace click en una casilla, y se descubre lo
     * que hay abajo. Si es un cero, se comporta de manera recursiva. 
     * 
     */

    if(r==null) {
			res = new Array();
		} else {
			res = r;
		}
		    // Si existe una mina. 
		if(this.compruebaMina(x,y)) { 
      this.tableroMascara[x][y] = true;
      //this.derrota();
			console.log('Click: ['+x+','+y+',-1]');
			res.push([x,y,-1]);
			this.derrota();
      // Llamar a la funcion derrota()
			// Devolver una lista de minas
    } else if(this.tableroMinas[x][y] == 0){
			this.tableroMascara[x][y] = true;
		 	var t;
			for(t = -1; t <= 1; t++)
			{
				var k;
				for(k = -1;k <= 1; k++)
				{
					if( x+t < this.n && y+k < this.m && x+t > -1 && y+k > -1 && this.tableroMascara[x+t][y+k] == false){
							
							var mina = [x,y,0];
							res.push(mina);	
							console.log('Click: ['+x+','+y+',0]');
							this.click(x+t,y+k,res); 

						}
					}
				}
				this.victoria();
		} else {
			this.tableroMascara[x][y] = true;
      this.victoria();
			console.log('Click: ['+x+','+y+',0]');
			res.push([x,y,this.tableroMinas[x][y]]);
		}
		return res;

	},

  derrota : function () {
	// Comprueba si el juego ha terminado. En ese caso, manda la señal fin
    if(this.juego == 0) {
      this.juego = -1;
      // TODO Hacer que se muestren todas las minas del tablero. 
      var i,j,cont;
		  for(i = 0; i<this.n; i++){
			  for(j = 0; j < this.m; j++){
		      if(this.compruebaMina(i,j)) {
            this.tableroMascara[i][j] = true;
          }
        }
      }
    }
    enviarFin(false);
  },

	victoria : function() {
  /* Se considera victoria si estan abiertos todos las casillas - numMinas
   * y no se ha abierto ninguna mina. 
   * Suponemos que si se abre una mina el juego termina <- pareado. 
	 * Si se termina el juego con victoria, se envia la señal fin.
   */
    var i,j,cont;
    cont = 0;
		for(i = 0; i<this.n; i++){
			for(j = 0; j < this.m; j++){
				if(this.tableroMascara[i][j] == true) cont++;
			}
		}
    if((this.m *this.n)-cont == this.numMinas && this.juego >= 0) {
      this.juego = 1;
			enviarFin(true);
    }
	}

};

var jugador = {
	/* No usado por ahora, se definirán una serie de jugadores dentro de un juego
	 * y esta será su clase. 
	 * TODO A implementar
	 */
	id : 0,
	puntuacion : 0,
	generaJugador : function(id){
		this.id = id++;
	}

};
