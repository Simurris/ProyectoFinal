/**
 * 3 tipos de variables en JS
 * let --> decladar valor pero NO puede volver a cambiar
 * var
 * const
 */

/**DECLARACION DE VARIABLES */
let chart = null;
let skipEvery = 2;
computeAndGraph(3); /* Reconectar datos y gráficarlos -propiedad de la librería*/

let inputs = document.getElementsByClassName("inputs"); /* Creamos inputs, accede al  elemento inputs de HTML */
for (let i = 0; i < inputs.length; i++) {
  inputs[i].addEventListener("input", eventHandler); 
}

function eventHandler(event) {  /* Función */
  let R0 = (
    Number(document.getElementById("beta").value) / /* .value--> extrae valor */
    Number(document.getElementById("alpha").value)
  ).toFixed(2);/*Redondeo (N)--> Num de decimales*/

  if (event.target.id == "alpha") {  /* Si esta interactuando con el elemento alpha */
    document.getElementById("alphaText").innerHTML = event.target.value;   /*innerHTML--> ingresa a la variable alpatext y agrega contenido extra al original*/
  }
  if (event.target.id == "beta") {
    document.getElementById("betaText").innerHTML = event.target.value; // innerHTML --> Devuelve sintaxis HTML describiendo los descendentes del elemento
  }
  document.getElementById("R0Text").innerHTML = "R0 =" + R0;

  computeAndGraph(R0); /* Llama la funcion */
}

function computeAndGraph(R0) {
  /**ENTRAMOS AL ELEMENTO X SU ID */
  let alpha = Number(document.getElementById("alpha").value); 
  let beta = Number(document.getElementById("beta").value);
  let I0 = Number(document.getElementById("I0").value);
  let N = Number(document.getElementById("N").value);
  let delT = Number(document.getElementById("delT").value);
  let maxTime = Number(document.getElementById("maxTime").value);

  if (delT == 0) return;
  /**DESDE AQUI EMPIEZA LA LOGICA */
  let I_ar = [];
  let S_ar = [];
  let R_ar = [];
  let t_ar = [];

  let I = I0;
  let S = N;
  let R = 0;

  /** contador */
  let counter = 0;

  for (let t = 0; t <= maxTime; t += delT) {
    let delS = ((-beta * S * I) / N) * delT; /**formula 1 */
    let delI = ((beta * S * I) / N) * delT - alpha * I * delT; /**formula 2 */
    let delR = alpha * I * delT; /**formula 3 */

    S += delS; /**concatenacion */
    I += delI; /**concatenacion */
    R += delR; /**concatenacion */

    if (counter % skipEvery == 0) { 
      I_ar.push(I);
      S_ar.push(S);
      R_ar.push(R);
      t_ar.push(Number(t.toFixed(2))); /*redondea*/
    }
    counter++;
  }

  /**AQUI TERMINA LA LOGICA */

  // GRAFICAS /
  drawChart(
    {
      t: t_ar,
      I: I_ar,
      S: S_ar,
      R: R_ar,
    },
    N,
    R0
  );
}

function drawChart(output, y0, R0) {
  var ctx = document.getElementById("chart").getContext("2d");
  if (chart != undefined) {
    chart.destroy(); /* Destruye los elementos */
  }
  chart = new Chart(ctx, {
    type: "line", /**tipo de grafica que es de tipo linea */
    data: {
      labels: output.t, /* Accedemos a el elemento t, del output (lista).-->accedemos*/
      
      datasets: [
        {
          label: "Infectados" /**ETIQUETA */,
          data: output.I /**RESULTADO DEL CALCULO */,
          borderColor: ["rgba(255, 99, 50, 1)"] /**COLOR DE LA LINEA */,
          borderWidth: 1 /**ESTILOS */,
          fill: false /** sombreado */,
          pointRadius: 2, /**PUNTITOS */
        },
        {
          label: "Sucebtibles",
          data: output.S,
          borderColor: ["rgba(99, 255, 132, 1)"],
          borderWidth: 1,
          fill: false,
          pointRadius: 2,
        },
        {
          label: "Recuperados",
          data: output.R,
          borderColor: ["rgba(99, 132, 255, 1)"],
          borderWidth: 1,
          fill: false,
          pointRadius: 2,
        },
      ],
    },
    options: {
      scales: {
        /**eje de la Y */
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              max: y0,
            },
            scaleLabel: {
              display: true,
              labelString: "Poblaci"+"\u00F3"+"n",
            },
          },
        ],
        /**eje de las X */
        xAxes: [
          {
            ticks: {
              autoSkip: true,
              maxTicksLimit: 30, //valores de x
            },
            scaleLabel: {
              display: true,
              labelString: "Tiempo",
            },
          },
        ],
      },
      /**titulo de la grafica */
      title: {
        display: true, // true para mostrar el titulo
        text: "Modelo epidemiol"+"\u00F3"+"gico CDMX",
      },
      maintainAspectRatio: true, //gráfica se acomoda a la medida de dispositivo del usuario
      /**responsivo a la pantalla, ancho */
      responsive: true,
    },
  });
}
