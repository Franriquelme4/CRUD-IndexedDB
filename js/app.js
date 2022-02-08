
//Hace que las variables esten en forma loarl
(function(){
    let DB;
    const table = document.querySelector('#listado-clientes');

document.addEventListener('DOMContentLoaded',()=>{
    crearDB();
    if (window.indexedDB.open('crm',1)) {
        listarElementos();
        
    }
    table.addEventListener('click',eliminarRegistro);
})
//Crear db
function crearDB(){
    let crearDB=window.indexedDB.open('crm',1);
    crearDB.onerror = function () {
        console.log('Hubo un error');
    }

    crearDB.onsuccess = function () {
        DB = crearDB.result;
    };
    crearDB.onupgradeneeded = function (e) {
        const db = e.target.result;

        const objectStore= db.createObjectStore('crm',{keyPath:'id',autoIncrement:true});

        objectStore.createIndex('nombre','nombre',{unique:false});
        objectStore.createIndex('email','email',{unique:true});
        objectStore.createIndex('telefono','telefono',{unique:false});
        objectStore.createIndex('empresa','empresa',{unique:false});
        objectStore.createIndex('id','id',{unique:true});
    }

}

function listarElementos() {
    const abrirConexion = window.indexedDB.open('crm',1);
    abrirConexion.onerror=(e)=>{
        console.log('Error');
    }
    abrirConexion.onsuccess=()=>{

    
        DB = abrirConexion.result;
        const objectStore = DB.transaction('crm').objectStore('crm');
        objectStore.openCursor().onsuccess= function(e){
            const cursor = e.target.result;
            if (cursor) {

                const {nombre,email,telefono,empresa,id}=cursor.value;
                table.innerHTML+=` <tr>
                <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                    <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${nombre} </p>
                    <p class="text-sm leading-10 text-gray-700"> ${email} </p>
                </td>
                <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                    <p class="text-gray-700">${telefono}</p>
                </td>
                <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
                    <p class="text-gray-600">${empresa}</p>
                </td>
                <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                    <a href="editar-cliente.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Editar</a>
                    <a href="#" data-cliente="${id}" class="text-red-600 hover:text-red-900 eliminar">Eliminar</a>
                </td>
            </tr>
        `;
        cursor.continue();
            }
        }
    }
    }
     function eliminarRegistro(e) {
         if(e.target.classList.contains('eliminar')){
             const idEliminar= e.target.dataset.cliente;
         
         //   const confirmar=confirm('Deseas eliminar este cliente');

            Swal.fire({
                title: 'Desea eliminar el registro?',
                text: "No podra ser revertido!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Confirmar'
              }).then((result) => {
                if (result.isConfirmed) {

                    const transaction =DB.transaction(['crm'],'readwrite');
                    const objectStore=transaction.objectStore('crm');
                    objectStore.delete(Number(idEliminar));
                    transaction.oncomplete=function () {
                        console.log('Eliminado correctamente');
    
                        e.target.parentElement.parentElement.remove();
                    }
                    transaction.onerror=function () {
                        console.log('Hubo un error ');
                    }
                    console.log('eliminando');

                  Swal.fire(
                    'Borrado',
                    'Su registro ha sido eliminado ',
                    'success'
                  )
                }
              })
        }
         
     }   
   

}());