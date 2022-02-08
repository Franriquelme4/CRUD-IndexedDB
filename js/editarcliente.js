(function () {
    let DB;
    let idCliente;
    const nombreForm=document.querySelector('#nombre');
    const emailForm=document.querySelector('#email');
    const telefonoForm=document.querySelector('#telefono');
    const empresaForm=document.querySelector('#empresa');
    const formulario = document.querySelector('#formulario');
    
    document.addEventListener('DOMContentLoaded',()=>{

        //actualiza el formulario
        formulario.addEventListener('submit',actualizarCliente);
        //verificar el id de la url
        conectarDB();
        const parametrosURL= new URLSearchParams(window.location.search);
        idCliente=parametrosURL.get('id');
        if (idCliente) {
            setTimeout(() => {
                
                obtenerCliente(idCliente);
            }, 1000);
        }

    })
    function actualizarCliente(e) {
        e.preventDefault();
        if (nombreForm === '' || emailForm === '' || telefonoForm === '' || empresaForm === '') {
            imprimirAlerta('Todos los campos son obligatorios', 'error')
            console.log('error');
            return;
        }
        const clienteActualizado ={
            nombre:nombreForm.value,
            email:emailForm.value,
            telefono:telefonoForm.value,
            empresa:empresaForm.value,
            id:Number(idCliente)
        }
console.log(clienteActualizado);
const transaction= DB.transaction(['crm'],'readwrite');
const objectStore=transaction.objectStore('crm');
objectStore.put(clienteActualizado);

transaction.oncomplete=function () {
    imprimirAlerta('Editado Correctamente');
    setTimeout(() => {
        window.location.href='index.html';
    }, 3000);
};
transaction.onerror=function () {
    imprimirAlerta('Hubo un error','error')
    
}

    }
    function obtenerCliente(id) {
        const transaction =DB.transaction(['crm'],'readwrite');
        const objectStore= transaction.objectStore('crm');
        const cliente= objectStore.openCursor();
        cliente.onsuccess = function (e) {
            const cursor = e.target.result;
            if (cursor) {
               // console.log(cursor.value);
                if (cursor.value.id===Number(id)) {

                    console.log(cursor.value);
                    llenarFormulario(cursor.value);
                }
                cursor.continue();
            }
        }
        
    }
    function llenarFormulario(datos) {
        const {nombre,email,telefono,empresa}=datos;
        nombreForm.value=nombre;
        emailForm.value=email;
        telefonoForm.value=telefono;
        empresaForm.value=telefono;

    }
    function conectarDB() {
        const abrirDB = window.indexedDB.open('crm', 1);
        abrirDB.onerror = function () {
            console.log('Hubo un error');
        }
    
        abrirDB.onsuccess = function () {
            DB = abrirDB.result;
        };
    }
     function imprimirAlerta(mensaje, tipo) {
    
        const alerta = document.querySelector('.alerta');
    
        if (!alerta) {
    
            const divMensaje = document.createElement('div');
            divMensaje.classList.add('px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center', 'border', 'alerta');
            if (tipo === 'error') {
                divMensaje.classList.add('bg-red-100', 'border-red-100', 'text-red-700');
            } else {
                divMensaje.classList.add('bg-green-100', 'border-green-100', 'text-green-700');
            }
            divMensaje.textContent = mensaje;
            formulario.appendChild(divMensaje);
            setTimeout(() => {
                divMensaje.remove();
            }, 3000);
        }
    }
  
 
})();