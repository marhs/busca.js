/* TODO
 *  - Definir BIEN lo que devuelve click()
 *  - Cuando se gana, no permitir interactuar con el juego. 
 *  - No permitir al "cliente" acceder directamente a la matriz.
 *    * Hacer una funcion para ver si el acceso a la matriz de minas
 *      esta disponible en esa casilla (y devolver la casilla).
 */

var tablero = {
  numMinas : 0,
  n : 0,
  m : 0,
  juego: 0,
  tableroMinas : new Array(), 
	tableroMascara : new Array(),
	
	generaTablero : function(nminas,n,m) {
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
	
		//añadimos a tableroMinas los valores de las casillas
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

	click: function(x, y){
    /* Se llama a esta funcion cuando se hace click en una casilla, y se descubre lo
     * que hay abajo. Si es un cero, se comporta de manera recursiva. 
     * 
     */
    
    // Si existe una mina. 
		if(this.compruebaMina(x,y)) { 
      this.tableroMascara[x][y] = true;
      this.derrota();
      return -1;
    } else if(this.tableroMinas[x][y] == 0){
			this.tableroMascara[x][y] = true;
		 	var t;
			for(t = -1; t <= 1; t++)
			{
				var k;
				for(k = -1;k <= 1; k++)
				{
					if( x+t < this.n && y+k < this.m && x+t > -1 && y+k > -1 && this.tableroMascara[x+t][y+k] == false){
								this.click(x+t,y+k); 

						}
					}
				}
		    this.victoria();	
				return 1;
		} else {
			this.tableroMascara[x][y] = true;
      this.victoria();
			return 0;
		}

	},

  derrota : function () {
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
    document.getElementById('busca').innerHTML = '<p>Derrota :(</p>';
    // detenerJuego()
  },

  getMina : function(x,y) {
    if (tablero.tableroMascara[x][y]) return tablero.tableroMinas[x][y];
    else return null;
  },

	victoria : function() {
  /* Se considera victoria si estan abiertos todos las casillas - numMinas
   * y no se ha abierto ninguna mina. 
   * Suponemos que si se abre una mina el juego termina <- pareado. 
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
      document.getElementById('busca').innerHTML = '<p>Victoria!</p>';
    }
	}

};

var jugador = {
	id : 0,
	puntuacion : 0,
	generaJugador : function(id){
		this.id = id++;
	}

};
