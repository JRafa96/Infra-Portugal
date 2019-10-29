/* infraestruturasPortugal.js */


const URL_PEDIR_ESTACOES_PARTE1 = "https://www.infraestruturasdeportugal.pt/rede/estacoes/json/";
const URL_PEDIR_HORARIOS_PARTE1 = "https://www.infraestruturasdeportugal.pt/negocios-e-servicos/horarios/partidas/";
const HORA_INICIO = "T00:00:00+";
const HORA_FIM = "T23:59:59";


/* 
   "The DOMContentLoaded event fires when the initial HTML document has been completely loaded and parsed."
   "You can listen for this event on the Window interface"
   <cite>https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event</cite>
*/
window.addEventListener('DOMContentLoaded', initApp);


/* Fazemos a inicialização da aplicação neste função */
function initApp() {
    /* Seleccionar e obter uma referência para os seguintes Elementos no HTML
    	- elemento <input id="estacaoOrigem" ... >
    	- elemento <form>

     */

    var inputEstacaoOrigem = document.querySelector("#estacaoOrigem");
    var form = document.querySelector("form");


    /* Queremos dar resposta aos seguintes Eventos nos correspondentes Objectos 
    	
    	Objecto 			 Evento    	Event-Handler
    	inputEstacaoOrigem   input 	sugereEstacoes
    	form 				 submit 	procuraHorarios 	
    */

    inputEstacaoOrigem.addEventListener("input", sugereEstacoes);
    form.addEventListener("submit", procuraHorarios);


    /*
    var colTd = document.querySelectorAll("td");
	
    for( let td of colTd )
    {
    	td.addEventListener("click", function() {
    		console.log( "Click um <td>");
    	});
    }
    */


}


/* Função Event-Handler do evento 'input' no objecto <input id="estacaoOrigem"  ... > */
function sugereEstacoes() {

    /* Keyword this num event handler  
       "When a function is used as an event handler, its this is set to the element the event fired from"
       <cite>https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this</cite>
    */
    var termo = this.value;

    if (termo.length >= 2) {
        var url = URL_PEDIR_ESTACOES_PARTE1 + termo;
        getRequest(url, processaRespostaComSugestoes);

    }

}



function processaRespostaComSugestoes() {

    var listaEstacoes = JSON.parse(this.responseText);

    var datalist = document.querySelector("#estacoes");

    datalist.innerHTML = "";

    var option;

    for (let estacao of listaEstacoes) {
        option = document.createElement("option");
        option.textContent = estacao.name;
        datalist.appendChild(option);
    }

}


function procuraHorarios(e) {

    e.preventDefault();

    var inpOrigem = document.querySelector("#estacaoOrigem");
    var inpDia = document.querySelector("#dia");

    var origem = inpOrigem.value;
    var dia = inpDia.value;

    var dataEstacao = fetch(URL_PEDIR_ESTACOES_PARTE1 + origem)
        .then(res => res.json())
        .then((data) => {
            var idEstacao = data[0].id;

            var url = URL_PEDIR_HORARIOS_PARTE1 + idEstacao + "/" + dia + HORA_INICIO + dia + HORA_FIM;

            getRequest(url, processaRespostaComHorarios);
        })
        .catch(err => { throw err });
}


function processaRespostaComHorarios() {

    var lista = JSON.parse(this.responseText);

    var tbody = document.querySelector("#tbody");
    var theader = document.querySelector("#thead");


    document.getElementById('tbody').innerHTML = "";
    var header = '<tr><th>HORA</th><th colspan="2">COMBOIO</th><th>ORIGEM</th><th>DESTINO</th><th>OPERADOR</th><th>ESTADO</th></tr>';
    document.getElementById('thead').innerHTML = header;


    for (let estacao of lista.HorarioDetalhe) {
        var row = "<tr>" +
            "<td>" + estacao.HoraPartida.slice(11, 16) + "</td>" +
            "<td> <a href='https://www.google.pt'>" + estacao.ID + "</a> </td>" +
            "<td>" + estacao.Nome + "</td>" +
            "<td> <a href='https://www.google.pt'>" + estacao.EstacaoOrigem.Nome + "</a> </td>" +
            "<td> <a href='https://www.google.pt'>" + estacao.EstacaoDestino.Nome + "</a> </td>" +
            "<td>" + estacao.Operador.Nome + "</td>" +
            "<td>" + estacao.EstadoComboio.Nome + "</td>" +
            "</tr>";
        document.getElementById('tbody').insertAdjacentHTML('beforeend', row);


    }


}



function getIdEstacao(nomeEstacao) {
    idEstacao = JSON.parse(this.responseText)[0].id;
}


/* Função Auxiliar para executar Pedidos HTTP GET */
function getRequest(url, callback) {

    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.addEventListener("load", callback);
    xhr.send(null);
}