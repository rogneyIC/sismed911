$(function () {
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
      { data: "id_admision" },
      { data: "fecha_admision" },
      { data: "nombre_ingreso" },
      { defaultContent: "" },
      { data: "expendiente" },
      { defaultContent: "" },
      { data: "acompañante" },
      { data: "genero" },
      { defaultContent: "" },
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
        targets: 5,
      },
      {
        render: function (data, type, row) {
          return row.genero == 1 ? "M" : "F";
        },
        targets: 7,
      },
    ],
    dom: "Bfrtip",
  });

  tableAdmission.on("select", function (e, dt, type, indexes) {
    $("#collapseOne").collapse("show");
  });

  tableAdmission.on("deselect", function (e, dt, type, indexes) {
    //$("#collapseOne").collapse("collapse");
  });
});
