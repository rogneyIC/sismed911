$(function () {
  var id_patient,
    focus_value,
    dataSelect,
    updatePatient = false;

  var tablePatient = $("#tablePatient").DataTable({
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
      data: { option: "selectPatient" },
      dataSrc: "",
    },
    deferRender: true,
    columns: [
      { data: "id_paciente" },
      { data: "nombre1" },
      { data: "apellido1" },
    ],
    //dom: 'Bfrtip'
  });

  function crud_ajax(field, val, option) {
    if (focus_value != val) {
      $.ajax({
        url: "bd/admission.php",
        method: "POST",
        data: {
          option: option,
          idP: id_patient,
          setField: val,
          field: field,
        },
      })
        .done(function () {
          tablePatient.ajax.reload();
        })
        .fail(function () {
          console.log("error");
        });
    }
  }

  function loadIde(update) {
    $.ajax({
      url: "bd/admission.php",
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
              value: value.id_tipo,
              text: value.descripcion,
            })
          );
          if (update) {
            if (dataSelect[0].tipo_doc == value.id_tipo) {
              $("#p_ide option[value=" + value.id_tipo + "]").attr(
                "selected",
                true
              );
            }
          }
        });
      })
      .fail(function () {
        console.log("error");
      });
  }

  function loadTypeAge(update) {
    $.ajax({
      url: "bd/admission.php",
      method: "POST",
      data: {
        option: "selectTypeAge",
      },
      dataType: "json",
    })
      .done(function (data) {
        $("#p_typeage").empty();
        $("#p_typeage").append(
          $("<option>", {
            value: 0,
            text: "Seleccione...",
          })
        );
        $.each(data, function (index, value) {
          $("#p_typeage").append(
            $("<option>", {
              value: value.id_edad,
              text: value.nombre_edad,
            })
          );
          if (update) {
            if (dataSelect[0].cod_edad == value.id_edad) {
              $("#p_typeage option[value=" + value.id_edad + "]").attr(
                "selected",
                true
              );
            }
          }
        });
      })
      .fail(function () {
        console.log("error");
      });
  }

  $.ajax({
    url: "bd/admission.php",
    method: "POST",
    data: {
      option: "selectIngress",
    },
    dataType: "json",
  })
    .done(function (data) {
      $("#ingress").empty();
      $("#ingress").append(
        $("<option>", {
          value: 0,
          text: "-- Seleccione una opción --",
        })
      );
      $.each(data, function (index, value) {
        $("#ingress").append(
          $("<option>", {
            value: value.id_ingreso,
            text: value.nombre_ingreso,
          })
        );
      });
    })
    .fail(function () {
      console.log("error");
    });

  $("#ingress").on("change", function (e) {
    $("#ingress option:selected").val() != 0 && $("#idP").val() != ""
      ? $("#btnSaveAdmission").prop("disabled", false)
      : $("#btnSaveAdmission").prop("disabled", true);
    if ($("#ingress option:selected").text() == "Ambulancia 911") {
      $.trim($("#code").val()) != ""
        ? $("#btnSaveAdmission").prop("disabled", false)
        : $("#btnSaveAdmission").prop("disabled", true);
      $("#labelCode").prop("hidden", false);
      $("#code").prop("hidden", false);
    } else {
      $("#labelCode").prop("hidden", true);
      $("#code").prop("hidden", true);
      $("#code").val("");
    }
  });

  $("#btnSaveAdmission").on("click", function (e) {
    e.preventDefault();
    $.ajax({
      url: "bd/admission.php",
      method: "POST",
      data: {
        option: "insertAdmission",
        ingress: $("#ingress option:selected").val(),
        cod911: $("#code").val() == "" ? "null" : $("#code").val(),
        idP: id_patient,
        acompañante:
          $("#acompañante").val() == ""
            ? "null"
            : "'" + $("#acompañante").val() + "'",
        phone_acompañante:
          $("#phone_acompañante").val() == ""
            ? "null"
            : "'" + $("#phone_acompañante").val() + "'",
      },
    })
      .done(function () {
        $("#form_admission").trigger("reset");
        $("#collapseOne").collapse("hide");
        $("#labelCode").prop("hidden", true);
        $("#code").prop("hidden", true);
        $("#btnSaveAdmission").prop("disabled", true);
      })
      .fail(function () {
        console.log("error");
      });
  });

  $(".showModal").on("click", function () {
    $("#patient").modal();
  });

  $(".addPatient").on("click", function () {
    $("#form_paciente").trigger("reset");
    loadIde(false);
    loadTypeAge(false);
    $("#idP").val("");
    $("#collapseOne").collapse("show");
    $("#btnAddPatient").prop("hidden", false);
    updatePatient = false;
    $("#btnSaveAdmission").prop("disabled", true);
  });

  tablePatient.on("select", function (e, dt, type, indexes) {
    dataSelect = tablePatient.rows(indexes).data();
    id_patient = dataSelect[0].id_paciente;
    $(".btnPatient").prop("disabled", false);
  });

  tablePatient.on("deselect", function (e, dt, type, indexes) {
    $(".btnPatient").prop("disabled", true);
  });

  $(".btnPatient").on("click", function () {
    var dataSelectPatient = tablePatient.rows(".selected").data();
    $("#btnAddPatient").prop("hidden", true);
    updatePatient = true;
    $("#idP").val(
      dataSelectPatient[0].id_paciente +
        "-" +
        (dataSelectPatient[0].nombre1 ? dataSelectPatient[0].nombre1 : "") +
        " " +
        (dataSelectPatient[0].apellido1 ? dataSelectPatient[0].apellido1 : "")
    );
    $.ajax({
      url: "bd/admission.php",
      method: "POST",
      data: {
        option: "selectPatient",
        idP: id_patient,
      },
      dataType: "json",
    })
      .done(function (data) {
        //Se actualiza formulario paciente
        $("#form_paciente").trigger("reset");
        loadIde(true);
        $("#p_number").val(data[0].num_doc);
        $("#p_exp").val(data[0].expendiente);
        $("#p_date").val(data[0].fecha_nacido);
        $("#p_age").val(data[0].edad);
        loadTypeAge(true);
        //$("#p_typeage").val(data[0].nombre_edad);
        if (data[0].genero == 1) {
          $("#p_genM").prop("checked", true);
        } else {
          $("#p_genF").prop("checked", true);
        }
        $("#p_phone").val(data[0].telefono);
        $("#p_name1").val(data[0].nombre1);
        $("#p_name2").val(data[0].nombre2);
        $("#p_lastname1").val(data[0].apellido1);
        $("#p_lastname2").val(data[0].apellido2);
        $("#p_segS").val(data[0].aseguradro);
        $("#p_address").val(data[0].direccion);
        $("#p_obs").html(data[0].observacion);
        $("#collapseOne").collapse("show");
        if ($("#ingress option:selected").text() == "Ambulancia 911") {
          $.trim($("#code").val()) != ""
            ? $("#btnSaveAdmission").prop("disabled", false)
            : $("#btnSaveAdmission").prop("disabled", true);
        } else if ($("#ingress option:selected").val() != 0) {
          $("#btnSaveAdmission").prop("disabled", false);
        } else {
          $("#btnSaveAdmission").prop("disabled", true);
        }
      })
      .fail(function (error) {
        console.log(error);
      });
  });

  $("#btnAddPatient").on("click", function (e) {
    e.preventDefault();
    $.ajax({
      url: "bd/admission.php",
      method: "POST",
      dataType: "json",
      data: {
        option: "insertPatient",
        patient: {
          expendiente: $("#p_exp").val(),
          num_doc: $("#p_number").val(),
          tipo_doc: $("#p_ide option:selected").val(),
          nombre1: $("#p_name1").val(),
          nombre2: $("#p_name2").val(),
          apellido1: $("#p_lastname1").val(),
          apellido2: $("#p_lastname2").val(),
          genero: $("input:checked").val() == "m" ? 1 : 2,
          edad: $("#p_age").val(),
          fecha_nacido: $("#p_date").val(),
          cod_edad: $("#p_typeage option:selected").val(),
          telefono: $("#p_phone").val(),
          //celular:
          direccion: $("#p_address").val(),
          //email:
          aseguradro: $("#p_segS").val(),
          observacion: $("#p_obs").val(),
          //nss:
          //usu_sede:
          //prehospitalario:
        },
      },
    })
      .done(function (data) {
        $("#btnAddPatient").prop("hidden", true);
        $("#idP").val(
          data[0].id_paciente +
            "-" +
            $("#p_name1").val() +
            " " +
            $("#p_lastname1").val()
        );
        if ($("#ingress option:selected").val() != 0)
          $("#btnSaveAdmission").prop("disabled", false);
      })
      .fail(function () {
        console.log("error");
      });
  });

  $("#code").change(function () {
    $.trim($(this).val()) != "" && $("#idP").val() != ""
      ? $("#btnSaveAdmission").prop("disabled", false)
      : $("#btnSaveAdmission").prop("disabled", true);
  });

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
    if (updatePatient && $("#p_ide option:selected").val() != 0)
      crud_ajax("tipo_doc", $("#p_ide option:selected").val(), "updateP");
  });

  /* Validación de número de cédula dominicana */
  $("#p_number").on("focusout", function () {
    if ($("#p_ide option:selected").val() == 1) {
      if (number_validate($(this).val())) {
        $(".form-control[name='p_number']").removeClass("is-invalid");
        if (updatePatient) crud_ajax("num_doc", $(this).val(), "updateP");
      } else {
        $(".form-control[name='p_number']").addClass("is-invalid");
      }
    } else {
      $(".form-control[name='p_number']").removeClass("is-invalid");
      if (updatePatient) crud_ajax("num_doc", $(this).val(), "updateP");
    }
  });

  $("#p_exp").on("focusout", function () {
    if (updatePatient) crud_ajax("expendiente", $(this).val(), "updateP");
  });

  $("#p_date").on("focusout", function () {
    if (updatePatient) crud_ajax("fecha_nacido", $(this).val(), "updateP");
  });

  $("#p_age").on("focusout", function () {
    if (updatePatient) crud_ajax("edad", $(this).val(), "updateP");
  });

  $("#p_typeage").on("change", function () {
    if (updatePatient && $("#p_typeage option:selected").val() != 0)
      crud_ajax("cod_edad", $("#p_typeage option:selected").val(), "updateP");
  });

  $(".gender").on("click", function () {
    val = $("input:checked").val();
    console.log(val);
    if (updatePatient) crud_ajax("genero", val == "m" ? 1 : 2, "updateP");
  });

  $("#p_phone").on("focusout", function () {
    if (updatePatient) crud_ajax("telefono", $(this).val(), "updateP");
  });

  $("#p_name1").on("focusout", function () {
    if (updatePatient) {
      crud_ajax("nombre1", $(this).val(), "updateP");
      $("#idP").val(
        id_patient + "-" + $(this).val() + " " + $("#p_lastname1").val()
      );
    }
  });

  $("#p_name2").on("focusout", function () {
    if (updatePatient) crud_ajax("nombre2", $(this).val(), "updateP");
  });

  $("#p_lastname1").on("focusout", function () {
    if (updatePatient) {
      crud_ajax("apellido1", $(this).val(), "updateP");
      $("#idP").val(
        id_patient + "-" + $("#p_name1").val() + " " + $(this).val()
      );
    }
  });

  $("#p_lastname2").on("focusout", function () {
    if (updatePatient) crud_ajax("apellido2", $(this).val(), "updateP");
  });

  $("#p_segS").on("focusout", function () {
    if (updatePatient) crud_ajax("aseguradro", $(this).val(), "updateP");
  });

  $("#p_address").on("focusout", function () {
    if (updatePatient) crud_ajax("direccion", $(this).val(), "updateP");
  });

  $("#p_obs").on("focusout", function () {
    if (updatePatient) crud_ajax("observacion", $(this).val(), "updateP");
  });
  //end formulario paciente

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
});
