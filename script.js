let juegoActivo = false;
let banderaActivada = false;
const numBombas = 20;
let contadorCorectas = 0;
let winCondition = false;

// crear el tablero
const tablero = document.getElementById("tablero");
const numCasillas = 144;

for (let i = 0; i < numCasillas; i++) {
  const casilla = document.createElement("div");
  casilla.classList.add("casilla");
  casilla.id = `${i}`;

  tablero.appendChild(casilla);
}

// crear las bombas
const botonEmpezar = document.getElementById("empezar");
const casillas = document.querySelectorAll(".casilla");
const botonBandera = document.getElementById("bandera");

botonBandera.addEventListener("click", () => {
  banderaActivada = !banderaActivada;
  banderaActivada
    ? botonBandera.classList.add("banderaUsada")
    : botonBandera.classList.remove("banderaUsada");
});

botonEmpezar.addEventListener("click", () => {
  const bombas = arrayBombas(numBombas);
  funcionEmpezar(bombas);
  console.log("Bombas:", bombas);
  juegoActivo = true;
});

casillas.forEach((casilla) => {
  casilla.addEventListener("click", () => {
    if (juegoActivo) {
      if (banderaActivada) {
        desactivarBomba(casilla);
      } else {
        calcularCantidadBombasAlrededor(casilla);
      }
    }
    comprobarCorrectas(casilla);
  });
});

function arrayBombas(numBombas) {
  const arrayBombas = [];

  for (let i = 0; i < numBombas; i++) {
    let casilla;
    do {
      casilla = Math.floor(Math.random() * numCasillas);
    } while (arrayBombas.includes(casilla));
    arrayBombas.push(casilla);
  }
  return arrayBombas;
}

function funcionEmpezar(bombas) {
  juegoActivo = true;
  casillas.forEach((casilla) => {
    const idCasilla = parseInt(casilla.id);
    casilla.classList.add("start");
    if (bombas.includes(idCasilla)) {
      casilla.classList.add("bomba");
      casilla.innerHTML = "💣";
    }
  });
}

function descubrirCasilla(casilla) {
  casilla.classList.add("descubierta");
  const idCasilla = parseInt(casilla.id);
  let bombasAlrededor = 0;
  const casillasAlrededor = [
    idCasilla - 13,
    idCasilla - 12,
    idCasilla - 11,
    idCasilla - 1,
    idCasilla + 1,
    idCasilla + 11,
    idCasilla + 12,
    idCasilla + 13,
  ];
  casillasAlrededor.forEach((casillaAlrededor) => {
    if (casillaAlrededor >= 0 && casillaAlrededor < numCasillas) {
      if (casillas[casillaAlrededor].classList.contains("bomba")) {
        bombasAlrededor++;
      }
    }
  });
  if (bombasAlrededor === 0) {
    casilla.innerHTML = "";
  } else {
    casilla.innerHTML = bombasAlrededor;
  }

  if (bombasAlrededor === 0) {
    casillasAlrededor.forEach((casillaAlrededor) => {
      if (casillaAlrededor >= 0 && casillaAlrededor < numCasillas) {
        const casillaVecina = casillas[casillaAlrededor];
        if (!casillaVecina.classList.contains("descubierta")) {
          descubrirCasilla(casillaVecina);
        }
      }
    });
  }
}

function calcularCantidadBombasAlrededor(casilla) {
  const idCasilla = parseInt(casilla.id);

  console.log(idCasilla);

  if (casilla.classList.contains("bomba")) {
    bombasAlrededor = 0;
    alert("has pisado bomba 💣 fin del juego");
    return;
  }

  if (!casilla.classList.contains("bomba")) {
    descubrirCasilla(casilla);
  }
}

function desactivarBomba(casilla) {
  if (!casilla.classList.contains("bandera")) {
    casilla.classList.add("bandera");
    casilla.innerHTML = "🚩";
    banderaActivada = false;
    botonBandera.classList.remove("banderaUsada");
  } else if (casilla.classList.contains("bandera")) {
    casilla.classList.remove("bandera");
    casilla.innerHTML = "";
  }
}

function comprobarCorrectas(casilla) {
  if (casilla.classList.contains("bomba")) {
    if (casilla.classList.contains("bandera")) {
      contadorCorectas++;
    } else {
      contadorCorectas--;
    }
    console.log("Casillas correctas:", contadorCorectas);
  }
  if (contadorCorectas === numBombas) {
    alert("Has ganado");
    winCondition = true;
  }
}
