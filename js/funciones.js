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