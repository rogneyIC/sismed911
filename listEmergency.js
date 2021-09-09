$(function () {
  window.jsPDF = window.jspdf.jsPDF;
  var dataSelect,
    idMedical,
    idMA,
    focus_value,
    arrayExamen = [];
  var tableEmergency = $("#tableEmergency").DataTable({
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
      data: { option: "selectEmergency" },
      dataSrc: "",
    },
    deferRender: true,
    columns: [
      { data: "clasificacion_admision" },
      { defaultContent: "" },
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
          var fond;
          switch (row.clasificacion_admision) {
            case "Rojo":
              fond = "text-white bg-red";
              break;
            case "Naranja":
              fond = "text-white bg-orange";
              break;
            case "Amarillo":
              fond = "bg-yellow";
              break;
          }
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
          return (
            "<div id='timer'><div class='row'><div class='col countdown-wrapper text-center'><div class='card bg-light'><div class='card-block'><div id='countdown' class='text-center d-flex justify-content-center'><span class='countdown-section'><span id='hour_" +
            row.id_admision +
            "' class='timer'>0</span><span class='countdown-period d-block'>Horas</span></span><span class='countdown-section'><span id='min_" +
            row.id_admision +
            "' class='timer'>0</span><span class='countdown-period d-block'>Minutos</span></span><span class='countdown-section'><span id='sec_" +
            row.id_admision +
            "' class='timer'>0</span><span class='countdown-period d-block'>Segundos</span></span></div></div></div></div></div></div>"
          );
        },
        targets: 1,
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
    initComplete: function () {
      /*console.log(tableEmergency.rows().data());
      console.log(tableEmergency.rows()[0]);
      console.log(tableEmergency.rows(0));*/
      console.log(tableEmergency.rows(1).column(1));
      $.each(tableEmergency.rows()[0], function (index, value) {
        var row = tableEmergency.rows(value).data()[0];
        switch (row.clasificacion_admision) {
          case "Amarillo":
            break;
          case "Naranja":
            break;
          case "Rojo":
            break;
        }
      });
    },
  });

  tableEmergency.on("select", function (e, dt, type, indexes) {
    dataSelect = tableEmergency.rows(indexes).data()[0];
    idMA = dataSelect.id_atencionmedica;

    $.ajax({
      url: "bd/admission.php",
      method: "POST",
      dataType: "json",
      data: {
        option: "selectAttentionExamen",
        idMA: idMA,
      },
    })
      .done(function (data) {
        $("#tableExamen>tbody").empty();
        appendTableExamen(data);
      })
      .fail(function () {
        console.log("error");
      });

    $.ajax({
      url: "bd/admission.php",
      method: "POST",
      dataType: "json",
      data: {
        option: "selectAttentionMedical",
        idMA: idMA,
      },
    })
      .done(function (data) {
        $("#tableMedical>tbody").empty();
        appendTableMedical(data);
      })
      .fail(function () {
        console.log("error");
      });

    $("#collapseOne").collapse("show");
    /* Se actualiza el fromulario */
    $("#form_emergency").trigger("reset");
    $("select option").attr("selected", false);
    $("#general option[value=" + dataSelect.id_general + "]").attr(
      "selected",
      true
    );
    $("#cabeza option[value=" + dataSelect.id_cabeza + "]").attr(
      "selected",
      true
    );
    $("#ojo option[value=" + dataSelect.id_ojo + "]").attr("selected", true);
    $("#otorrino option[value=" + dataSelect.id_otorrino + "]").attr(
      "selected",
      true
    );
    $("#boca option[value=" + dataSelect.id_boca + "]").attr("selected", true);
    $("#cuello option[value=" + dataSelect.id_cuello + "]").attr(
      "selected",
      true
    );
    $("#torax option[value=" + dataSelect.id_torax + "]").attr(
      "selected",
      true
    );
    $("#corazon option[value=" + dataSelect.id_corazon + "]").attr(
      "selected",
      true
    );
    $("#pulmon option[value=" + dataSelect.id_pulmon + "]").attr(
      "selected",
      true
    );
    $("#abdomen option[value=" + dataSelect.id_abdomen + "]").attr(
      "selected",
      true
    );
    $("#pelvis option[value=" + dataSelect.id_pelvis + "]").attr(
      "selected",
      true
    );
    $("#rectal option[value=" + dataSelect.id_rectal + "]").attr(
      "selected",
      true
    );
    $("#genital option[value=" + dataSelect.id_genital + "]").attr(
      "selected",
      true
    );
    $("#extremidad option[value=" + dataSelect.id_extremidad + "]").attr(
      "selected",
      true
    );
    $("#neuro option[value=" + dataSelect.id_neuro + "]").attr(
      "selected",
      true
    );
    $("#piel option[value=" + dataSelect.id_piel + "]").attr("selected", true);
    dataSelect.cod_cie10
      ? $("#ec_cie10").val(dataSelect.cod_cie10 + " " + dataSelect.diagnostico)
      : $("#ec_cie10").val("");
    $("#sign").html(dataSelect.sintomas);
    $("#description").html(dataSelect.descripcion_diagnostico);
    $("#other").html(dataSelect.otros);
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
          tableEmergency.ajax.reload();
        })
        .fail(function () {
          console.log("error");
        });
    }
  }

  function appendTableExamen(data) {
    if (data)
      $.each(data, function (index, value) {
        $("#tableExamen>tbody").append(
          "<tr id='" +
            value.id_atencionmedica_examen +
            "'><td>" +
            value.nombre_examen +
            "</td><td><button type='button' class='btn btn-danger delete-examen'><i class='fa fa-trash'></i> Eliminar</button></td></tr>"
        );
      });
  }

  function appendTableMedical(data) {
    if (data)
      $.each(data, function (index, value) {
        $("#tableMedical>tbody").append(
          "<tr id='" +
            value.id_atencionmedica_medicamentos +
            "'><td class='name'>" +
            value.producto +
            "</td><td class='dosis'>" +
            value.dosis +
            "</td><td><button type='button' class='btn btn-danger delete-medical'><i class='fa fa-trash'></i> Eliminar</button></td></tr>"
        );
      });
  }

  function createDataTableMedical() {
    return $("#table-medical").DataTable({
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
        data: { option: "selectMedical", idMA: idMA },
        dataSrc: "",
      },
      deferRender: true,
      columns: [{ data: "producto" }],
      //dom: 'Bfrtip'
    });
  }

  function createDataTableExamen() {
    return $("#table-examen").DataTable({
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
        data: { option: "selectExamen", idMA: idMA },
        dataSrc: "",
      },
      deferRender: true,
      columns: [{ data: "nombre_examen" }],
      //dom: 'Bfrtip'
    });
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

  var tableMedical = createDataTableMedical();

  tableMedical.on("select", function (e, dt, type, indexes) {
    $(".btn-medical-search").prop("disabled", false);
  });

  tableMedical.on("deselect", function (e, dt, type, indexes) {
    $(".btn-medical-search").prop("disabled", true);
  });

  $(".btn-medical").on("click", function () {
    $.ajax({
      url: "bd/admission.php",
      method: "POST",
      dataType: "json",
      data: {
        option: "insertMedical",
        idMA: idMA,
        idMAM: idMedical,
        dosis: $("#dosis").val(),
      },
    })
      .done(function (data) {
        appendTableMedical([
          {
            id_atencionmedica_medicamentos:
              data[0].id_atencionmedica_medicamentos,
            producto: $("#input-medical").val(),
            dosis: $("#dosis").val(),
          },
        ]);
        //appendTableMedical
        /*var array = [];
        array.push({

        });*/
      })
      .fail(function () {
        console.log("error");
      });
  });

  $("#print-medical").on("click", function () {
    //console.log(dataSelect);
    var doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Orden de medicamentos", 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);

    doc.autoTable({
      head: [["Nombre hospital", "Fecha expedición"]],
      body: [["Hospital", "09/09/2021 10:49:28"]],
      startY: 30,
    });

    var name = dataSelect.nombre1;
    if (dataSelect.nombre2) name += " " + dataSelect.nombre2;
    if (dataSelect.apellido1) name += " " + dataSelect.apellido1;
    if (dataSelect.apellido2) name += " " + dataSelect.apellido2;
    var age = dataSelect.edad + " " + dataSelect.nombre_edad;

    doc.autoTable({
      head: [
        ["Nombre paciente", "Identificacion", "Edad", "Código Diagnóstico"],
      ],
      body: [[name, dataSelect.num_doc, age, dataSelect.cod_cie10]],
    });

    var body = [];
    $("#tableMedical tr").each(function (index, value) {
      if (index > 0) {
        body.push([
          $(this).find("td.name").text(),
          $(this).find("td.dosis").text(),
        ]);
      }
    });

    doc.autoTable({
      head: [["Medicamentos", "Dosis"]],
      body: body,
    });

    doc.autoTable({
      head: [["Prescribe (médico)"]],
      body: [["David Paredes"]],
    });

    doc.save("orden_medicamentos.pdf");
  });

  $("#modal-medical").on("show.bs.modal", function () {
    tableMedical.destroy();
    tableMedical = createDataTableMedical();
    $("#input-medical").val("");
    $("#dosis").val("");
    $(".btn-medical").prop("disabled", true);
  });

  $("#modal-medical-search").on("show.bs.modal", function () {
    tableMedical.ajax.reload();
    $(".btn-medical-search").prop("disabled", true);
  });

  $("#dosis").on("keyup", function (e) {
    $.trim($(this).val()) != "" && $("#input-medical").val() != 0
      ? $(".btn-medical").prop("disabled", false)
      : $(".btn-medical").prop("disabled", true);
  });

  $(document).on("click", ".delete-medical", function (e) {
    $.ajax({
      url: "bd/admission.php",
      method: "POST",
      data: {
        option: "deleteAttentionMedical",
        idMAM: e.target.parentElement.parentElement.id,
      },
    })
      .done(function (data) {
        $(e.target.parentElement.parentElement).remove();
      })
      .fail(function () {
        console.log("error");
      });
  });

  $(".btn-medical-search").on("click", function () {
    idMedical = tableMedical.rows(".selected").data()[0].id;
    $("#input-medical").val(tableMedical.rows(".selected").data()[0].producto);
    if ($.trim($("#dosis").val()) != "")
      $(".btn-medical").prop("disabled", false);
  });

  var tableExamen = createDataTableExamen();

  $("#modal-examen").on("show.bs.modal", function () {
    tableExamen.destroy();
    tableExamen = createDataTableExamen();
  });

  tableExamen.on("select", function (e, dt, type, indexes) {
    $(".btn-examen").prop("disabled", false);
  });

  tableExamen.on("deselect", function (e, dt, type, indexes) {
    if (tableExamen.rows(".selected").data().length == 0)
      $(".btn-examen").prop("disabled", true);
  });

  $(document).on("click", ".delete-examen", function (e) {
    $.ajax({
      url: "bd/admission.php",
      method: "POST",
      data: {
        option: "deleteAttentionExamen",
        idMAE: e.target.parentElement.parentElement.id,
      },
    })
      .done(function (data) {
        $(e.target.parentElement.parentElement).remove();
      })
      .fail(function () {
        console.log("error");
      });
  });

  $(".btn-examen").on("click", function () {
    var dataSelectExamen = [];
    $.each(tableExamen.rows(".selected").data(), function (index, value) {
      dataSelectExamen.push(value.id_examen);
    });

    $.ajax({
      url: "bd/admission.php",
      method: "POST",
      dataType: "json",
      data: {
        option: "insertExamen",
        idMA: idMA,
        dataExamen: dataSelectExamen,
      },
    })
      .done(function (data) {
        var array = [];
        $.each(tableExamen.rows(".selected").data(), function (index, value) {
          array.push({
            id_atencionmedica_examen: data[index].id_atencionmedica_examen,
            nombre_examen: value.nombre_examen,
          });
        });
        console.log(array);
        appendTableExamen(array);
      })
      .fail(function () {
        console.log("error");
      });
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
