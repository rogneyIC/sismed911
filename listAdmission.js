$(function () {
  var dataSelect;
  var tableAdmission = $("#tableAdmission").DataTable({
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
      data: { option: "selectAdmission" },
      dataSrc: "",
    },
    deferRender: true,
    columns: [
      { data: "expendiente" },
      { defaultContent: "" },
      { data: "fecha_admision" },
      { data: "nombre_ingreso" },
      { data: "cod911" },
      { data: "genero" },
      { data: "acompañante" },
    ],
    columnDefs: [
      {
        render: function (data, type, row) {
          var patient = row.nombre1 ? row.nombre1 : "";
          patient += row.nombre2 ? " " + row.nombre2 : "";
          patient += row.apellido1 ? " " + row.apellido1 : "";
          patient += row.apellido2 ? " " + row.apellido2 : "";
          return patient;
        },
        targets: 1,
      },
      {
        render: function (data, type, row) {
          return row.genero == 1 ? "M" : "F";
        },
        targets: 5,
      },
    ],
    dom: "Bfrtip",
  });

  tableAdmission.on("select", function (e, dt, type, indexes) {
    $("#collapseOne").collapse("show");
    dataSelect = tableAdmission.rows(indexes).data();

    //Se actualiza el formulario
    $("#form_admission").trigger("reset");
    $("select option").attr("selected", false);
    $("#attention option[value=" + dataSelect[0].id_motivoatencion + "]").attr(
      "selected",
      true
    );
    switch (dataSelect[0].id_motivoatencion) {
      case "1":
        $(
          "#locationTrauma option[value=" +
            dataSelect[0].id_localizaciontrauma +
            "]"
        ).attr("selected", true);
        $(
          "#causeTrauma option[value=" + dataSelect[0].id_causatrauma + "]"
        ).attr("selected", true);
        break;
      case "2":
        $("#system option[value=" + dataSelect[0].id_sistema + "]").attr(
          "selected",
          true
        );
        break;
    }
    $("#attention").trigger("change");
    $("#glasgow").val(dataSelect[0].glasgow_admision);
    $("#pas").val(dataSelect[0].pas_admision);
    $("#pad").val(dataSelect[0].pas_admision);
    $("#fc").val(dataSelect[0].pas_admision);
    $("#so2").val(dataSelect[0].pas_admision);
    $("#fr").val(dataSelect[0].pas_admision);
    $("#temp").val(dataSelect[0].pas_admision);
    if (dataSelect[0].clasificacion_admision)
      $(
        "#classification option[value=" + dataSelect[0].clasificacion_admision + "]"
      ).attr("selected", true);
    $("#classification").trigger("change");
    if (dataSelect[0].dolor)
      $("#dolor option[value=" + dataSelect[0].dolor + "]").attr(
        "selected",
        true
      );
    $("#signal").val(dataSelect[0].sintomas_signos);
    $("#id_signal").val(dataSelect[0].id_signos);
    $("#motivation").html(dataSelect[0].motivo_consulta);
    $("#signalDescription").html(dataSelect[0].signos_sintomas);
  });

  tableAdmission.on("deselect", function (e, dt, type, indexes) {
    //$("#collapseOne").collapse("hide");
  });

  $.ajax({
    url: "bd/admission.php",
    method: "POST",
    data: {
      option: "loadSelectAdmission",
    },
    dataType: "json",
  })
    .done(function (data) {
      $("#attention").empty();
      $("#attention").append(
        $("<option>", {
          value: 0,
          text: "-- Seleccione una opción --",
        })
      );

      $("#locationTrauma").empty();
      $("#locationTrauma").append(
        $("<option>", {
          value: 0,
          text: "-- Seleccione una opción --",
        })
      );

      $("#causeTrauma").empty();
      $("#causeTrauma").append(
        $("<option>", {
          value: 0,
          text: "-- Seleccione una opción --",
        })
      );

      $("#system").empty();
      $("#system").append(
        $("<option>", {
          value: 0,
          text: "-- Seleccione una opción --",
        })
      );

      $.each(data["attention"], function (index, value) {
        $("#attention").append(
          $("<option>", {
            value: value.id_motivoatencion,
            text: value.nombre_motivoatencion,
          })
        );
      });

      $.each(data["locationTrauma"], function (index, value) {
        $("#locationTrauma").append(
          $("<option>", {
            value: value.id_localizaciontrauma,
            text: value.nombre_localizaciontrauma,
          })
        );
      });

      $.each(data["causeTrauma"], function (index, value) {
        $("#causeTrauma").append(
          $("<option>", {
            value: value.id_salaCausa,
            text: value.nombre_causaTrauma,
          })
        );
      });

      $.each(data["system"], function (index, value) {
        $("#system").append(
          $("<option>", {
            value: value.id_sistema,
            text: value.nombre_sistema,
          })
        );
      });
    })
    .fail(function () {
      console.log("error");
    });

  $("#attention").on("change", function () {
    switch ($("#attention option:selected").val()) {
      case "0":
        $("#parentLocationTrauma").prop("hidden", true);
        $("#parentCauseTrauma").prop("hidden", true);
        $("#parentSystem").prop("hidden", true);
        $(".signal_search").prop("disabled", true);
        break;
      case "1":
        $("#parentLocationTrauma").prop("hidden", false);
        $("#parentCauseTrauma").prop("hidden", false);
        $("#parentSystem").prop("hidden", true);
        $(".signal_search").prop("disabled", false);
        break;
      case "2":
        $("#parentLocationTrauma").prop("hidden", true);
        $("#parentCauseTrauma").prop("hidden", true);
        $("#parentSystem").prop("hidden", false);
        $(".signal_search").prop("disabled", false);
        break;
    }
  });

  $("#classification").on("change", function () {
    switch ($("#classification option:selected").val()) {
      case "Rojo":
        $("#classification").css("color", "red");
        break;
      case "Naranja":
        $("#classification").css("color", "orange");
        break;
      case "Amarillo":
        $("#classification").css("color", "yellow");
        break;
      case "Azul":
        $("#classification").css("color", "blue");
        break;
      case "Verde":
        $("#classification").css("color", "green");
        break;
      default:
        $("#classification").css("color", "initial");
        break;
    }
  });

  function createDataTable() {
    return $("#tableSignal").DataTable({
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
        data: {
          option: "selectSignal",
          reason:
            $("#attention option:selected").val() != 0
              ? $("#attention option:selected").val()
              : 1,
        },
        dataSrc: "",
      },
      deferRender: true,
      columns: [{ data: "nivel" }, { data: "sintomas_signos" }],
      //dom: 'Bfrtip'
    });
  }

  var tableSignal = createDataTable();

  $("#modalSignal").on("show.bs.modal", function () {
    tableSignal.destroy();
    tableSignal = createDataTable();
    $(".btnSignal").prop("disabled", true);
  });

  tableSignal.on("select", function () {
    $(".btnSignal").prop("disabled", false);
  });

  tableSignal.on("deselect", function () {
    $(".btnSignal").prop("disabled", true);
  });

  $(".btnSignal").on("click", function () {
    var dataSelectCIE10 = tableSignal.rows(".selected").data();
    $("#signal").val(dataSelectCIE10[0].sintomas_signos);
    $("#id_signal").val(dataSelectCIE10[0].id_signos);
  });

  $("#btnSaveTriage").on("click", function (e) {
    e.preventDefault();
    var dataAdmission = {
      id_admission: dataSelect[0].id_admision,
      id_attention: $("#attention option:selected").val(),
      id_locationTrauma: "null",
      id_causeTrauma: "null",
      id_system: "null",
      glasgow:
        $("#glasgow").val() == "" ? "null" : "'" + $("#glasgow").val() + "'",
      pas: $("#pas").val() == "" ? "null" : "'" + $("#pas").val() + "'",
      pad: $("#pad").val() == "" ? "null" : "'" + $("#pad").val() + "'",
      fc: $("#fc").val() == "" ? "null" : "'" + $("#fc").val() + "'",
      so2: $("#so2").val() == "" ? "null" : "'" + $("#so2").val() + "'",
      fr: $("#fr").val() == "" ? "null" : "'" + $("#fr").val() + "'",
      temp: $("#temp").val() == "" ? "null" : "'" + $("#temp").val() + "'",
      classification: "'" + $("#classification option:selected").val() + "'",
      dolor: $("#dolor option:selected").val(),
      id_signal: $("#id_signal").val(),
      motivation:
        $("#motivation").val() == ""
          ? "null"
          : "'" + $("#motivation").val() + "'",
      signalDescription:
        $("#signalDescription").val() == ""
          ? "null"
          : "'" + $("#signalDescription").val() + "'",
      old_classification: dataSelect[0].clasificacion_admision,
    };
    if ($("#attention option:selected").val() == 1) {
      dataAdmission.id_locationTrauma = $(
        "#locationTrauma option:selected"
      ).val();
      dataAdmission.id_causeTrauma = $("#causeTrauma option:selected").val();
    } else if ($("#attention option:selected").val() == 2) {
      dataAdmission.id_system = $("#system option:selected").val();
    }
    $.ajax({
      url: "bd/admission.php",
      method: "POST",
      data: {
        option: "updateAdmission",
        data: dataAdmission,
      },
    })
      .done(function () {
        tableAdmission.ajax.reload();
        $("#collapseOne").collapse("hide");
      })
      .fail(function () {
        console.log("error");
      });
  });
});
