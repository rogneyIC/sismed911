$(function () {
    var id_maestro, dataSelect;

    var tableServiceAmb = $('#tableServiceAmb').DataTable({
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

    tableServiceAmb.on('draw', function () {
        $('.fa-clock-o').parent().css('color', 'red');
    });

    tableServiceAmb.on('select', function (e, dt, type, indexes) {
        if (type === 'row') {
            dataSelect = tableServiceAmb.rows(indexes).data();
            id_maestro = dataSelect[0].cod_casopreh;

            //Se actualiza el formulario
            $('#form_ambulance').trigger('reset');
            if (dataSelect[0].hora_asigna)
                $('#date_asig').val(dataSelect[0].hora_asigna.replace(' ', 'T'));
            if (dataSelect[0].hora_llegada)
                $('#date_lleg').val(dataSelect[0].hora_llegada.replace(' ', 'T'));
            if (dataSelect[0].hora_inicio)
                $('#date_ini').val(dataSelect[0].hora_inicio.replace(' ', 'T'));
            if (dataSelect[0].hora_destino)
                $('#date_dest').val(dataSelect[0].hora_destino.replace(' ', 'T'));
            if (dataSelect[0].hora_preposicion)
                $('#date_base').val(dataSelect[0].hora_preposicion.replace(' ', 'T'));
            $('#conductor').val(dataSelect[0].conductor);
            $('#medico').val(dataSelect[0].medico);
            $('#paramedico').val(dataSelect[0].paramedico);
            $('#obs').html(dataSelect[0].observaciones);

            $('#collapseOne').collapse('show');
        }
    });

    function crud_ajax(field, val, option) {
        if (focus_value != val) {
            $.ajax({
                url: "bd/crud.php",
                method: "POST",
                data: {
                    option: option,
                    idM: id_maestro,
                    setField: val,
                    field: field
                }
            }).done(function () {
                tableServiceAmb.ajax.reload();
            }).fail(function () {
                console.log('error');
            });
        }
    }

    $("#date_asig").focus(function () {
        focus_value = $(this).val().replace('T', ' ');
    });

    $("#date_lleg").focus(function () {
        focus_value = $(this).val().replace('T', ' ');
    });

    $("#date_ini").focus(function () {
        focus_value = $(this).val().replace('T', ' ');
    });

    $("#date_dest").focus(function () {
        focus_value = $(this).val().replace('T', ' ');
    });

    $("#date_base").focus(function () {
        focus_value = $(this).val().replace('T', ' ');
    });

    $("#conductor").focus(function () {
        focus_value = $(this).val();
    });

    $("#medico").focus(function () {
        focus_value = $(this).val();
    });

    $("#paramedico").focus(function () {
        focus_value = $(this).val();
    });

    $("#obs").focus(function () {
        focus_value = $(this).val();
    });

    $("#date_asig").focusout(function () {
        crud_ajax('hora_asigna', $(this).val().replace('T', ' '), 'updateSA');
    });

    $("#date_lleg").focusout(function () {
        crud_ajax('hora_llegada', $(this).val().replace('T', ' '), 'updateSA');
    });

    $("#date_ini").focusout(function () {
        crud_ajax('hora_inicio', $(this).val().replace('T', ' '), 'updateSA');
    });

    $("#date_dest").focusout(function () {
        crud_ajax('hora_destino', $(this).val().replace('T', ' '), 'updateSA');
    });

    $("#date_base").focusout(function () {
        crud_ajax('hora_preposicion', $(this).val().replace('T', ' '), 'updateSA');
    });

    $("#conductor").focusout(function () {
        crud_ajax('conductor', $(this).val(), 'updateSA');
    });

    $("#medico").focusout(function () {
        crud_ajax('medico', $(this).val(), 'updateSA');
    });

    $("#paramedico").focusout(function () {
        crud_ajax('paramedico', $(this).val(), 'updateSA');
    });

    $("#obs").focusout(function () {
        crud_ajax('observaciones', $(this).val(), 'updateSA');
    });

    setInterval(function () {
        tableServiceAmb.ajax.reload();
    }, 30000);
});