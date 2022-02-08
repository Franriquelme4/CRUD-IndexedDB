(function () {
    let DB;
    const formulario = document.querySelector('#formulario');
    document.addEventListener('DOMContentLoaded', () => {
        conectarDB();

        formulario.addEventListener('submit', validarCliente);
    })


    function validarCliente(e) {
        e.preventDefault();

        console.log('Validando');

        const nombre = document.querySelector('#nombre').value;
        const email = document.querySelector('#email').value;
        const telefono = document.querySelector('#telefono').value;
        const empresa = document.querySelector('#empresa').value;
        if (nombre === '' || email === '' || telefono === '' || empresa === '') {
            imprimirAlerta('Todos los campos son obligatorios', 'error')
            console.log('error');
            return;
        }

        //Crear un objeto con la info
        const Cliente = { nombre, email, telefono, empresa ,id:Date.now()};

        crearNuevoCliente(Cliente);


    }
    function crearNuevoCliente(cliente) {
        const transaction=DB.transaction(['crm'],'readwrite');
        const objectStore=transaction.objectStore('crm');
        objectStore.add(cliente);
        transaction.onerror=()=>{
            imprimirAlerta('Hubo un error','error');
        }
        transaction.oncomplete=()=>{
            imprimirAlerta('Se agrego correctamente');
            setTimeout(() => {
                window.location.href ='index.html'
            }, 3000);
        }
    }
    function listarElementos() {
        const table = document.querySelector('#listado-clientes');
        const objectStore = DB.transaction('crm').objectStore('crm');

        const total = objectStore.count();
        total.onsuccess = function(){
            objectStore.openCursor().onsuccess= function(e){
                const cursor = e.target.result;
                if (cursor) {
                    const {nombre,email,telefono,empresa}=cursor.value;
                    const trCliente = document.createElement('tr');
                    trCliente.dataset.id=id;
                    const thNombre=document.createElement('th');
                    thNombre.innerHTML=`${nombre}`;

                    const thEmail=document.createElement('th');
                    thEmail.innerHTML=`${email}`;

                    const thTelefono=document.createElement('th');
                    thTelefono.innerHTML=`${telefono}`;

                    const thEmpresa=document.createElement('th');
                    thEmpresa.innerHTML=`${empresa}`;
                    trCliente.appendChild(thNombre);
                    trCliente.appendChild(thEmail);
                    trCliente.appendChild(thTelefono);
                    trCliente.appendChild(thEmpresa);
                    table.appendChild(trCliente);
                    cursor.continue();
                }
            }
        }
        
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