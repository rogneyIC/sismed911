$(document).ready(function () {
    var id_maestro_interh, id_paciente_interh, id_eval_interh, focus_value_interh, dataSelect_interh;

    var tableMaestroInterh = $('#tableMaestroInterh').DataTable({
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
            "data": { option: 'selectInterhMaestro' },
            "dataSrc": ""
        },
        deferRender: true,
        "columns": [
            { "data": "cod_casointerh" },
            { "data": "fechahorainterh" },
            { "defaultContent": "" },
            { "data": "nombre_tiposervicion_es" },
            { "data": "nombre_hospital" },
            { "data": "nombre_hospital_destino" },
            { "data": "prioridadinterh" },
            { "data": "nombre_accion_es" },
            { "defaultContent": '<button type="button" class="btn btn-light" data-toggle="modal" data-target="#modalR"><i class="fa fa-times-circle" aria-hidden="true"></i></button>' }
        ],
        "columnDefs": [
            {
                "render": function (data, type, row) {
                    var diff = Math.abs(new Date() - new Date(row.fechahorainterh));
                    var minutes = Math.floor((diff / 1000) / 60);
                    return minutes;
                },
                "targets": 2
            }
        ],
        //rowId: 'extn',
        dom: 'Bfrtip'
    });

    tableMaestroInterh.on('select', function (e, dt, type, indexes) {
        if (type === 'row') {
            dataSelect_interh = tableMaestroInterh.rows(indexes).data();
            id_maestro_interh = dataSelect_interh[0].cod_casointerh;
            id_paciente_interh = dataSelect_interh[0].id_paciente;
            id_eval_interh = dataSelect_interh[0].id_evaluacionclinica;

            //Se actualiza formulario paciente
            $('#form_paciente').trigger('reset');
            $('#p_number').val(dataSelect_interh[0].num_doc);
            $('#p_exp').val(dataSelect_interh[0].expendiente);
            $("#p_date").val(dataSelect_interh[0].fecha_nacido);
            $('#p_age').val(dataSelect_interh[0].edad);
            $('#p_typeage').val(dataSelect_interh[0].nombre_edad);
            if (dataSelect_interh[0].genero == 1) {
                $('#p_genM').prop('checked', true);
            } else {
                $('#p_genF').prop('checked', true);
            }
            $('#p_phone').val(dataSelect_interh[0].telefono_paciente);
            $('#p_name1').val(dataSelect_interh[0].nombre1);
            $('#p_name2').val(dataSelect_interh[0].nombre2);
            $('#p_lastname1').val(dataSelect_interh[0].apellido1);
            $('#p_lastname2').val(dataSelect_interh[0].apellido2);
            $('#p_segS').val(dataSelect_interh[0].aseguradro);
            $('#p_address').val(dataSelect_interh[0].direccion_paciente);
            $('#p_obs').html(dataSelect_interh[0].observacion_paciente);
            $.ajax({
                url: "bd/crud.php",
                method: "POST",
                data: {
                    option: 'selectIDE',
                },
                dataType: 'json'
            }).done(function (data) {
                $("#p_ide").empty();
                $("#p_ide").append($("<option>", {
                    value: 0,
                    text: "Seleccione..."
                }));
                $.each(data, function (index, value) {
                    $("#p_ide").append($("<option>", {
                        value: index + 1,
                        text: value.descripcion
                    }));
                    if (dataSelect_interh[0].ide_descripcion == value.descripcion) {
                        $('#p_ide option[value=' + (index + 1) + ']').attr('selected', true);
                    }
                });
            }).fail(function () {
                console.log('error');
            });

            //Se actualiza formulario evaluación clínica
            $('#form_evalClinic').trigger('reset');
            $.ajax({
                url: "bd/crud.php",
                method: "POST",
                data: {
                    option: 'selectTriage',
                },
                dataType: 'json'
            }).done(function (data) {
                $("#ec_triage").empty();
                $("#ec_triage").append($("<option>", {
                    value: 0,
                    text: "Seleccione..."
                }));
                $.each(data, function (index, value) {
                    $("#ec_triage").append($("<option>", {
                        value: index + 1,
                        text: value.nombre_triage_es
                    }));
                    if (dataSelect_interh[0].triage == value.id_triage) {
                        $('#ec_triage option[value=' + (index + 1) + ']').attr('selected', true);
                    }
                });
            }).fail(function () {
                console.log('error');
            });
            $('#ec_ta').val(dataSelect_interh[0].sv_tx);
            $('#ec_fc').val(dataSelect_interh[0].sv_fc);
            $('#ec_fr').val(dataSelect_interh[0].sv_fr);
            $('#ec_temp').val(dataSelect_interh[0].sv_temp);
            $('#ec_gl').val(dataSelect_interh[0].sv_gl);
            $('#ec_sato2').val(dataSelect_interh[0].sv_sato2);
            $('#ec_gli').val(dataSelect_interh[0].sv_gli);
            $('#ec_talla').val(dataSelect_interh[0].talla);
            $('#ec_peso').val(dataSelect_interh[0].peso);
            $('#ec_cie10').val(dataSelect_interh[0].cod_diag_cie + " " + dataSelect_interh[0].cie10_diagnostico);
            $('#ec_cuadro').html(dataSelect_interh[0].c_clinico);
            $('#ec_examen').html(dataSelect_interh[0].examen_fisico);
            $('#ec_antec').html(dataSelect_interh[0].antecedentes);
            $('#ec_parac').html(dataSelect_interh[0].paraclinicos);
            $('#ec_tratam').html(dataSelect_interh[0].tratamiento);
            $('#ec_inform').html(dataSelect_interh[0].diagnos_txt);

            //Se actualiza formulario hospital
            $('#form_hospital').trigger('reset');
            $('#hosp_dest').val(dataSelect_interh[0].hospital_destinointerh + " " + dataSelect_interh[0].nombre_hospital_destino);
            $('#hosp_nomMed').val(dataSelect_interh[0].nombre_medico);
            $('#hosp_telMed').val(dataSelect_interh[0].telefono_maestro);

            $('fieldset').prop('disabled', false);
            $('.cie10_search').prop('disabled', false);
            $('.hosp_search').prop('disabled', false);
        }
    });

    function crud_ajax(field, val, option) {
        if (focus_value_interh != val) {
            $.ajax({
                url: "bd/crud.php",
                method: "POST",
                data: {
                    option: option,
                    idM: id_maestro_interh,
                    idP: id_paciente_interh,
                    idEC: id_eval_interh,
                    setField: val,
                    field: field
                }
            }).done(function () {
                tableMaestroInterh.ajax.reload();
            }).fail(function () {
                console.log('error');
            });
        }
    }

    //formulario paciente
    $("#p_number").focus(function () {
        focus_value_interh = $(this).val();
    });

    $("#p_exp").focus(function () {
        focus_value_interh = $(this).val();
    });

    $("#p_date").focus(function () {
        focus_value_interh = $(this).val();
    });

    $("#p_age").focus(function () {
        focus_value_interh = $(this).val();
    });

    $("#p_phone").focus(function () {
        focus_value_interh = $(this).val();
    });

    $("#p_name1").focus(function () {
        focus_value_interh = $(this).val();
    });

    $("#p_name2").focus(function () {
        focus_value_interh = $(this).val();
    });

    $("#p_lastname1").focus(function () {
        focus_value_interh = $(this).val();
    });

    $("#p_lastname2").focus(function () {
        focus_value_interh = $(this).val();
    });

    $("#p_segS").focus(function () {
        focus_value_interh = $(this).val();
    });

    $("#p_address").focus(function () {
        focus_value_interh = $(this).val();
    });

    $("#p_obs").focus(function () {
        focus_value_interh = $(this).val();
    });

    $("#p_ide").on('change', function () {
        var val = $('#p_ide option:selected').text();
        crud_ajax('tipo_doc', val, 'updateP');
    });

    $("#p_number").focusout(function () {
        var val = $(this).val();
        crud_ajax('num_doc', val, 'updateP');
    });

    $("#p_exp").focusout(function () {
        var val = $(this).val();
        crud_ajax('expendiente', val, 'updateP');
    });

    $("#p_date").focusout(function () {
        var val = $(this).val();
        crud_ajax('fecha_nacido', val, 'updateP');
    });

    $("#p_age").focusout(function () {
        var val = $(this).val();
        crud_ajax('edad', val, 'updateP');
    });

    $(".form-check-input").on('click', function () {
        val = $("input:checked").val();
        if ((dataSelect_interh[0].genero == 1 && val == 'f') || (dataSelect_interh[0].genero == 2 && val == 'm')) {
            dataSelect_interh[0].genero == 1 ? crud_ajax('genero', 2, 'updateP') : crud_ajax('genero', 1, 'updateP');
        }
    });

    $("#p_phone").focusout(function () {
        var val = $(this).val();
        crud_ajax('telefono', val, 'updateP');
    });

    $("#p_name1").focusout(function () {
        var val = $(this).val();
        crud_ajax('nombre1', val, 'updateP');
    });

    $("#p_name2").focusout(function () {
        var val = $(this).val();
        crud_ajax('nombre2', val, 'updateP');
    });

    $("#p_lastname1").focusout(function () {
        var val = $(this).val();
        crud_ajax('apellido1', val, 'updateP');
    });

    $("#p_lastname2").focusout(function () {
        var val = $(this).val();
        crud_ajax('apellido2', val, 'updateP');
    });

    $("#p_segS").focusout(function () {
        var val = $(this).val();
        crud_ajax('aseguradro', val, 'updateP');
    });

    $("#p_address").focusout(function () {
        var val = $(this).val();
        crud_ajax('direccion', val, 'updateP');
    });

    $("#p_obs").focusout(function () {
        var val = $(this).val();
        crud_ajax('observacion', val, 'updateP');
    });

    //formulario evaluación clínica
    $("#ec_ta").focus(function () {
        focus_value_interh = $(this).val();
    });

    $("#ec_fc").focus(function () {
        focus_value_interh = $(this).val();
    });

    $("#ec_fr").focus(function () {
        focus_value_interh = $(this).val();
    });

    $("#ec_temp").focus(function () {
        focus_value_interh = $(this).val();
    });

    $("#ec_gl").focus(function () {
        focus_value_interh = $(this).val();
    });

    $("#ec_sato2").focus(function () {
        focus_value_interh = $(this).val();
    });

    $("#ec_gli").focus(function () {
        focus_value_interh = $(this).val();
    });

    $("#ec_talla").focus(function () {
        focus_value_interh = $(this).val();
    });

    $("#ec_peso").focus(function () {
        focus_value_interh = $(this).val();
    });

    $("#ec_cuadro").focus(function () {
        focus_value_interh = $(this).val();
    });

    $("#ec_examen").focus(function () {
        focus_value_interh = $(this).val();
    });

    $("#ec_antec").focus(function () {
        focus_value_interh = $(this).val();
    });

    $("#ec_parac").focus(function () {
        focus_value_interh = $(this).val();
    });

    $("#ec_tratam").focus(function () {
        focus_value_interh = $(this).val();
    });

    $("#ec_inform").focus(function () {
        focus_value_interh = $(this).val();
    });

    $("#ec_triage").on('change', function () {
        var val = $('#ec_triage option:selected').text();
        crud_ajax('triage', val, 'updateInterhEC');
    });

    $("#ec_ta").focusout(function () {
        var val = $(this).val();
        crud_ajax('sv_tx', val, 'updateInterhEC');
    });

    $("#ec_fc").focusout(function () {
        var val = $(this).val();
        crud_ajax('sv_fc', val, 'updateInterhEC');
    });

    $("#ec_fr").focusout(function () {
        var val = $(this).val();
        crud_ajax('sv_fr', val, 'updateInterhEC');
    });

    $("#ec_temp").focusout(function () {
        var val = $(this).val();
        crud_ajax('sv_temp', val, 'updateInterhEC');
    });

    $("#ec_gl").focusout(function () {
        var val = $(this).val();
        crud_ajax('sv_gl', val, 'updateInterhEC');
    });

    $("#ec_sato2").focusout(function () {
        var val = $(this).val();
        crud_ajax('sv_sato2', val, 'updateInterhEC');
    });

    $("#ec_gli").focusout(function () {
        var val = $(this).val();
        crud_ajax('sv_gli', val, 'updateInterhEC');
    });

    $("#ec_talla").focusout(function () {
        var val = $(this).val();
        crud_ajax('talla', val, 'updateInterhEC');
    });

    $("#ec_peso").focusout(function () {
        var val = $(this).val();
        crud_ajax('peso', val, 'updateInterhEC');
    });

    $("#ec_cuadro").focusout(function () {
        var val = $(this).val();
        crud_ajax('c_clinico', val, 'updateInterhEC');
    });

    $("#ec_examen").focusout(function () {
        var val = $(this).val();
        crud_ajax('examen_fisico', val, 'updateInterhEC');
    });

    $("#ec_antec").focusout(function () {
        var val = $(this).val();
        crud_ajax('antecedentes', val, 'updateInterhEC');
    });

    $("#ec_parac").focusout(function () {
        var val = $(this).val();
        crud_ajax('paraclinicos', val, 'updateInterhEC');
    });

    $("#ec_tratam").focusout(function () {
        var val = $(this).val();
        crud_ajax('tratamiento', val, 'updateInterhEC');
    });

    $("#ec_inform").focusout(function () {
        var val = $(this).val();
        crud_ajax('diagnos_txt', val, 'updateInterhEC');
    });

    //formulario evaluación clínica
    $("#hosp_nomMed").focus(function () {
        focus_value_interh = $(this).val();
    });

    $("#hosp_telMed").focus(function () {
        focus_value_interh = $(this).val();
    });

    $("#hosp_nomMed").focusout(function () {
        var val = $(this).val();
        crud_ajax('nombre_medico', val, 'updateInterhM');
    });

    $("#hosp_telMed").focusout(function () {
        var val = $(this).val();
        crud_ajax('telefono', val, 'updateInterhM');
    });

    $('.btn-delete').on('click', function () {
        $.ajax({
            url: "bd/crud.php",
            method: "POST",
            data: {
                option: 'delete',
                id: id_paciente_interh
            }
        }).done(function () {
            tableMaestroInterh.ajax.reload();
        }).fail(function () {
            console.log('error');
        });
    });

    var tableCIE10 = $('#tableCIE10').DataTable({
        select: 'single',
        //pageLength: 5,
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
            "method": "POST",
            "data": { option: "selectCIE10" },
            "dataSrc": ""
        },
        deferRender: true,
        "columns": [
            { "data": "codigo_cie" },
            { "data": "diagnostico" }
        ],
        //dom: 'Bfrtip'
    });

    tableCIE10.on('select', function (e, dt, type, indexes) {
        $('.btnCIE10').prop('disabled', false);
    });

    tableCIE10.on('deselect', function (e, dt, type, indexes) {
        $('.btnCIE10').prop('disabled', true);
    });

    $('.btnCIE10').on('click', function () {
        var dataSelect_interhCIE10 = tableCIE10.rows('.selected').data();
        $('#ec_cie10').val(dataSelect_interhCIE10[0].codigo_cie + " " + dataSelect_interhCIE10[0].diagnostico);
        crud_ajax('cod_diag_cie', dataSelect_interhCIE10[0].codigo_cie, 'updateInterhEC');
    });

    var tableHosp = $('#tableHosp').DataTable({
        select: 'single',
        //pageLength: 5,
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
            "method": "POST",
            "data": { option: "selectHosp" },
            "dataSrc": ""
        },
        deferRender: true,
        "columns": [
            { "data": "id_hospital" },
            { "data": "nombre_hospital" }
        ],
        //dom: 'Bfrtip'
    });

    tableHosp.on('select', function (e, dt, type, indexes) {
        $('.btnHosp').prop('disabled', false);
    });

    tableHosp.on('deselect', function (e, dt, type, indexes) {
        $('.btnHosp').prop('disabled', true);
    });

    $('.btnHosp').on('click', function () {
        var dataSelect_interhHosp = tableHosp.rows('.selected').data();
        $('#hosp_dest').val(dataSelect_interhHosp[0].id_hospital + " " + dataSelect_interhHosp[0].nombre_hospital);
        crud_ajax('hospital_destinointerh', dataSelect_interhHosp[0].id_hospital, 'updateInterhM');
    });

    $('#modalR').on('show.bs.modal', function () {
        $('#razon').html('');
        $.ajax({
            url: "bd/crud.php",
            method: "POST",
            data: {
                option: 'selectCierre',
            },
            dataType: 'json'
        }).done(function (data) {
            $("#selectRazon").empty();
            $("#selectRazon").append($("<option>", {
                value: 0,
                text: "Seleccione..."
            }));
            $.each(data, function (index, value) {
                $("#selectRazon").append($("<option>", {
                    value: value.id_tranlado_fallido,
                    text: value.tipo_cierrecaso_es
                }));
            });
        }).fail(function () {
            console.log('error');
        });
    });

    $('#razon').keyup(function () {
        $(this).val().length > 0 && $('#selectRazon').val() != 0 ? $('.btnRazon').prop('disabled', false) : $('.btnRazon').prop('disabled', true);
    });

    $('#selectRazon').on('change', function () {
        $('#razon').val().length > 0 && $(this).val() != 0 ? $('.btnRazon').prop('disabled', false) : $('.btnRazon').prop('disabled', true);
    });

    $('.btnRazon').on('click', function () {
        $.ajax({
            url: "bd/crud.php",
            method: "POST",
            data: {
                option: 'cerrarInterhCaso',
                idM: id_maestro_interh,
                setField: $('#selectRazon').val()
            }
        }).done(function () {
            tableMaestroInterh.ajax.reload();
        }).fail(function () {
            console.log('error');
        });
    });

    $('#modalSeg').on('show.bs.modal', function () {
        $('#noteInput').val('');
        $.ajax({
            url: "bd/crud.php",
            method: "POST",
            data: {
                option: 'selectSeguim',
            },
            dataType: 'json'
        }).done(function (data) {
            $('#segNote').empty();
            $.each(data, function (index, value) {
                $('#segNote').append('<li>' + value.seguimento + '</li>');
            });
        }).fail(function () {
            console.log('error');
        });
    });

    $('#noteInput').keyup(function () {
        $(this).val().length > 0 ? $('.btnNote').prop('disabled', false) : $('.btnNote').prop('disabled', true);
    });

    $('.btnNote').on('click', function () {
        crud_ajax('seguimento', $('#noteInput').val(), 'updateInterhSeguim');
    });

    setInterval(function () {
        tableMaestroInterh.ajax.reload();
    }, 30000);
});