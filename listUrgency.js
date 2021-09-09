$(function () {
  var dataSelect,
    arrayExamen = "",
    tempIdMedical,
    idMA,
    focus_value;
  var tableUrgency = $("#tableUrgency").DataTable({
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
      url: "bd/admission.php",
      method: "POST",
      data: { option: "selectUrgency" },
      dataSrc: "",
    },
    deferRender: true,
    columns: [
      { data: "clasificacion_admision" },
      {
        defaultContent:
          "<div id='timer'><div class='row'><div class='col countdown-wrapper text-center'><div class='card bg-light'><div class='card-block'><div id='countdown' class='text-center d-flex justify-content-center'><span class='countdown-section'><span id='hour' class='timer'>0</span><span class='countdown-period d-block'>Horas</span></span><span class='countdown-section'><span id='min' class='timer'>0</span><span class='countdown-period d-block'>Minutos</span></span><span class='countdown-section'><span id='sec' class='timer'>0</span><span class='countdown-period d-block'>Segundos</span></span></div></div></div></div></div></div>",
      },
      { data: "fecha_clasificacion" },
      { data: "expendiente" },
      { defaultContent: "" },
      { data: "nombre_motivoatencion" },
      {
        defaultContent:
          '<button type="button" class="btn btn-secondary egress-btn" data-toggle="modal" data-target="#modal-egress">Egreso</button>',
      },
    ],
    columnDefs: [
      {
        render: function (data, type, row) {
          var fond =
            row.clasificacion_admision == "Azul"
              ? "text-white bg-blue"
              : "text-white bg-green";
          return (
            "<div class='card " +
            fond +
            "'><div class='card-body'>" +
            row.clasificacion_admision +
            "</div></div>"
          );
        },
        targets: 0,
      },
      {
        render: function (data, type, row) {
          var patient = row.nombre1 ? row.nombre1 : "";
          patient += row.nombre2 ? " " + row.nombre2 : "";
          patient += row.apellido1 ? " " + row.apellido1 : "";
          patient += row.apellido2 ? " " + row.apellido2 : "";
          return patient;
        },
        targets: 4,
      },
    ],
    dom: "Bfrtip",
  });

  tableUrgency.on("select", function (e, dt, type, indexes) {
    $("#collapseOne").collapse("show");
    dataSelect = tableUrgency.rows(indexes).data();
    idMA = dataSelect[0].id_atencionmedica;
    /* Se actualiza el fromulario */
    $("#form_Urgency").trigger("reset");
    $("select option").attr("selected", false);
    $("#general option[value=" + dataSelect[0].id_general + "]").attr(
      "selected",
      true
    );
    $("#cabeza option[value=" + dataSelect[0].id_cabeza + "]").attr(
      "selected",
      true
    );
    $("#ojo option[value=" + dataSelect[0].id_ojo + "]").attr("selected", true);
    $("#otorrino option[value=" + dataSelect[0].id_otorrino + "]").attr(
      "selected",
      true
    );
    $("#boca option[value=" + dataSelect[0].id_boca + "]").attr(
      "selected",
      true
    );
    $("#cuello option[value=" + dataSelect[0].id_cuello + "]").attr(
      "selected",
      true
    );
    $("#torax option[value=" + dataSelect[0].id_torax + "]").attr(
      "selected",
      true
    );
    $("#corazon option[value=" + dataSelect[0].id_corazon + "]").attr(
      "selected",
      true
    );
    $("#pulmon option[value=" + dataSelect[0].id_pulmon + "]").attr(
      "selected",
      true
    );
    $("#abdomen option[value=" + dataSelect[0].id_abdomen + "]").attr(
      "selected",
      true
    );
    $("#pelvis option[value=" + dataSelect[0].id_pelvis + "]").attr(
      "selected",
      true
    );
    $("#rectal option[value=" + dataSelect[0].id_rectal + "]").attr(
      "selected",
      true
    );
    $("#genital option[value=" + dataSelect[0].id_genital + "]").attr(
      "selected",
      true
    );
    $("#extremidad option[value=" + dataSelect[0].id_extremidad + "]").attr(
      "selected",
      true
    );
    $("#neuro option[value=" + dataSelect[0].id_neuro + "]").attr(
      "selected",
      true
    );
    $("#piel option[value=" + dataSelect[0].id_piel + "]").attr(
      "selected",
      true
    );
    dataSelect[0].cod_cie10
      ? $("#ec_cie10").val(
          dataSelect[0].cod_cie10 + " " + dataSelect[0].diagnostico
        )
      : $("#ec_cie10").val("");
    $("#sign").html(dataSelect[0].sintomas);
    $("#description").html(dataSelect[0].descripcion_diagnostico);
    $("#other").html(dataSelect[0].otros);
  });

  function crud_ajax(field, val, option) {
    if (focus_value != val) {
      $.ajax({
        url: "bd/admission.php",
        method: "POST",
        data: {
          option: option,
          field: field,
          setField: val,
          idMA: idMA,
        },
      })
        .done(function () {
          tableUrgency.ajax.reload();
        })
        .fail(function () {
          console.log("error");
        });
    }
  }

  $.ajax({
    url: "bd/admission.php",
    method: "POST",
    data: {
      option: "loadSelectMedicalAttention",
    },
    dataType: "json",
  })
    .done(function (data) {
      $("#general").empty();
      $("#general").append(
        $("<option>", {
          value: 0,
          text: "-- Seleccione una opción --",
        })
      );

      $("#cabeza").empty();
      $("#cabeza").append(
        $("<option>", {
          value: 0,
          text: "-- Seleccione una opción --",
        })
      );

      $("#ojo").empty();
      $("#ojo").append(
        $("<option>", {
          value: 0,
          text: "-- Seleccione una opción --",
        })
      );

      $("#otorrino").empty();
      $("#otorrino").append(
        $("<option>", {
          value: 0,
          text: "-- Seleccione una opción --",
        })
      );

      $("#boca").empty();
      $("#boca").append(
        $("<option>", {
          value: 0,
          text: "-- Seleccione una opción --",
        })
      );

      $("#cuello").empty();
      $("#cuello").append(
        $("<option>", {
          value: 0,
          text: "-- Seleccione una opción --",
        })
      );

      $("#torax").empty();
      $("#torax").append(
        $("<option>", {
          value: 0,
          text: "-- Seleccione una opción --",
        })
      );

      $("#corazon").empty();
      $("#corazon").append(
        $("<option>", {
          value: 0,
          text: "-- Seleccione una opción --",
        })
      );

      $("#pulmon").empty();
      $("#pulmon").append(
        $("<option>", {
          value: 0,
          text: "-- Seleccione una opción --",
        })
      );

      $("#abdomen").empty();
      $("#abdomen").append(
        $("<option>", {
          value: 0,
          text: "-- Seleccione una opción --",
        })
      );

      $("#pelvis").empty();
      $("#pelvis").append(
        $("<option>", {
          value: 0,
          text: "-- Seleccione una opción --",
        })
      );

      $("#rectal").empty();
      $("#rectal").append(
        $("<option>", {
          value: 0,
          text: "-- Seleccione una opción --",
        })
      );

      $("#genital").empty();
      $("#genital").append(
        $("<option>", {
          value: 0,
          text: "-- Seleccione una opción --",
        })
      );

      $("#extremidad").empty();
      $("#extremidad").append(
        $("<option>", {
          value: 0,
          text: "-- Seleccione una opción --",
        })
      );

      $("#neuro").empty();
      $("#neuro").append(
        $("<option>", {
          value: 0,
          text: "-- Seleccione una opción --",
        })
      );

      $("#piel").empty();
      $("#piel").append(
        $("<option>", {
          value: 0,
          text: "-- Seleccione una opción --",
        })
      );

      $("#disposal").empty();
      $("#disposal").append(
        $("<option>", {
          value: 0,
          text: "-- Seleccione una opción --",
        })
      );

      $.each(data["general"], function (index, value) {
        $("#general").append(
          $("<option>", {
            value: value.id_general,
            text: value.nombre_general,
          })
        );
      });

      $.each(data["cabeza"], function (index, value) {
        $("#cabeza").append(
          $("<option>", {
            value: value.id_cabeza,
            text: value.nombre_cabeza,
          })
        );
      });

      $.each(data["ojo"], function (index, value) {
        $("#ojo").append(
          $("<option>", {
            value: value.id_ojo,
            text: value.nombre_ojo,
          })
        );
      });

      $.each(data["otorrino"], function (index, value) {
        $("#otorrino").append(
          $("<option>", {
            value: value.id_otorrino,
            text: value.nombre_otorrino,
          })
        );
      });

      $.each(data["boca"], function (index, value) {
        $("#boca").append(
          $("<option>", {
            value: value.id_boca,
            text: value.nombre_boca,
          })
        );
      });

      $.each(data["cuello"], function (index, value) {
        $("#cuello").append(
          $("<option>", {
            value: value.id_cuello,
            text: value.nombre_cuello,
          })
        );
      });

      $.each(data["torax"], function (index, value) {
        $("#torax").append(
          $("<option>", {
            value: value.id_torax,
            text: value.nombre_torax,
          })
        );
      });

      $.each(data["corazon"], function (index, value) {
        $("#corazon").append(
          $("<option>", {
            value: value.id_corazon,
            text: value.nombre_corazon,
          })
        );
      });

      $.each(data["pulmon"], function (index, value) {
        $("#pulmon").append(
          $("<option>", {
            value: value.id_pulmon,
            text: value.nombre_pulmon,
          })
        );
      });

      $.each(data["abdomen"], function (index, value) {
        $("#abdomen").append(
          $("<option>", {
            value: value.id_abdomen,
            text: value.nombre_abdomen,
          })
        );
      });

      $.each(data["pelvis"], function (index, value) {
        $("#pelvis").append(
          $("<option>", {
            value: value.id_pelvis,
            text: value.nombre_pelvis,
          })
        );
      });

      $.each(data["rectal"], function (index, value) {
        $("#rectal").append(
          $("<option>", {
            value: value.id_rectal,
            text: value.nombre_rectal,
          })
        );
      });

      $.each(data["genital"], function (index, value) {
        $("#genital").append(
          $("<option>", {
            value: value.id_genital,
            text: value.nombre_genital,
          })
        );
      });

      $.each(data["extremidad"], function (index, value) {
        $("#extremidad").append(
          $("<option>", {
            value: value.id_extremidad,
            text: value.nombre_extremidad,
          })
        );
      });

      $.each(data["neuro"], function (index, value) {
        $("#neuro").append(
          $("<option>", {
            value: value.id_neuro,
            text: value.nombre_neuro,
          })
        );
      });

      $.each(data["piel"], function (index, value) {
        $("#piel").append(
          $("<option>", {
            value: value.id_piel,
            text: value.nombre_piel,
          })
        );
      });

      $.each(data["disposal"], function (index, value) {
        $("#disposal").append(
          $("<option>", {
            value: value.id_estadoalta,
            text: value.estado_alta,
          })
        );
      });
    })
    .fail(function () {
      console.log("error");
    });

  $("select").on("change", function (e) {
    if (e.target.value != 0 && e.target.id != "disposal") {
      crud_ajax("id_" + e.target.id, e.target.value, "updateMedicalAttention");
    }
  });

  $("#modal-egress").on("show.bs.modal", function () {
    $("#disposal option").attr("selected", false);
    $("#disposal option[value='0']").attr("selected", true);
  });

  $("#disposal").on("change", function (e) {
    e.target.value == 0
      ? $(".btn-egress").prop("disabled", true)
      : $(".btn-egress").prop("disabled", false);
  });

  $(".btn-egress").on("click", function () {
    crud_ajax(
      "id_estadoalta",
      $("#disposal option:selected").val(),
      "updateMedicalAttention"
    );
  });

  $("#sign").on("focus", function () {
    focus_value = $(this).val();
  });

  $("#description").on("focus", function () {
    focus_value = $(this).val();
  });

  $("#other").on("focus", function () {
    focus_value = $(this).val();
  });

  $("#sign").on("focusout", function () {
    crud_ajax("sintomas", $(this).val(), "updateMedicalAttention");
  });

  $("#description").on("focusout", function () {
    crud_ajax(
      "descripcion_diagnostico",
      $(this).val(),
      "updateMedicalAttention"
    );
  });

  $("#other").on("focusout", function () {
    crud_ajax("otros", $(this).val(), "updateMedicalAttention");
  });

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
      url: "bd/admission.php",
      method: "POST",
      data: { option: "selectCIE10" },
      dataSrc: "",
    },
    deferRender: true,
    columns: [{ data: "codigo_cie" }, { data: "diagnostico" }],
    //dom: 'Bfrtip'
  });

  $("#CIE10").on("show.bs.modal", function () {
    //tableCIE10.ajax.reload();
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
    crud_ajax(
      "cod_cie10",
      dataSelectCIE10[0].codigo_cie,
      "updateMedicalAttention"
    );
  });

  var tableExamen = $("#table-examen").DataTable({
    select: "multiple",
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
      url: "bd/admission.php",
      method: "POST",
      data: { option: "selectExamen" },
      dataSrc: "",
    },
    deferRender: true,
    columns: [{ data: "nombre_examen" }],
    //dom: 'Bfrtip'
  });

  $("#modal-examen").on("show.bs.modal", function () {
    //tableCIE10.ajax.reload();
  });

  tableExamen.on("select", function (e, dt, type, indexes) {
    $(".btn-examen").prop("disabled", false);
  });

  tableExamen.on("deselect", function (e, dt, type, indexes) {
    if (tableExamen.rows(".selected").data().length == 0)
      $(".btn-examen").prop("disabled", true);
  });

  $(".btn-examen").on("click", function () {
    var dataSelectExamen = tableExamen.rows(".selected").data();
    var valExamen = "";
    arrayExamen = "";
    $.each(dataSelectExamen, function (index, value) {
      if (index != 0) valExamen += ", ";
      valExamen += value.nombre_examen;
      if (index != 0) arrayExamen += ", ";
      arrayExamen += value.id_examen;
    });
    console.log(arrayExamen);
    //crud_ajax("cod_diag_cie", dataSelectCIE10[0].codigo_cie, "updatePrehEC");
  });

  var tableMedical = $("#table-medical").DataTable({
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
      url: "bd/admission.php",
      method: "POST",
      data: { option: "selectMedical" },
      dataSrc: "",
    },
    deferRender: true,
    columns: [{ data: "producto" }],
    //dom: 'Bfrtip'
  });

  $("#modal-medical-search").on("show.bs.modal", function () {
    tableMedical.ajax.reload();
  });

  tableMedical.on("select", function (e, dt, type, indexes) {
    $(".btn-medical-search").prop("disabled", false);
  });

  tableMedical.on("deselect", function (e, dt, type, indexes) {
    $(".btn-medical-search").prop("disabled", true);
  });

  $(".btn-medical").on("click", function () {});

  $(".btn-medical-search").on("click", function () {
    tempIdMedical = tableMedical.rows(".selected").data()[0].id;
    $("#input-medical").val(tableMedical.rows(".selected").data()[0].producto);
    /*var dataSelectExamen = tableMedical.rows(".selected").data();
    var valExamen = "";
    arrayExamen = "";
    $.each(dataSelectExamen, function (index, value) {
      if (index != 0) valExamen += ", ";
      valExamen += value.nombre_examen;
      if (index != 0) arrayExamen += ", ";
      arrayExamen += value.id_examen;
    });
    console.log(arrayExamen);
    //crud_ajax("cod_diag_cie", dataSelectCIE10[0].codigo_cie, "updatePrehEC");*/
  });

  setInterval(function time() {
    var d = new Date();
    var hours = 24 - d.getHours();
    var min = 60 - d.getMinutes();
    //if ((min + "").length == 1) min = "0" + min;
    var sec = 60 - d.getSeconds();
    //if ((sec + "").length == 1) sec = "0" + min;
    $("#countdown #hour").html(hours);
    $("#countdown #min").html(min);
    $("#countdown #sec").html(sec);
  }, 1000);
});
