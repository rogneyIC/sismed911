$(function () {
    var selectServiceAmb = $('#selectServiceAmb').DataTable({
        select: 'single',
        pageLength: 5,
        language: {
            select: {
                rows: {
                    _: "",
                    0: "",
                    1: ""
                }
            },
            sProcessing: "Procesando...",
            sLengthMenu: "Mostrar _MENU_ registros",
            sZeroRecords: "No se encontraron resultados",
            sEmptyTable: "Ningún dato disponible en esta tabla",
            sInfo: "Mostrando _START_ al _END_ de _TOTAL_",
            sInfoEmpty: "Mostrando 0 al 0 de 0 registros",
            sInfoFiltered: "(filtrado de un total de _MAX_ registros)",
            sSearch: "Buscar:",
            sLoadingRecords: "Cargando...",
            oPaginate: {
                sFirst: "Primero",
                sLast: "Último",
                sNext: "Siguiente",
                sPrevious: "Anterior"
            }
        },
        "ajax": {
            "url": "bd/crud.php",
            "method": 'POST',
            "data": { option: 'selectServiceAmb' },
            "dataSrc": ""
        },
        deferRender: true,
        "columns": [
            { "data": "cod_casopreh" },
            { "data": "fecha" },
            { "data": "nombre_es" },
            { "defaultContent": "" },
            { "data": "cod_ambulancia" },
            { "data": "hora_asigna" },
            { "data": "hora_llegada" },
            { "data": "hora_inicio" },
            { "data": "hora_destino" },
            { "data": "hora_preposicion" },
            { "data": "preposicion" }
        ],
        "columnDefs": [
            {
                "render": function (data, type, row) {
                    var diff = Math.abs(new Date() - new Date(row.fecha));
                    var minutes = Math.floor((diff / 1000) / 60);
                    return '<i class="fa fa-clock-o" aria-hidden="true"></i> ' + minutes + ' MIN';
                },
                "targets": 3
            }
        ],
        //rowId: 'extn',
        dom: 'Bfrtip'
    });

    selectServiceAmb.on('draw', function () {
        $('.fa-clock-o').parent().css('color', 'red');
    });

    selectServiceAmb.on('select', function (e, dt, type, indexes) {
        if (type === 'row') {
            $('#collapseOne').collapse('show');
        }
    });

    setInterval(function () {
        selectServiceAmb.ajax.reload();
    }, 30000);
});