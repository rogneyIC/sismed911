<?php
try {
    $connect = pg_connect("host=localhost dbname=sismed911 user=postgres password=root");
} catch (Exception $e) {
    die("El error de Conexión es: " . $e->getMessage());
}

$id_maestro = (isset($_POST['idM'])) ? $_POST['idM'] : '';
$id_paciente = (isset($_POST['idP'])) ? $_POST['idP'] : '';
$id_evalC = (isset($_POST['idEC'])) ? $_POST['idEC'] : '';
$option = (isset($_POST['option'])) ? $_POST['option'] : '';
$field = (isset($_POST['field'])) ? $_POST['field'] : '';
$setField = (isset($_POST['setField'])) ? $_POST['setField'] : '';

switch ($option) {
    case 'select':
        $sql = "SELECT *, preh_maestro.direccion as direccion_maestro, preh_maestro.telefono as telefono_maestro, preh_maestro.observacion as observacion_maestro, incidentes.nombre_es as nombre_incidente, pacientegeneral.direccion as direccion_paciente, pacientegeneral.telefono as telefono_paciente, pacientegeneral.observacion as observacion_paciente, tipo_id.descripcion as ide_descripcion, cie10.diagnostico as cie10_diagnostico
        FROM preh_maestro
        LEFT JOIN pacientegeneral ON preh_maestro.cod_casopreh = pacientegeneral.cod_casointerh
        LEFT JOIN hospitalesgeneral ON preh_maestro.hospital_destino = hospitalesgeneral.id_hospital
        LEFT JOIN incidentes ON preh_maestro.incidente = incidentes.id_incidente
        LEFT JOIN tipo_id ON pacientegeneral.tipo_doc = tipo_id.id_tipo
        LEFT JOIN tipo_edad ON pacientegeneral.cod_edad = tipo_edad.id_edad
        LEFT JOIN preh_evaluacionclinica ON preh_maestro.cod_casopreh = preh_evaluacionclinica.cod_casopreh
        LEFT JOIN cie10 ON preh_evaluacionclinica.cod_diag_cie = cie10.codigo_cie
        LEFT JOIN triage ON preh_evaluacionclinica.triage = triage.id_triage
        WHERE pacientegeneral.prehospitalario = '1' 
        ORDER BY preh_maestro.cod_casopreh ASC";
        $result = pg_query($connect, $sql);
        if (!$result) {
            echo "An error occurred.\n";
            exit;
        }
        $data = pg_fetch_all($result);
        print json_encode($data, JSON_UNESCAPED_UNICODE);
        break;
    case 'selectCIE10':
        $sql = "SELECT * FROM cie10 ORDER BY codigo_cie ASC";
        $result = pg_query($connect, $sql);
        if (!$result) {
            echo "An error occurred.\n";
            exit;
        }
        $data = pg_fetch_all($result);
        print json_encode($data, JSON_UNESCAPED_UNICODE);
        break;
    case 'selectIDE':
        $sql = "SELECT * FROM tipo_id ORDER BY id_tipo ASC";
        $result = pg_query($connect, $sql);
        if (!$result) {
            echo "An error occurred.\n";
            exit;
        }
        $data = pg_fetch_all($result);
        print json_encode($data, JSON_UNESCAPED_UNICODE);
        break;
    case 'selectTriage':
        $sql = "SELECT * FROM triage ORDER BY id_triage ASC";
        $result = pg_query($connect, $sql);
        if (!$result) {
            echo "An error occurred.\n";
            exit;
        }
        $data = pg_fetch_all($result);
        print json_encode($data, JSON_UNESCAPED_UNICODE);
        break;
    case 'selectHosp':
        $sql = "SELECT * FROM hospitalesgeneral ORDER BY id_hospital ASC";
        $result = pg_query($connect, $sql);
        if (!$result) {
            echo "An error occurred.\n";
            exit;
        }
        $data = pg_fetch_all($result);
        print json_encode($data, JSON_UNESCAPED_UNICODE);
        break;
    case 'selectCierre':
        $sql = "SELECT * FROM tipo_cierrecaso ORDER BY id_tranlado_fallido ASC";
        $result = pg_query($connect, $sql);
        if (!$result) {
            echo "An error occurred.\n";
            exit;
        }
        $data = pg_fetch_all($result);
        print json_encode($data, JSON_UNESCAPED_UNICODE);
        break;
    case 'selectSeguim':
        $sql = "SELECT * FROM preh_seguimiento ORDER BY id_seguimiento ASC";
        $result = pg_query($connect, $sql);
        if (!$result) {
            echo "An error occurred.\n";
            exit;
        }
        $data = pg_fetch_all($result);
        print json_encode($data, JSON_UNESCAPED_UNICODE);
        break;
    case 'updateM':
        $sql = "UPDATE preh_maestro SET " . $field . "='" . $setField . "' WHERE cod_casopreh=" . $id_maestro;
        $result = pg_query($connect, $sql);
        if (!$result) {
            echo "An error occurred.\n";
            exit;
        }
        echo $result;
        break;
    case 'cerrarCaso':
        $sql = "UPDATE preh_maestro SET estado=0, cierre=" . $setField . " WHERE cod_casopreh=" . $id_maestro;
        $result = pg_query($connect, $sql);
        if (!$result) {
            echo "An error occurred.\n";
            exit;
        }
        echo $result;
        break;
    case 'updateP':
        if ($field == 'tipo_doc') {
            $sql = "SELECT id_tipo FROM tipo_id WHERE descripcion='" . $setField . "';";
            $result = pg_query($connect, $sql);
            if (!$result) {
                echo "An error occurred.\n";
                exit;
            }
            $data = pg_fetch_all($result);
            $setField = $data[0]['id_tipo'];
        }
        $sql = "UPDATE pacientegeneral SET " . $field . "='" . $setField . "' WHERE id_paciente=" . $id_paciente;
        $result = pg_query($connect, $sql);
        if (!$result) {
            echo "An error occurred.\n";
            exit;
        }
        echo $result;
        break;
    case 'updateEC':
        if ($field == 'triage') {
            $sql = "SELECT id_triage FROM triage WHERE nombre_triage_es='" . $setField . "';";
            $result = pg_query($connect, $sql);
            if (!$result) {
                echo "An error occurred.\n";
                exit;
            }
            $data = pg_fetch_all($result);
            $setField = $data[0]['id_triage'];
        }
        $sql = "UPDATE preh_evaluacionclinica SET " . $field . "='" . $setField . "' WHERE id_evaluacionclinica=" . $id_evalC;
        $result = pg_query($connect, $sql);
        if (!$result) {
            echo "An error occurred.\n";
            exit;
        }
        echo $result;
        break;
    case 'updateSeguim':
        $sql = "SELECT id_seguimiento FROM preh_seguimiento WHERE cod_casopreh=" . $id_maestro;
        $result = pg_query($connect, $sql);
        if (!$result) {
            echo "An error occurred.\n";
            exit;
        }
        $data = pg_fetch_all($result);
        !$data ? $sql = "INSERT INTO preh_seguimiento (cod_casopreh, seguimento, fecha_seguimento) VALUES (" . $id_maestro . ", '" . $setField . "', '" . date("Y-m-d H:i:s") . "');" : $sql = "UPDATE preh_seguimiento SET " . $field . "='" . $setField . "' WHERE cod_casopreh=" . $id_maestro;
        $result = pg_query($connect, $sql);
        if (!$result) {
            echo "An error occurred.\n";
            exit;
        }
        echo $result;
        break;
    case 'delete':
        $sql = "DELETE FROM usuario WHERE id='$userId'";
        $result = pg_query($connect, $sql);
        if (!$result) {
            echo "An error occurred.\n";
            exit;
        }
        break;
}

$conexion = null;
