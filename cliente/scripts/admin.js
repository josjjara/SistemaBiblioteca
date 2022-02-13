
document.addEventListener('DOMContentLoaded',function () {
    fetch('http://localhost:5000/getAll')
    .then(response => response.json())
    .then(datos => loadHTMLTable(datos['datos']));
    
});

function loadHTMLTable(datos){
    const table = document.querySelector('table tbody');

    if(datos.length === 0){
        table.innerHTML = "<tr> <td class='no-datos' colspan = '4'>No Hay Datos </td> </tr>";
        return;
    }


    let tableHtml = "";
    datos.forEach(function ({codigo,titulo,autor,cantidad}){

        tableHtml += '<tr>';
        tableHtml += `<td> ${codigo} </td>`;
        tableHtml += `<td> ${titulo} </td>`;
        tableHtml += `<td> ${autor} </td>`;
        tableHtml += `<td> ${cantidad} </td>`;
        tableHtml += '</tr>';

    });
    table.innerHTML = tableHtml;
}

const addLibro = document.getElementById('agregar-btn');

addLibro.onclick = function() {
    const inputCodigo = document.getElementById("add-codigo");
    const codigo = inputCodigo.value;
    inputCodigo.value = ""

    const inputTitulo = document.getElementById('add-titulo');
    const titulo = inputTitulo.value;
    inputTitulo.value = "";

    const inputAutor = document.getElementById('add-autor');
    const autor = inputAutor.value;
    inputAutor.value ="";

    const inputCantidad = document.getElementById("add-cant");
    const cantidad = inputCantidad.value;

    inputCantidad.value = "";


    fetch('http://localhost:5000/insert',{
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({codigo:codigo, titulo:titulo, autor:autor, cantidad:cantidad})
    }).then(response => response.json())
    .then(datos => insertRowTable(datos['datos'],false));
}

function insertRowTable(datos,limpiar){
    const table = document.querySelector('table tbody');

    const hayDatos = table.querySelector('.no-datos');

    if(datos){

        if(limpiar){
            document.getElementById('ttbody').innerHTML = '';
        }

        let tableHtml= "<tr>";
            tableHtml += `<td> ${datos[0].codigo} </td>`;
            tableHtml += `<td> ${datos[0].titulo} </td>`;
            tableHtml += `<td> ${datos[0].autor} </td>`;
            tableHtml += `<td> ${datos[0].cantidad} </td>`;
            tableHtml += "</tr>";

        if(hayDatos){
           table.innerHTML = tableHtml;
        }else{
            const newRow = table.insertRow();
            newRow.innerHTML = tableHtml;
        }

    }else{
        //Caso en el que no se inserto un dato pero se actualizo la cantidad
        location.reload();
    }
}

const buscarLibro = document.getElementById("buscar-btn");
buscarLibro.onclick = function(){

    const inputCodigo = document.getElementById("busqueda-admin");
    const codigoBusqueda = inputCodigo.value;
    inputCodigo.value = "";


    fetch('http://localhost:5000/buscar',{
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({codigo:codigoBusqueda})
    }).then(response => response.json())
    .then(datos => insertRowTable(datos['datos'],true));
}


document.getElementById("busqueda-admin").addEventListener("keyup", function() {
    filtrarTabla();
  });

function filtrarTabla(){
    
    var input, filter, table, tr;
    input = document.getElementById("busqueda-admin");
    filter = input.value.toUpperCase();
    table = document.getElementById("table");
    tr = table.getElementsByTagName("tr");


    for(let i = 1; i< tr.length; i++ ){
      
      let fila = tr[i];

      let datos = fila.getElementsByTagName('td');

      if(datos[0].textContent.toUpperCase().includes(filter)  
      || datos[1].textContent.toUpperCase().includes(filter) 
      || datos[2].textContent.toUpperCase().includes(filter) 
      || datos[3].textContent.toUpperCase().includes(filter)){
        fila.style.display = '';
      }else{
        fila.style.display = 'none';
      }
    }
  }