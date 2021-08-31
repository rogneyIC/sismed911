$(function () {
  var id_maestro_interh,
    id_paciente_interh,
    id_eval_interh,
    cod_ambulance,
    focus_value_interh,
    dataSelect_interh;

  var tableMaestroInterh = $("#tableMaestroInterh").DataTable({
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
      data: { option: "selectInterhMaestro" },
      dataSrc: "",
    },
    deferRender: true,
    columns: [
      { data: "cod_casointerh" },
      { data: "fechahorainterh" },
      { defaultContent: "" },
      { data: "nombre_tiposervicion_es" },
      { data: "nombre_hospital" },
      { data: "nombre_hospital_destino" },
      { data: "prioridadinterh" },
      { data: "nombre_accion_es" },
      {
        defaultContent:
          '<button type="button" class="btn btn-light" data-toggle="modal" data-target="#modalR"><i class="fa fa-times-circle" aria-hidden="true"></i></button>',
      },
    ],
    columnDefs: [
      {
        render: function (data, type, row) {
          var diff = Math.abs(new Date() - new Date(row.fechahorainterh));
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

  tableMaestroInterh.on("draw", function () {
    $(".fa-clock-o").parent().css("color", "red");
  });

  tableMaestroInterh.on("select", function (e, dt, type, indexes) {
    $(".form-control").removeClass("is-invalid");
    if (type === "row") {
      dataSelect_interh = tableMaestroInterh.rows(indexes).data();
      id_maestro_interh = dataSelect_interh[0].cod_casointerh;
      id_paciente_interh = dataSelect_interh[0].id_paciente;
      id_eval_interh = dataSelect_interh[0].id_evaluacionclinica;
      cod_ambulance = dataSelect_interh[0].cod_ambulancia;

      $("span.case").text(" - Caso: " + id_maestro_interh);

      //Se actualiza formulario paciente
      $("#form_paciente").trigger("reset");
      $("#p_number").val(dataSelect_interh[0].num_doc);
      $("#p_exp").val(dataSelect_interh[0].expendiente);
      $("#p_date").val(dataSelect_interh[0].fecha_nacido);
      $("#p_age").val(dataSelect_interh[0].edad);
      $("#p_typeage").val(dataSelect_interh[0].nombre_edad);
      if (dataSelect_interh[0].genero == 1) {
        $("#p_genM").prop("checked", true);
      } else {
        $("#p_genF").prop("checked", true);
      }
      $("#p_phone").val(dataSelect_interh[0].telefono_paciente);
      $("#p_name1").val(dataSelect_interh[0].nombre1);
      $("#p_name2").val(dataSelect_interh[0].nombre2);
      $("#p_lastname1").val(dataSelect_interh[0].apellido1);
      $("#p_lastname2").val(dataSelect_interh[0].apellido2);
      $("#p_segS").val(dataSelect_interh[0].aseguradro);
      $("#p_address").val(dataSelect_interh[0].direccion_paciente);
      $("#p_obs").html(dataSelect_interh[0].observacion_paciente);
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
            if (dataSelect_interh[0].ide_descripcion == value.descripcion) {
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
            if (dataSelect_interh[0].triage == value.id_triage) {
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
      $("#ec_ta").val(dataSelect_interh[0].sv_tx);
      $("#ec_fc").val(dataSelect_interh[0].sv_fc);
      $("#ec_fr").val(dataSelect_interh[0].sv_fr);
      $("#ec_temp").val(dataSelect_interh[0].sv_temp);
      $("#ec_gl").val(dataSelect_interh[0].sv_gl);
      $("#ec_sato2").val(dataSelect_interh[0].sv_sato2);
      $("#ec_gli").val(dataSelect_interh[0].sv_gli);
      $("#ec_talla").val(dataSelect_interh[0].talla);
      $("#ec_peso").val(dataSelect_interh[0].peso);
      $("#ec_cie10").val(
        dataSelect_interh[0].cod_diag_cie +
          " " +
          dataSelect_interh[0].cie10_diagnostico
      );
      $("#ec_cuadro").html(dataSelect_interh[0].c_clinico);
      $("#ec_examen").html(dataSelect_interh[0].examen_fisico);
      $("#ec_antec").html(dataSelect_interh[0].antecedentes);
      $("#ec_parac").html(dataSelect_interh[0].paraclinicos);
      $("#ec_tratam").html(dataSelect_interh[0].tratamiento);
      $("#ec_inform").html(dataSelect_interh[0].diagnos_txt);

      //Se actualiza formulario hospital
      $("#form_hospital").trigger("reset");
      $("#hosp_dest").val(
        dataSelect_interh[0].hospital_destinointerh +
          " " +
          dataSelect_interh[0].nombre_hospital_destino
      );
      $("#hosp_nomMed").val(dataSelect_interh[0].nombre_medico);
      $("#hosp_telMed").val(dataSelect_interh[0].telefono_maestro);

      //Se actualiza formulario ambulancia
      $("#form_ambulance").trigger("reset");
      if (dataSelect_interh[0].hora_asigna)
        $("#date_asig").val(dataSelect_interh[0].hora_asigna.replace(" ", "T"));
      if (dataSelect_interh[0].hora_llegada)
        $("#date_lleg").val(
          dataSelect_interh[0].hora_llegada.replace(" ", "T")
        );
      if (dataSelect_interh[0].hora_inicio)
        $("#date_ini").val(dataSelect_interh[0].hora_inicio.replace(" ", "T"));
      if (dataSelect_interh[0].hora_destino)
        $("#date_dest").val(
          dataSelect_interh[0].hora_destino.replace(" ", "T")
        );
      if (dataSelect_interh[0].hora_preposicion)
        $("#date_base").val(
          dataSelect_interh[0].hora_preposicion.replace(" ", "T")
        );
      $("#conductor").val(dataSelect_interh[0].conductor);
      $("#medico").val(dataSelect_interh[0].medico);
      $("#paramedico").val(dataSelect_interh[0].paramedico);
      $("#obs").html(dataSelect_interh[0].observacion_ambulancia);
      if (dataSelect_interh[0].cod_ambulancia) {
        $("#serviceAmbulance").val(
          dataSelect_interh[0].cod_ambulancias +
            " - " +
            dataSelect_interh[0].placas
        );
        $(".change").prop("disabled", false);
      } else {
        $(".change").prop("disabled", true);
      }

      $("#collapseOne").collapse("show");
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
          codA: cod_ambulance,
          setField: val,
          field: field,
        },
      })
        .done(function () {
          tableMaestroInterh.ajax.reload();
        })
        .fail(function () {
          console.log("error");
        });
    }
  }

  //formulario paciente
  $("#p_number").on("focus", function () {
    focus_value_interh = $(this).val();
  });

  $("#p_exp").on("focus", function () {
    focus_value_interh = $(this).val();
  });

  $("#p_date").on("focus", function () {
    focus_value_interh = $(this).val();
  });

  $("#p_age").on("focus", function () {
    focus_value_interh = $(this).val();
  });

  $("#p_phone").on("focus", function () {
    focus_value_interh = $(this).val();
  });

  $("#p_name1").on("focus", function () {
    focus_value_interh = $(this).val();
  });

  $("#p_name2").on("focus", function () {
    focus_value_interh = $(this).val();
  });

  $("#p_lastname1").on("focus", function () {
    focus_value_interh = $(this).val();
  });

  $("#p_lastname2").on("focus", function () {
    focus_value_interh = $(this).val();
  });

  $("#p_segS").on("focus", function () {
    focus_value_interh = $(this).val();
  });

  $("#p_address").on("focus", function () {
    focus_value_interh = $(this).val();
  });

  $("#p_obs").on("focus", function () {
    focus_value_interh = $(this).val();
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

  $(".form-check-input").on("click", function () {
    val = $("input:checked").val();
    if (
      (dataSelect_interh[0].genero == 1 && val == "f") ||
      (dataSelect_interh[0].genero == 2 && val == "m")
    ) {
      dataSelect_interh[0].genero == 1
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
    focus_value_interh = $(this).val();
  });

  $("#ec_fc").on("focus", function () {
    focus_value_interh = $(this).val();
  });

  $("#ec_fr").on("focus", function () {
    focus_value_interh = $(this).val();
  });

  $("#ec_temp").on("focus", function () {
    focus_value_interh = $(this).val();
  });

  $("#ec_gl").on("focus", function () {
    focus_value_interh = $(this).val();
  });

  $("#ec_sato2").on("focus", function () {
    focus_value_interh = $(this).val();
  });

  $("#ec_gli").on("focus", function () {
    focus_value_interh = $(this).val();
  });

  $("#ec_talla").on("focus", function () {
    focus_value_interh = $(this).val();
  });

  $("#ec_peso").on("focus", function () {
    focus_value_interh = $(this).val();
  });

  $("#ec_cuadro").on("focus", function () {
    focus_value_interh = $(this).val();
  });

  $("#ec_examen").on("focus", function () {
    focus_value_interh = $(this).val();
  });

  $("#ec_antec").on("focus", function () {
    focus_value_interh = $(this).val();
  });

  $("#ec_parac").on("focus", function () {
    focus_value_interh = $(this).val();
  });

  $("#ec_tratam").on("focus", function () {
    focus_value_interh = $(this).val();
  });

  $("#ec_inform").on("focus", function () {
    focus_value_interh = $(this).val();
  });

  $("#ec_triage").on("change", function () {
    crud_ajax(
      "triage",
      $("#ec_triage option:selected").text(),
      "updateInterhEC"
    );
  });

  $("#ec_ta").on("focusout", function () {
    crud_ajax("sv_tx", $(this).val(), "updateInterhEC");
  });

  $("#ec_fc").on("focusout", function () {
    crud_ajax("sv_fc", $(this).val(), "updateInterhEC");
  });

  $("#ec_fr").on("focusout", function () {
    crud_ajax("sv_fr", $(this).val(), "updateInterhEC");
  });

  $("#ec_temp").on("focusout", function () {
    crud_ajax("sv_temp", $(this).val(), "updateInterhEC");
  });

  $("#ec_gl").on("focusout", function () {
    crud_ajax("sv_gl", $(this).val(), "updateInterhEC");
  });

  $("#ec_sato2").on("focusout", function () {
    crud_ajax("sv_sato2", $(this).val(), "updateInterhEC");
  });

  $("#ec_gli").on("focusout", function () {
    crud_ajax("sv_gli", $(this).val(), "updateInterhEC");
  });

  $("#ec_talla").on("focusout", function () {
    crud_ajax("talla", $(this).val(), "updateInterhEC");
  });

  $("#ec_peso").on("focusout", function () {
    crud_ajax("peso", $(this).val(), "updateInterhEC");
  });

  $("#ec_cuadro").on("focusout", function () {
    crud_ajax("c_clinico", $(this).val(), "updateInterhEC");
  });

  $("#ec_examen").on("focusout", function () {
    crud_ajax("examen_fisico", $(this).val(), "updateInterhEC");
  });

  $("#ec_antec").on("focusout", function () {
    crud_ajax("antecedentes", $(this).val(), "updateInterhEC");
  });

  $("#ec_parac").on("focusout", function () {
    crud_ajax("paraclinicos", $(this).val(), "updateInterhEC");
  });

  $("#ec_tratam").on("focusout", function () {
    crud_ajax("tratamiento", $(this).val(), "updateInterhEC");
  });

  $("#ec_inform").on("focusout", function () {
    crud_ajax("diagnos_txt", $(this).val(), "updateInterhEC");
  });
  //end formulario evaluación clínica

  //formulario hospital
  $("#hosp_nomMed").on("focus", function () {
    focus_value_interh = $(this).val();
  });

  $("#hosp_telMed").on("focus", function () {
    focus_value_interh = $(this).val();
  });

  $("#hosp_nomMed").on("focusout", function () {
    crud_ajax("nombre_medico", $(this).val(), "updateInterhM");
  });

  $("#hosp_telMed").on("focusout", function () {
    crud_ajax("telefono", $(this).val(), "updateInterhM");
  });
  //end formulario hospital

  //Formulario ambulancia
  $("#date_asig").on("focus", function () {
    focus_value = $(this).val().replace("T", " ");
  });

  $("#date_lleg").on("focus", function () {
    focus_value = $(this).val().replace("T", " ");
  });

  $("#date_ini").on("focus", function () {
    focus_value = $(this).val().replace("T", " ");
  });

  $("#date_dest").on("focus", function () {
    focus_value = $(this).val().replace("T", " ");
  });

  $("#date_base").on("focus", function () {
    focus_value = $(this).val().replace("T", " ");
  });

  $("#conductor").on("focus", function () {
    focus_value = $(this).val();
  });

  $("#medico").on("focus", function () {
    focus_value = $(this).val();
  });

  $("#paramedico").on("focus", function () {
    focus_value = $(this).val();
  });

  $("#obs").on("focus", function () {
    focus_value = $(this).val();
  });

  $("#select_ambulance").on("change", function () {
    if ($("#select_ambulance option:selected").val() != 0) {
      var option = dataSelect_interh[0].cod_ambulancia
        ? "updateInterhSA"
        : "insertInterhSA";
      crud_ajax(
        "cod_ambulancia",
        $("#select_ambulance option:selected").text(),
        option
      );
      $(".change").prop("disabled", false);
    }
  });

  $("#date_asig").on("focusout", function () {
    crud_ajax("hora_asigna", $(this).val().replace("T", " "), "updateInterhSA");
  });

  $("#date_lleg").on("focusout", function () {
    crud_ajax(
      "hora_llegada",
      $(this).val().replace("T", " "),
      "updateInterhSA"
    );
  });

  $("#date_ini").on("focusout", function () {
    crud_ajax("hora_inicio", $(this).val().replace("T", " "), "updateInterhSA");
  });

  $("#date_dest").on("focusout", function () {
    crud_ajax(
      "hora_destino",
      $(this).val().replace("T", " "),
      "updateInterhSA"
    );
  });

  $("#date_base").on("focusout", function () {
    crud_ajax(
      "hora_preposicion",
      $(this).val().replace("T", " "),
      "updateInterhSA"
    );
  });

  $("#conductor").on("focusout", function () {
    crud_ajax("conductor", $(this).val(), "updateInterhSA");
  });

  $("#medico").on("focusout", function () {
    crud_ajax("medico", $(this).val(), "updateInterhSA");
  });

  $("#paramedico").on("focusout", function () {
    crud_ajax("paramedico", $(this).val(), "updateInterhSA");
  });

  $("#obs").on("focusout", function () {
    crud_ajax("observaciones", $(this).val(), "updateInterhSA");
  });
  //end formulario ambulancia

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
    var dataSelect_interhCIE10 = tableCIE10.rows(".selected").data();
    $("#ec_cie10").val(
      dataSelect_interhCIE10[0].codigo_cie +
        " " +
        dataSelect_interhCIE10[0].diagnostico
    );
    crud_ajax(
      "cod_diag_cie",
      dataSelect_interhCIE10[0].codigo_cie,
      "updateInterhEC"
    );
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
    var dataSelect_interhHosp = tableHosp.rows(".selected").data();
    $("#hosp_dest").val(
      dataSelect_interhHosp[0].id_hospital +
        " " +
        dataSelect_interhHosp[0].nombre_hospital
    );
    crud_ajax(
      "hospital_destinointerh",
      dataSelect_interhHosp[0].id_hospital,
      "updateInterhM"
    );
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
        option: "cerrarInterhCaso",
        idM: id_maestro_interh,
        setField: $("#selectRazon").val(),
      },
    })
      .done(function () {
        tableMaestroInterh.ajax.reload();
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
    crud_ajax("seguimento", $("#noteInput").val(), "updateInterhSeguim");
  });

  var tableAmbulance = $("#tableAmbulance").DataTable({
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
      data: { option: "selectAmbulance" },
      dataSrc: "",
    },
    deferRender: true,
    columns: [{ data: "cod_ambulancias" }, { data: "placas" }],
    //dom: 'Bfrtip'
  });

  $("#modalAmbulance").on("show.bs.modal", function () {
    tableAmbulance.ajax.reload();
  });

  tableAmbulance.on("select", function (e, dt, type, indexes) {
    $(".btnAmbulance").prop("disabled", false);
  });

  tableAmbulance.on("deselect", function (e, dt, type, indexes) {
    $(".btnAmbulance").prop("disabled", true);
  });

  $(".btnAmbulance").on("click", function () {
    var dataSelectAmbulance = tableAmbulance.rows(".selected").data();
    var option = dataSelect_interh[0].cod_ambulancia
      ? "updatePrehSA"
      : "insertPrehSA";
    $("#serviceAmbulance").val(
      dataSelectAmbulance[0].cod_ambulancias +
        " - " +
        dataSelectAmbulance[0].placas
    );
    crud_ajax("cod_ambulancia", dataSelectAmbulance[0].cod_ambulancias, option);
    $(".change").prop("disabled", false);
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
    tableMaestroInterh.ajax.reload();
  }, 30000);
});
