

document.addEventListener('DOMContentLoaded',function () {

    let url = document.location.href;
    username = url.split('?')[1].split('=')[1];


    //Inicializa las tablas del usuario
    fetch('http://localhost:5000/getPrestados',{
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({username:username})
    }).then(response => response.json())
    .then(datos => {
        loadHTMLTablePrestados(datos['datos'][0]);
        loadHTMLTableLibros(datos['datos'][1]);
    });

    

    table = document.getElementById("table-seleccion");
    tr = table.getElementsByTagName("tr");

    //Si no tiene ningun libro prestado se muestra en la tabla
    if(tr.length === 1){

        let tbody = table.getElementsByTagName("tbody")[0];

        let row = document.createElement('tr');
        row.setAttribute('class','no-datos');
        let td = document.createElement('td');
        td.setAttribute('colspan','4');
        td.textContent = 'No hay datos';

        row.appendChild(td);
        tbody.appendChild(row);


    }
});


function loadHTMLTablePrestados(datos){
    const table = document.querySelector("#table-prestados tbody");

    if(datos.length === 0){
        table.innerHTML = "<tr> <td class='no-datos' colspan = '4'>No tiene prestamos </td> </tr>";
        return;
    }
    let tableHtml = "";

    datos.forEach(function ({titulo,autor,fecha_reserva,fecha_devolucion}){
        tableHtml += '<tr>';
        tableHtml += `<td> ${titulo} </td>`;
        tableHtml += `<td> ${autor} </td>`;
        tableHtml += `<td> ${new Date(fecha_reserva).toLocaleDateString()} </td>`;
        tableHtml += `<td> ${new Date(fecha_devolucion).toLocaleDateString()} </td>`;
        tableHtml += '</td>';

    });
    table.innerHTML = tableHtml;
}


function loadHTMLTableLibros(datos){

    const table = document.querySelector('#table-libros tbody');

    if(datos.length === 0){
        table.innerHTML = "<tr class='no-datos'> <td  colspan = '4'>No Hay Datos </td> </tr>";
        return;
    }

    let tableHtml = "";

    datos.forEach(function ({codigo,titulo,autor,cantidad}){

        tableHtml += `<tr id="${codigo}">`;
        tableHtml += `<td> ${codigo} </td>`;
        tableHtml += `<td> ${titulo} </td>`;
        tableHtml += `<td> ${autor} </td>`;
        tableHtml += `<td> ${cantidad} </td>`;
        if(cantidad >= 1 ){
            tableHtml += `<td><button class ="btn-prestar" id="btn-${codigo}">Prestar</td>`;
        } 
        else{
            tableHtml += "<td> No disponible </td>";
        } 
        tableHtml += '</td>';
    });
    table.innerHTML = tableHtml;
}



document.querySelector('#table-libros tbody').addEventListener('click', function(event){
    if(event.target.className === "btn-prestar"){
        moverPrestamoPorCodigo(event.target.id.split("-")[1]);
    }
});

function moverPrestamoPorCodigo(codigo){

    let tablaSeleccion = document.getElementById("table-seleccion");

    let tr = tablaSeleccion.getElementsByTagName("tr")[1];
    
    if(tr.getAttribute('class') === "no-datos" ){
        tablaSeleccion.getElementsByTagName('tbody')[0].removeChild(tr);
    }

    let rowLibro = document.getElementById(codigo);
    rowLibro.removeChild(rowLibro.lastChild);

    --rowLibro.lastChild.textContent

    tablaSeleccion.appendChild(rowLibro);

}

//Boton de cancelar

document.getElementById('btn-cancelar').onclick = function(){  
    location.reload();
}


//Boton de confirmar
const btnConfirmar = document.getElementById('btn-confirmar');

btnConfirmar.onclick = function(){

    let tablaSeleccion = document.getElementById("table-seleccion");
    let tr = tablaSeleccion.getElementsByTagName("tr");
    
    if(tr[1].getAttribute('class') !== "no-datos" ){

        let datos = tablaSeleccion.getElementsByTagName('tr');

        let url = document.location.href;
        username = url.split('?')[1].split('=')[1];

        let codigos = [];

        for(let i =1; i<datos.length; i++){
            let tr1 = datos[i];

            let td= tr1.getElementsByTagName('td')[0];

            codigos.push(td.textContent.trim());
        }

        let body = {
            codigos:codigos,
            username :username
        };


        fetch('http://localhost:5000/createPrestados',{
            headers: {
                'Content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(body)
        }).then(response => response.json())
        .then(datos => location.reload());


    }else{
        alert('No tiene libros seleccionados para prestar');
    }

}