/** Declaracion de las variables basicas
 * Declaracion e iniciacion de las variables
 */

var board;
var score = 0;
var rows = 4;
var columns = 4;

window.onload = function() {
    setGame();// Esta función puebla la tabla con las celdas y tiene la logica del juego
    firma();// Muestra la firma y redes por consola
}

/** Recarga de la pagina
 * Recarga la pagina, desde el boton de replay, cuando aparece el game over
 */
function reload() {
    location.reload();
}

maxScoreCalculator();// Comprueba si hay una variable Score en el Local Storage

function setGame() {
    /** Matriz de juego
     * Creamos una matriz bidimensional de 4x4 con los valores 0 en todas ellas
     */
     board = [
         [0,0,0,0], // t(r0,c0), t(r0,c1), t(r0,c2), t(r0,c3)
         [0,0,0,0], // t(r1,c0), t(r1,c1), t(r1,c2), t(r1,c3)
         [0,0,0,0], // t(r2,c0), t(r2,c1), t(r2,c2), t(r2,c3)
         [0,0,0,0]  // t(r3,c0), t(r3,c1), t(r3,c2), t(r3,c3)
     ]

    /** Poblar la Matriz
     * Recorremos la matriz y creamos un elemento div por cada espacio el la matriz
     * con un id de su ubicacion en la matriz y las agregamos a el div board.
     */
    for (let r = 0; r < rows; r++) {
       for (let c = 0; c < columns; c++) {

        let tile = document.createElement("div");
        tile.id = r.toString() + "-" + c.toString();
        let num = board[r][c];
        updateTile(tile, num);// esta funcion asigna una clase segun el numero de la celda
        document.getElementById("board").append(tile);

       }
        
    }
    setTwo(); // Añade el una celda de valor 2 en un hueco vacio de la matriz 
    setTwo(); // Añade el una celda de valor 2 en un hueco vacio de la matriz 
}

/** Comprobar celdas
 * Comprueba si hay celdas vacias y si las hay retorna un TRUE y si no un FALSE
 */
function hasEmptyTile() {
    for (let r = 0; r < rows; r++) {
       for (let c = 0; c < columns; c++) {
        if (board[r][c] == 0) {
            return true;
        }
       }
        
    }
    return false;
}

/** Colocar un 2
 * Comprueba si hay celdas vacias y si las hay muestra la pantalla de gameover
 * y si ni coge una celda libre y le asigna el valor 2 en texto y con su clase
 */
function setTwo() {
    if(!hasEmptyTile()){
        document.getElementById("scoreend").innerHTML = score;
        document.getElementById("gameover").style.display = "block";
        maxScoreCalculator();
        document.getElementById("scoremax").innerHTML = maxScore;
        return;
    }

    let found = false;
    while(!found) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);

        if (board[r][c] == 0) {
            board[r][c] = 2;
            let tile = document.getElementById(r.toString()+"-"+c.toString());
            tile.innerText = "2";
            tile.classList.add("x2");
            found = true;
        }
    }

}

/** Actualizar numero de celda
 * Se le pasa como parametros la celda y el nuevo numero
 * se resetea el valor de la celda y su valor y se le añade el nuevo valor
 */
function updateTile(tile, num) {
    tile.innerHTML = "";
    tile.classList.value = "";
    tile.classList.add("tile");
    if (num > 0) {
        tile.innerText = num;
        if (num < 4096) {
            tile.classList.add("x"+num.toString());
        } else {
            tile.classList.add("x8192");
        }
    }
}

/** Asignacion de controles
 * Se signan los controles de movimiento a las flechas de movimiento del teclado
 * y cada vez que se presiona cada flecha se produce su movimiento espeficico y se
 * añade un 2 en un espacio vacio aleatorio y se actualiza el score
 */
document.addEventListener("keyup", (e) => {
    if (e.code == "ArrowLeft") {
        slideLeft();
        setTwo();
    }
    else if (e.code == "ArrowRight") {
        slideRight();
        setTwo();
    }
    else if (e.code == "ArrowUp") {
        slideUp();
        setTwo();
    }
    else if (e.code == "ArrowDown") {
        slideDown();
        setTwo();
    }
    document.getElementById("score").innerHTML = score;
})

/** Filtro de elementos vacios
 * Filtra la columna dada de paramentro de entrada en la funcion y crea un array 
 * sin 0
 */
function filterZero(row){
    return row.filter(num => num != 0);
}

/** Suma de numeros
 * Recorre el array de input de la funcion y se filtran los 0,
 * si los 2 primero numeros son numeros son iguales se suman y
 * se añade un 0 a el numero en segundo lugar, se vuelve a filtrar
 * y se añaden los 0 correspondientes en los espacios vacios, retornando
 * la fila
 */
function slide(row) {
    row = filterZero(row);

    for (let i = 0; i < row.length; i++) {
        if (row[i] == row[i+1]) {
            row[i] *= 2;
            row[i+1] = 0;
            score += row[i];
        }  
        
    }
    row = filterZero(row);

    while (row.length < columns) {
        row.push(0);
    }

    return row;
}

/** Deslizar a la izquierda
 *  Se recorre el las filas y movemos todos los valores de las celdas a la izquierda sumando valores si corresponde 
 *  y recorremos las columnas asignamos los nuevos valores a las celdas con la funcion updateTile()
 */
function slideLeft() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row = slide(row);
        board[r] = row;

        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString()+"-"+c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

/** Deslizar a la derecha
 *  Se recorre el las filas y movemos todos los valores de las celdas a la derecha usando .reverese
 *  para invertir en array de board[r] sumando valores si corresponde y recorremos las columnas
 *  asignamos los nuevos valores a las celdas con la funcion updateTile()
 */
function slideRight() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row.reverse();
        row = slide(row);
        row.reverse();
        board[r] = row;

        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString()+"-"+c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

/** Deslizar hacia arriba
 *  Se recorre el las columnas y creamos un array de los valores de cada columna y realizamos el slide
 *  de este nuevo array con los valores de cada columna, depues asignamos los valores al propio array
 *  y actualizamos las celdas de la matriz.
 */
function slideUp() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c],board[1][c],board[2][c],board[3][c]];
        row = slide(row);
        board[0][c] = row[0];
        board[1][c] = row[1];
        board[2][c] = row[2];
        board[3][c] = row[3];

        for (let r = 0; r < rows; r++) {
            let tile = document.getElementById(r.toString()+"-"+c.toString());
            let num = board[r][c];
            updateTile(tile, num);
            
        }
    }
}

/** Deslizar hacia abajo
 *  Se recorre el las columnas y creamos un array de los valores de cada columna uso .reverese
 *  para invertir en array row y realizamos el slide y volvemos a utilizar 
 *  .reverese para volverlo al original, despues asignamos los valores al propio array
 *  y actualizamos las celdas de la matriz.
 */
function slideDown() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c],board[1][c],board[2][c],board[3][c]];
        row.reverse();
        row = slide(row);
        row.reverse();
        board[0][c] = row[0];
        board[1][c] = row[1];
        board[2][c] = row[2];
        board[3][c] = row[3];

        for (let r = 0; r < rows; r++) {
            let tile = document.getElementById(r.toString()+"-"+c.toString());
            let num = board[r][c];
            updateTile(tile, num);
            
        }
    }
}

//Guardar Score en el Local Storage

var maxScore = localStorage.getItem('Score');

function maxScoreCalculator() {
    if (localStorage.getItem('Score') == null){
        localStorage.setItem('Score', 0);
    }else{
        if (score > localStorage.getItem('Score')) {// comparar score de la partida con el del localStorage
            maxScore = score;
            localStorage.setItem('Score', maxScore);

            document.querySelector("#trophy").style.display = "block";// Muestra una copa si hay un nuevo score mas alto
        }

    }

}


function autoplay() {
    moveLeft()
    moveUp()
    moveRight()
    moveDown()
}

function moveRight() {
    slideRight();
    document.getElementById("score").innerHTML = score;
    setTwo();

}

function moveLeft() {
    slideLeft();
    document.getElementById("score").innerHTML = score;
    setTwo();
}

function moveUp() {
    slideUp();
    document.getElementById("score").innerHTML = score;
    setTwo();
}

function moveDown() {
    slideDown();
    document.getElementById("score").innerHTML = score;
    setTwo();
}

  
// Muestra la firma y redes por consola
  
function firma() {
    console.log("%c Bienvenid@ a mi juego", "background: #ff8906; border-radius:12%;color:#fffffe;padding: 2em;font-size: 2em;");
    console.log("%c No olvides vistar mi pagina: https://rodrigosendinosanz.github.io/", "color:#e53170;padding: 1.5em;font-size: 2em;background: grey;"); 
    console.log("%c y seguirme en redes:", "color:#gold;padding: 1.5em;font-size: 1.5em;"); 
    console.log("%c Instagram: https://www.instagram.com/rodrigosendinosanz/", "color:#405DE6;padding: 1em;font-size: 1em;background:grey;");
    console.log("%c Twitter: https://twitter.com/rodrigosendino", "color:#1DA1F2;padding: 1em;font-size: 1em;background: grey;;");
    console.log("%c Linkedin: https://www.linkedin.com/in/rodrigo-sendino-sanz-27a3a0100/", "color:#0e76a8;padding: 1em;font-size: 1em;background:grey;");
    console.log("%c Github: https://github.com/RodrigoSendinoSanz", "color:#211F1F;padding: 1em;font-size: 1em;background: grey;");
    console.log("%c by Rodrigo Sendino Sanz", "color:gold;padding: 1em;font-size: 1.5em;");
    console.log("%c                     @@@@@@@                     ","color:gold;padding: -1em;font-size: 1.5em;");
    console.log("%c             @...@@           @@...@             ","color:gold;padding: -1em;font-size: 1.5em;");
    console.log("%c        @..@                       @..@         ","color:gold;padding: -1em;font-size: 1.5em;");
    console.log("%c     @..        @..@    /.@   @@..@      ..@      ","color:gold;padding: -1em;font-size: 1.5em;");
    console.log("%c   @.@     @.@         /.@         *.#    @.@    ","color:gold;padding: -1em;font-size: 1.5em;");
    console.log("%c  .@    ,.@            /.@            .@    (.   ","color:gold;padding: -1em;font-size: 1.5em;");
    console.log("%c  %..@ .@              /.@              .@   @.@ ","color:gold;padding: -1em;font-size: 1.5em;");
    console.log("%c       @...@           /.@               @@   @.@","color:gold;padding: -1em;font-size: 1.5em;");
    console.log("%c           @....%      /.@                .@   @.","color:gold;padding: -1em;font-size: 1.5em;");
    console.log("%c               &....@  /.&                 .    .","color:gold;padding: -1em;font-size: 1.5em;");
    console.log("%c@.... (.............@ @...*    ..............  ...","color:gold;padding: -1em;font-size: 1.5em;");
    console.log("%c@.    @&                /./....%                  ","color:gold;padding: -1em;font-size: 1.5em;");
    console.log("%c .@    .                /./   &....@              ","color:gold;padding: -1em;font-size: 1.5em;");
    console.log("%c @.     .               /./        @...@          ","color:gold;padding: -1em;font-size: 1.5em;");
    console.log("%c  @.&    .@             /./            @..@       ","color:gold;padding: -1em;font-size: 1.5em;");
    console.log("%c    .@     .@           /./            .@  @...   ","color:gold;padding: -1em;font-size: 1.5em;");
    console.log("%c     @.@     @.@        /./         ..     @.@    ","color:gold;padding: -1em;font-size: 1.5em;");
    console.log("%c       @./       @..@@  /./   @...@      ..@      ","color:gold;padding: -1em;font-size: 1.5em;");
    console.log("%c          @..@                       @..@         ","color:gold;padding: -1em;font-size: 1.5em;");
    console.log("%c              @...@#           @@...@             ","color:gold;padding: -1em;font-size: 1.5em;");

  }
