$(function () {
  var id_maestro, id_paciente, id_evalC, focus_value, dataSelect;

  var tableMaestro = $("#tableMaestro").DataTable({
    select: "single",
    pageLength: 5,
    language: {
      select: {
        rows: {
          _: "",
          0: "",
          1: "",
        },
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
        sPrevious: "Anterior",
      },
    },
    ajax: {
      url: "bd/crud.php",
      method: "POST",
      data: { option: "selectPrehMaestro" },
      dataSrc: "",
    },
    deferRender: true,
    columns: [
      { data: "cod_casopreh" },
      { data: "fecha" },
      { defaultContent: "" },
      { data: "direccion_maestro" },
      { data: "nombre_incidente" },
      { data: "prioridad" },
      { data: "nombre1" },
      { data: "nombre_hospital" },
      { data: "nombre_medico" },
      { data: "telefono_maestro" },
      { data: "nombre_reporta" },
      {
        defaultContent:
          '<button type="button" class="btn btn-light" data-toggle="modal" data-target="#modalSeg"><i class="fa fa-sticky-note-o" aria-hidden="true"></i></button>',
      },
      {
        defaultContent:
          '<button type="button" class="btn btn-light" data-toggle="modal" data-target="#modalR"><i class="fa fa-times-circle" aria-hidden="true"></i></button>',
      },
    ],
    columnDefs: [
      {
        render: function (data, type, row) {
          var diff = Math.abs(new Date() - new Date(row.fecha));
          var minutes = Math.floor(diff / 1000 / 60);
          return (
            '<i class="fa fa-clock-o" aria-hidden="true"></i> ' +
            minutes +
            " MIN"
          );
        },
        targets: 2,
      },
    ],
    //rowId: 'extn',
    dom: "Bfrtip",
  });

  tableMaestro.on("draw", function () {
    $(".fa-clock-o").parent().css("color", "red");
  });

  tableMaestro.on("select", function (e, dt, type, indexes) {
    $(".form-control").removeClass("is-invalid");
    if (type === "row") {
      dataSelect = tableMaestro.rows(indexes).data();
      id_maestro = dataSelect[0].cod_casopreh;
      id_paciente = dataSelect[0].id_paciente;
      id_evalC = dataSelect[0].id_evaluacionclinica;

      $("span.case").text(" - Caso: " + id_maestro);

      //Se actualiza formulario paciente
      $("#form_paciente").trigger("reset");
      $("#p_number").val(dataSelect[0].num_doc);
      $("#p_exp").val(dataSelect[0].expendiente);
      $("#p_date").val(dataSelect[0].fecha_nacido);
      $("#p_age").val(dataSelect[0].edad);
      $("#p_typeage").val(dataSelect[0].nombre_edad);
      if (dataSelect[0].genero == 1) {
        $("#p_genM").prop("checked", true);
      } else {
        $("#p_genF").prop("checked", true);
      }
      $("#p_phone").val(dataSelect[0].telefono_paciente);
      $("#p_name1").val(dataSelect[0].nombre1);
      $("#p_name2").val(dataSelect[0].nombre2);
      $("#p_lastname1").val(dataSelect[0].apellido1);
      $("#p_lastname2").val(dataSelect[0].apellido2);
      $("#p_segS").val(dataSelect[0].aseguradro);
      $("#p_address").val(dataSelect[0].direccion_paciente);
      $("#p_obs").html(dataSelect[0].observacion_paciente);
      $.ajax({
        url: "bd/crud.php",
        method: "POST",
        data: {
          option: "selectIDE",
        },
        dataType: "json",
      })
        .done(function (data) {
          $("#p_ide").empty();
          $("#p_ide").append(
            $("<option>", {
              value: 0,
              text: "Seleccione...",
            })
          );
          $.each(data, function (index, value) {
            $("#p_ide").append(
              $("<option>", {
                value: index + 1,
                text: value.descripcion,
              })
            );
            if (dataSelect[0].ide_descripcion == value.descripcion) {
              $("#p_ide option[value=" + (index + 1) + "]").attr(
                "selected",
                true
              );
            }
          });
        })
        .fail(function () {
          console.log("error");
        });

      //Se actualiza formulario evaluación clínica
      $("#form_evalClinic").trigger("reset");
      $.ajax({
        url: "bd/crud.php",
        method: "POST",
        data: {
          option: "selectTriage",
        },
        dataType: "json",
      })
        .done(function (data) {
          $("#ec_triage").empty();
          $("#ec_triage").append(
            $("<option>", {
              value: 0,
              text: "Seleccione...",
            })
          );
          $.each(data, function (index, value) {
            $("#ec_triage").append(
              $("<option>", {
                value: index + 1,
                text: value.nombre_triage_es,
              })
            );
            if (dataSelect[0].triage == value.id_triage) {
              $("#ec_triage option[value=" + (index + 1) + "]").attr(
                "selected",
                true
              );
            }
          });
        })
        .fail(function () {
          console.log("error");
        });
      $("#ec_ta").val(dataSelect[0].sv_tx);
      $("#ec_fc").val(dataSelect[0].sv_fc);
      $("#ec_fr").val(dataSelect[0].sv_fr);
      $("#ec_temp").val(dataSelect[0].sv_temp);
      $("#ec_gl").val(dataSelect[0].sv_gl);
      $("#ec_sato2").val(dataSelect[0].sv_sato2);
      $("#ec_gli").val(dataSelect[0].sv_gli);
      $("#ec_talla").val(dataSelect[0].talla);
      $("#ec_peso").val(dataSelect[0].peso);
      $("#ec_cie10").val(
        dataSelect[0].cod_diag_cie + " " + dataSelect[0].cie10_diagnostico
      );
      $("#ec_cuadro").html(dataSelect[0].c_clinico);
      $("#ec_examen").html(dataSelect[0].examen_fisico);
      $("#ec_antec").html(dataSelect[0].antecedentes);
      $("#ec_parac").html(dataSelect[0].paraclinicos);
      $("#ec_tratam").html(dataSelect[0].tratamiento);
      $("#ec_inform").html(dataSelect[0].diagnos_txt);

      //Se actualiza formulario hospital
      $("#form_hospital").trigger("reset");
      $("#hosp_dest").val(
        dataSelect[0].hospital_destino + " " + dataSelect[0].nombre_hospital
      );
      $("#hosp_nomMed").val(dataSelect[0].nombre_medico);
      $("#hosp_telMed").val(dataSelect[0].telefono_maestro);

      $("#collapseOne").collapse("show");
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
          idP: id_paciente,
          idEC: id_evalC,
          setField: val,
          field: field,
        },
      })
        .done(function () {
          tableMaestro.ajax.reload();
        })
        .fail(function () {
          console.log("error");
        });
    }
  }

  //formulario paciente
  $("#p_number").on("focus", function () {
    focus_value = $(this).val();
  });

  $("#p_exp").on("focus", function () {
    focus_value = $(this).val();
  });

  $("#p_date").on("focus", function () {
    focus_value = $(this).val();
  });

  $("#p_age").on("focus", function () {
    focus_value = $(this).val();
  });

  $("#p_phone").on("focus", function () {
    focus_value = $(this).val();
  });

  $("#p_name1").on("focus", function () {
    focus_value = $(this).val();
  });

  $("#p_name2").on("focus", function () {
    focus_value = $(this).val();
  });

  $("#p_lastname1").on("focus", function () {
    focus_value = $(this).val();
  });

  $("#p_lastname2").on("focus", function () {
    focus_value = $(this).val();
  });

  $("#p_segS").on("focus", function () {
    focus_value = $(this).val();
  });

  $("#p_address").on("focus", function () {
    focus_value = $(this).val();
  });

  $("#p_obs").on("focus", function () {
    focus_value = $(this).val();
  });

  $("#p_ide").on("change", function () {
    crud_ajax("tipo_doc", $("#p_ide option:selected").text(), "updateP");
  });

  /* Validación de número de cédula dominicana */
  $("#p_number").on("focusout", function () {
    if ($("#p_ide option:selected").val() == 1) {
      if (number_validate($(this).val())) {
        $(".form-control[name='p_number']").removeClass("is-invalid");
        crud_ajax("num_doc", $(this).val(), "updateP");
      } else {
        $(".form-control[name='p_number']").addClass("is-invalid");
      }
    } else {
      $(".form-control[name='p_number']").removeClass("is-invalid");
      crud_ajax("num_doc", $(this).val(), "updateP");
    }
  });

  $("#p_exp").on("focusout", function () {
    crud_ajax("expendiente", $(this).val(), "updateP");
  });

  $("#p_date").on("focusout", function () {
    crud_ajax("fecha_nacido", $(this).val(), "updateP");
  });

  $("#p_age").on("focusout", function () {
    crud_ajax("edad", $(this).val(), "updateP");
  });

  $(".gender").on("click", function () {
    val = $("input:checked").val();
    if (
      (dataSelect[0].genero == 1 && val == "f") ||
      (dataSelect[0].genero == 2 && val == "m")
    ) {
      dataSelect[0].genero == 1
        ? crud_ajax("genero", 2, "updateP")
        : crud_ajax("genero", 1, "updateP");
    }
  });

  $("#p_phone").on("focusout", function () {
    crud_ajax("telefono", $(this).val(), "updateP");
  });

  $("#p_name1").on("focusout", function () {
    crud_ajax("nombre1", $(this).val(), "updateP");
  });

  $("#p_name2").on("focusout", function () {
    crud_ajax("nombre2", $(this).val(), "updateP");
  });

  $("#p_lastname1").on("focusout", function () {
    crud_ajax("apellido1", $(this).val(), "updateP");
  });

  $("#p_lastname2").on("focusout", function () {
    crud_ajax("apellido2", $(this).val(), "updateP");
  });

  $("#p_segS").on("focusout", function () {
    crud_ajax("aseguradro", $(this).val(), "updateP");
  });

  $("#p_address").on("focusout", function () {
    crud_ajax("direccion", $(this).val(), "updateP");
  });

  $("#p_obs").on("focusout", function () {
    crud_ajax("observacion", $(this).val(), "updateP");
  });
  //end formulario paciente

  //formulario evaluación clínica
  $("#ec_ta").on("focus", function () {
    focus_value = $(this).val();
  });

  $("#ec_fc").on("focus", function () {
    focus_value = $(this).val();
  });

  $("#ec_fr").on("focus", function () {
    focus_value = $(this).val();
  });

  $("#ec_temp").on("focus", function () {
    focus_value = $(this).val();
  });

  $("#ec_gl").on("focus", function () {
    focus_value = $(this).val();
  });

  $("#ec_sato2").on("focus", function () {
    focus_value = $(this).val();
  });

  $("#ec_gli").on("focus", function () {
    focus_value = $(this).val();
  });

  $("#ec_talla").on("focus", function () {
    focus_value = $(this).val();
  });

  $("#ec_peso").on("focus", function () {
    focus_value = $(this).val();
  });

  $("#ec_cuadro").on("focus", function () {
    focus_value = $(this).val();
  });

  $("#ec_examen").on("focus", function () {
    focus_value = $(this).val();
  });

  $("#ec_antec").on("focus", function () {
    focus_value = $(this).val();
  });

  $("#ec_parac").on("focus", function () {
    focus_value = $(this).val();
  });

  $("#ec_tratam").on("focus", function () {
    focus_value = $(this).val();
  });

  $("#ec_inform").on("focus", function () {
    focus_value = $(this).val();
  });

  $("#ec_triage").on("change", function () {
    crud_ajax("triage", $("#ec_triage option:selected").text(), "updatePrehEC");
  });

  $("#ec_ta").on("focusout", function () {
    crud_ajax("sv_tx", $(this).val(), "updatePrehEC");
  });

  $("#ec_fc").on("focusout", function () {
    crud_ajax("sv_fc", $(this).val(), "updatePrehEC");
  });

  $("#ec_fr").on("focusout", function () {
    crud_ajax("sv_fr", $(this).val(), "updatePrehEC");
  });

  $("#ec_temp").on("focusout", function () {
    crud_ajax("sv_temp", $(this).val(), "updatePrehEC");
  });

  $("#ec_gl").on("focusout", function () {
    crud_ajax("sv_gl", $(this).val(), "updatePrehEC");
  });

  $("#ec_sato2").on("focusout", function () {
    crud_ajax("sv_sato2", $(this).val(), "updatePrehEC");
  });

  $("#ec_gli").on("focusout", function () {
    crud_ajax("sv_gli", $(this).val(), "updatePrehEC");
  });

  $("#ec_talla").on("focusout", function () {
    crud_ajax("talla", $(this).val(), "updatePrehEC");
  });

  $("#ec_peso").on("focusout", function () {
    crud_ajax("peso", $(this).val(), "updatePrehEC");
  });

  $("#ec_cuadro").on("focusout", function () {
    crud_ajax("c_clinico", $(this).val(), "updatePrehEC");
  });

  $("#ec_examen").on("focusout", function () {
    crud_ajax("examen_fisico", $(this).val(), "updatePrehEC");
  });

  $("#ec_antec").on("focusout", function () {
    crud_ajax("antecedentes", $(this).val(), "updatePrehEC");
  });

  $("#ec_parac").on("focusout", function () {
    crud_ajax("paraclinicos", $(this).val(), "updatePrehEC");
  });

  $("#ec_tratam").on("focusout", function () {
    crud_ajax("tratamiento", $(this).val(), "updatePrehEC");
  });

  $("#ec_inform").on("focusout", function () {
    crud_ajax("diagnos_txt", $(this).val(), "updatePrehEC");
  });
  //end formulario evaluación clínica

  //formulario hospital
  $("#hosp_nomMed").on("focus", function () {
    focus_value = $(this).val();
  });

  $("#hosp_telMed").on("focus", function () {
    focus_value = $(this).val();
  });

  $("#hosp_nomMed").on("focusout", function () {
    crud_ajax("nombre_medico", $(this).val(), "updatePrehM");
  });

  $("#hosp_telMed").on("focusout", function () {
    crud_ajax("telefono", $(this).val(), "updatePrehM");
  });
  //end formulario hospital

  var tableCIE10 = $("#tableCIE10").DataTable({
    select: "single",
    //pageLength: 5,
    language: {
      select: {
        rows: {
          _: "",
          0: "",
          1: "",
        },
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
        sPrevious: "Anterior",
      },
    },
    ajax: {
      url: "bd/crud.php",
      method: "POST",
      data: { option: "selectCIE10" },
      dataSrc: "",
    },
    deferRender: true,
    columns: [{ data: "codigo_cie" }, { data: "diagnostico" }],
    //dom: 'Bfrtip'
  });

  $("#CIE10").on("show.bs.modal", function () {
    tableCIE10.ajax.reload();
  });

  tableCIE10.on("select", function (e, dt, type, indexes) {
    $(".btnCIE10").prop("disabled", false);
  });

  tableCIE10.on("deselect", function (e, dt, type, indexes) {
    $(".btnCIE10").prop("disabled", true);
  });

  $(".btnCIE10").on("click", function () {
    var dataSelectCIE10 = tableCIE10.rows(".selected").data();
    $("#ec_cie10").val(
      dataSelectCIE10[0].codigo_cie + " " + dataSelectCIE10[0].diagnostico
    );
    crud_ajax("cod_diag_cie", dataSelectCIE10[0].codigo_cie, "updatePrehEC");
  });

  var tableHosp = $("#tableHosp").DataTable({
    select: "single",
    //pageLength: 5,
    language: {
      select: {
        rows: {
          _: "",
          0: "",
          1: "",
        },
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
        sPrevious: "Anterior",
      },
    },
    ajax: {
      url: "bd/crud.php",
      method: "POST",
      data: { option: "selectHosp" },
      dataSrc: "",
    },
    deferRender: true,
    columns: [{ data: "id_hospital" }, { data: "nombre_hospital" }],
    //dom: 'Bfrtip'
  });

  $("#hosp").on("show.bs.modal", function () {
    tableHosp.ajax.reload();
  });

  tableHosp.on("select", function (e, dt, type, indexes) {
    $(".btnHosp").prop("disabled", false);
  });

  tableHosp.on("deselect", function (e, dt, type, indexes) {
    $(".btnHosp").prop("disabled", true);
  });

  $(".btnHosp").on("click", function () {
    var dataSelectHosp = tableHosp.rows(".selected").data();
    $("#hosp_dest").val(
      dataSelectHosp[0].id_hospital + " " + dataSelectHosp[0].nombre_hospital
    );
    crud_ajax("hospital_destino", dataSelectHosp[0].id_hospital, "updatePrehM");
  });

  $("#modalR").on("show.bs.modal", function () {
    $("#razon").html("");
    $.ajax({
      url: "bd/crud.php",
      method: "POST",
      data: {
        option: "selectCierre",
      },
      dataType: "json",
    })
      .done(function (data) {
        $("#selectRazon").empty();
        $("#selectRazon").append(
          $("<option>", {
            value: 0,
            text: "Seleccione...",
          })
        );
        $.each(data, function (index, value) {
          $("#selectRazon").append(
            $("<option>", {
              value: value.id_tranlado_fallido,
              text: value.tipo_cierrecaso_es,
            })
          );
        });
      })
      .fail(function () {
        console.log("error");
      });
  });

  $("#razon").keyup(function () {
    $(this).val().length > 0 && $("#selectRazon").val() != 0
      ? $(".btnRazon").prop("disabled", false)
      : $(".btnRazon").prop("disabled", true);
  });

  $("#selectRazon").on("change", function () {
    $("#razon").val().length > 0 && $(this).val() != 0
      ? $(".btnRazon").prop("disabled", false)
      : $(".btnRazon").prop("disabled", true);
  });

  $(".btnRazon").on("click", function () {
    $.ajax({
      url: "bd/crud.php",
      method: "POST",
      data: {
        option: "cerrarPrehCaso",
        idM: id_maestro,
        setField: $("#selectRazon").val(),
      },
    })
      .done(function () {
        tableMaestro.ajax.reload();
      })
      .fail(function () {
        console.log("error");
      });
  });

  $("#modalSeg").on("show.bs.modal", function () {
    $("#noteInput").val("");
    $.ajax({
      url: "bd/crud.php",
      method: "POST",
      data: {
        option: "selectSeguim",
      },
      dataType: "json",
    })
      .done(function (data) {
        $("#segNote").empty();
        $.each(data, function (index, value) {
          $("#segNote").append("<li>" + value.seguimento + "</li>");
        });
      })
      .fail(function () {
        console.log("error");
      });
  });

  $("#noteInput").keyup(function () {
    $(this).val().length > 0
      ? $(".btnNote").prop("disabled", false)
      : $(".btnNote").prop("disabled", true);
  });

  $(".btnNote").on("click", function () {
    crud_ajax("seguimento", $("#noteInput").val(), "updatePrehSeguim");
  });

  /* Validación de número de cédula dominicana
   * con longitud de 11 caracteres numéricos o 13 caracteres incluyendo los dos guiones de presentación
   * ejemplo sin guiones 00116454281, ejemplo con guiones 001-1645428-1
   * el retorno es 1 para el caso de cédula válida y 0 para la no válida
   */
  function number_validate(num) {
    var c = num.replace(/-/g, "");
    var number = c.substr(0, c.length - 1);
    var verificador = c.substr(c.length - 1, 1);
    var suma = 0;
    var numberValidate = false;
    if (num.length < 11) {
      return false;
    }
    for (i = 0; i < number.length; i++) {
      var mod = 2;
      if (i % 2 == 0) mod = 1;
      var res = number.substr(i, 1) * mod;
      if (res > 9) {
        res = res.toString();
        var uno = res.substr(0, 1);
        var dos = res.substr(1, 1);
        res = eval(uno) + eval(dos);
      }
      suma += eval(res);
    }
    var el_numero = (10 - (suma % 10)) % 10;
    if (el_numero == verificador && number.substr(0, 3) != "000") {
      numberValidate = true;
    }
    return numberValidate;
  }

  $("#p_phone").mask("(999) 999-9999");
  $("#hosp_telMed").mask("(999) 999-9999");

  setInterval(function () {
    tableMaestro.ajax.reload();
  }, 30000);
});
