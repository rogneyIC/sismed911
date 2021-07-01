<?php
include_once 'connection.php';

$connection = new connection();
$connect = $connection->connect();

$id_maestro = (isset($_POST['idM'])) ? $_POST['idM'] : '';
$id_paciente = (isset($_POST['idP'])) ? $_POST['idP'] : '';
$id_evalC = (isset($_POST['idEC'])) ? $_POST['idEC'] : '';
$cod_ambulance = (isset($_POST['codA'])) ? $_POST['codA'] : '';
$option = (isset($_POST['option'])) ? $_POST['option'] : '';
$field = (isset($_POST['field'])) ? $_POST['field'] : '';
$setField = (isset($_POST['setField'])) ? $_POST['setField'] : '';

switch ($option) {
    case 'selectPrehMaestro':
        $sql = "SELECT *, preh_maestro.cod_casopreh as cod_casopreh, preh_maestro.direccion as direccion_maestro, preh_maestro.telefono as telefono_maestro, preh_maestro.observacion as observacion_maestro, incidentes.nombre_es as nombre_incidente, pacientegeneral.direccion as direccion_paciente, pacientegeneral.telefono as telefono_paciente, pacientegeneral.observacion as observacion_paciente, preh_servicio_ambulancia.observaciones as observacion_ambulancia, tipo_id.descripcion as ide_descripcion, cie10.diagnostico as cie10_diagnostico
        FROM preh_maestro
        LEFT JOIN pacientegeneral ON preh_maestro.cod_casopreh = pacientegeneral.cod_casointerh
        LEFT JOIN hospitalesgeneral ON preh_maestro.hospital_destino = hospitalesgeneral.id_hospital
        LEFT JOIN incidentes ON preh_maestro.incidente = incidentes.id_incidente
        LEFT JOIN preh_servicio_ambulancia ON preh_maestro.cod_casopreh = preh_servicio_ambulancia.cod_casopreh
        LEFT JOIN preh_evaluacionclinica ON preh_maestro.cod_casopreh = preh_evaluacionclinica.cod_casopreh
        LEFT JOIN tipo_id ON pacientegeneral.tipo_doc = tipo_id.id_tipo
        LEFT JOIN tipo_edad ON pacientegeneral.cod_edad = tipo_edad.id_edad        
        LEFT JOIN cie10 ON preh_evaluacionclinica.cod_diag_cie = cie10.codigo_cie
        LEFT JOIN triage ON preh_evaluacionclinica.triage = triage.id_triage
        LEFT JOIN ambulancias ON preh_servicio_ambulancia.cod_ambulancia = ambulancias.cod_ambulancias
        WHERE pacientegeneral.prehospitalario = '1' 
        ORDER BY preh_maestro.cod_casopreh ASC";
        $result = $connection->execute($connect, $sql);
        if (!$result) {
            echo "An error occurred.\n";
            exit;
        }
        $data = pg_fetch_all($result);
        print json_encode($data, JSON_UNESCAPED_UNICODE);
        break;
    case 'selectInterhMaestro':
        $sql = "SELECT *, interh_maestro.cod_casointerh as cod_casointerh, pacientegeneral.direccion as direccion_paciente, pacientegeneral.telefono as telefono_paciente, pacientegeneral.observacion as observacion_paciente, tipo_id.descripcion as ide_descripcion, cie10.diagnostico as cie10_diagnostico
            FROM interh_maestro 
            LEFT JOIN interh_tiposervicio ON interh_maestro.tipo_serviciointerh = interh_tiposervicio.id_tiposervicion
            LEFT JOIN hospitalesgeneral ON interh_maestro.hospital_origneinterh = hospitalesgeneral.id_hospital
            LEFT JOIN interh_accion ON interh_maestro.accioninterh = interh_accion.id_accion
            LEFT JOIN pacientegeneral ON interh_maestro.cod_casointerh = pacientegeneral.cod_casointerh
            LEFT JOIN servicio_ambulancia ON interh_maestro.cod_casointerh = servicio_ambulancia.cod_casointerh
            LEFT JOIN tipo_id ON pacientegeneral.tipo_doc = tipo_id.id_tipo
            LEFT JOIN tipo_edad ON pacientegeneral.cod_edad = tipo_edad.id_edad
            LEFT JOIN interh_evaluacionclinica ON interh_maestro.cod_casointerh = interh_evaluacionclinica.cod_casointerh
            LEFT JOIN cie10 ON interh_evaluacionclinica.cod_diag_cie = cie10.codigo_cie
            LEFT JOIN triage ON interh_evaluacionclinica.triage = triage.id_triage
            LEFT JOIN ambulancias ON servicio_ambulancia.cod_ambulancia = ambulancias.cod_ambulancias
            WHERE pacientegeneral.prehospitalario = '0'
            ORDER BY interh_maestro.cod_casointerh";
        $result = $connection->execute($connect, $sql);
        if (!$result) {
            echo "An error occurred.\n";
            exit;
        }
        $data = pg_fetch_all($result);
        if ($data) {
            foreach ($data as &$valor) {
                $sql = "SELECT nombre_hospital FROM hospitalesgeneral WHERE id_hospital='" . $valor['hospital_destinointerh'] . "'";
                $res = $connection->execute($connect, $sql);
                if (!$res) {
                    echo "An error occurred.\n";
                    exit;
                }
                $dat = pg_fetch_array($res, 0, PGSQL_NUM);
                $valor['nombre_hospital_destino'] = $dat[0];
            }
        }
        print json_encode($data, JSON_UNESCAPED_UNICODE);
        break;
    case 'selectCIE10':
        $sql = "SELECT * FROM cie10 ORDER BY codigo_cie ASC";
        $result = $connection->execute($connect, $sql);
        if (!$result) {
            echo "An error occurred.\n";
            exit;
        }
        $data = pg_fetch_all($result);
        print json_encode($data, JSON_UNESCAPED_UNICODE);
        break;
    case 'selectIDE':
        $sql = "SELECT * FROM tipo_id ORDER BY id_tipo ASC";
        $result = $connection->execute($connect, $sql);
        if (!$result) {
            echo "An error occurred.\n";
            exit;
        }
        $data = pg_fetch_all($result);
        print json_encode($data, JSON_UNESCAPED_UNICODE);
        break;
    case 'selectTriage':
        $sql = "SELECT * FROM triage ORDER BY id_triage ASC";
        $result = $connection->execute($connect, $sql);
        if (!$result) {
            echo "An error occurred.\n";
            exit;
        }
        $data = pg_fetch_all($result);
        print json_encode($data, JSON_UNESCAPED_UNICODE);
        break;
    case 'selectHosp':
        $sql = "SELECT * FROM hospitalesgeneral ORDER BY id_hospital ASC";
        $result = $connection->execute($connect, $sql);
        if (!$result) {
            echo "An error occurred.\n";
            exit;
        }
        $data = pg_fetch_all($result);
        print json_encode($data, JSON_UNESCAPED_UNICODE);
        break;
    case 'selectCierre':
        $sql = "SELECT * FROM tipo_cierrecaso ORDER BY id_tranlado_fallido ASC";
        $result = $connection->execute($connect, $sql);
        if (!$result) {
            echo "An error occurred.\n";
            exit;
        }
        $data = pg_fetch_all($result);
        print json_encode($data, JSON_UNESCAPED_UNICODE);
        break;
    case 'selectSeguim':
        $sql = "SELECT * FROM preh_seguimiento ORDER BY id_seguimiento ASC";
        $result = $connection->execute($connect, $sql);
        if (!$result) {
            echo "An error occurred.\n";
            exit;
        }
        $data = pg_fetch_all($result);
        print json_encode($data, JSON_UNESCAPED_UNICODE);
        break;
    case 'selectAmbulance':
        $sql = "SELECT * FROM ambulancias WHERE estado=0 ORDER BY id_ambulancias ASC";
        $result = $connection->execute($connect, $sql);
        if (!$result) {
            echo "An error occurred.\n";
            exit;
        }
        $data = pg_fetch_all($result);
        print json_encode($data, JSON_UNESCAPED_UNICODE);
        break;
    case 'updatePrehM':
    case 'updateInterhM':
        $option == 'updatePrehM' ? $sql = "UPDATE preh_maestro SET " . $field . "='" . $setField . "' WHERE cod_casopreh=" . $id_maestro : $sql = "UPDATE interh_maestro SET " . $field . "='" . $setField . "' WHERE cod_casointerh=" . $id_maestro;
        $result = $connection->execute($connect, $sql);
        if (!$result) {
            echo "An error occurred.\n";
            exit;
        }
        echo $result;
        break;
    case 'updateP':
        if ($field == 'tipo_doc') {
            $sql = "SELECT id_tipo FROM tipo_id WHERE descripcion='" . $setField . "';";
            $result = $connection->execute($connect, $sql);
            if (!$result) {
                echo "An error occurred.\n";
                exit;
            }
            $data = pg_fetch_all($result);
            $setField = $data[0]['id_tipo'];
        }
        $sql = "UPDATE pacientegeneral SET " . $field . "='" . $setField . "' WHERE id_paciente=" . $id_paciente;
        $result = $connection->execute($connect, $sql);
        if (!$result) {
            echo "An error occurred.\n";
            exit;
        }
        echo $result;
        break;
    case 'updatePrehEC':
    case 'updateInterhEC':
        if ($field == 'triage') {
            $sql = "SELECT id_triage FROM triage WHERE nombre_triage_es='" . $setField . "';";
            $result = $connection->execute($connect, $sql);
            if (!$result) {
                echo "An error occurred.\n";
                exit;
            }
            $data = pg_fetch_all($result);
            $setField = $data[0]['id_triage'];
        }
        $option == 'updatePrehEC' ? $sql = "UPDATE preh_evaluacionclinica SET " . $field . "='" . $setField . "' WHERE id_evaluacionclinica=" . $id_evalC : $sql = "UPDATE interh_evaluacionclinica SET " . $field . "='" . $setField . "' WHERE id_evaluacionclinica=" . $id_evalC;;
        $result = $connection->execute($connect, $sql);
        if (!$result) {
            echo "An error occurred.\n";
            exit;
        }
        echo $result;
        break;
    case 'updatePrehSeguim':
    case 'updateInterhSeguim':
        $option == 'updatePrehSeguim' ? $sql = "SELECT id_seguimiento FROM preh_seguimiento WHERE cod_casopreh=" . $id_maestro : $sql = "SELECT id_seguimiento FROM interh_seguimiento WHERE cod_casointerh=" . $id_maestro;
        $result = $connection->execute($connect, $sql);
        if (!$result) {
            echo "An error occurred.\n";
            exit;
        }
        $data = pg_fetch_all($result);
        if ($option == 'updatePrehSeguim') {
            !$data ? $sql = "INSERT INTO preh_seguimiento (cod_casopreh, seguimento, fecha_seguimento) VALUES (" . $id_maestro . ", '" . $setField . "', '" . date("Y-m-d H:i:s") . "');" : $sql = "UPDATE preh_seguimiento SET " . $field . "='" . $setField . "' WHERE cod_casopreh=" . $id_maestro;
        } else {
            !$data ? $sql = "INSERT INTO interh_seguimiento (cod_casointerh, seguimento, fecha_seguimento) VALUES (" . $id_maestro . ", '" . $setField . "', '" . date("Y-m-d H:i:s") . "');" : $sql = "UPDATE interh_seguimiento SET " . $field . "='" . $setField . "' WHERE cod_casointerh=" . $id_maestro;
        }
        $result = $connection->execute($connect, $sql);
        if (!$result) {
            echo "An error occurred.\n";
            exit;
        }
        echo $result;
        break;
    case 'cerrarPrehCaso':
    case 'cerrarInterhCaso':
        $option == 'cerrarPrehCaso' ? $sql = "UPDATE preh_maestro SET estado=0, cierre=" . $setField . " WHERE cod_casopreh=" . $id_maestro : $sql = "UPDATE interh_maestro SET estado=0, cierre=" . $setField . " WHERE cod_casointerh=" . $id_maestro;
        $result = $connection->execute($connect, $sql);
        if (!$result) {
            echo "An error occurred.\n";
            exit;
        }
        echo $result;
        break;
    case 'updatePrehSA':
    case 'updateInterhSA':
        $option == 'updatePrehSA' ? $sql = "UPDATE preh_servicio_ambulancia SET " . $field . "='" . $setField . "' WHERE cod_casopreh=" . $id_maestro : $sql = "UPDATE servicio_ambulancia SET " . $field . "='" . $setField . "' WHERE cod_casointerh=" . $id_maestro;
        $result = $connection->execute($connect, $sql);
        if (!$result) {
            echo "An error occurred.\n";
            exit;
        }
        if ($field = "cod_ambulancia") {
            $sql = "UPDATE ambulancias SET estado=0 WHERE cod_ambulancias='" . $cod_ambulance . "'";
            $result = $connection->execute($connect, $sql);
            if (!$result) {
                echo "An error occurred.\n";
                exit;
            }
            $sql = "UPDATE ambulancias SET estado=1 WHERE cod_ambulancias='" . $setField . "'";
            $result = $connection->execute($connect, $sql);
            if (!$result) {
                echo "An error occurred.\n";
                exit;
            }
        }
        echo $result;
        break;
    case 'insertPrehSA':
    case 'insertInterhSA':
        $option == 'insertPrehSA' ? $sql = "INSERT INTO preh_servicio_ambulancia (cod_casopreh, cod_ambulancia) VALUES (" . $id_maestro . ", '" . $setField . "');" : $sql = "INSERT INTO servicio_ambulancia (cod_casointerh, cod_ambulancia) VALUES (" . $id_maestro . ", '" . $setField . "');";
        $result = $connection->execute($connect, $sql);
        if (!$result) {
            echo "An error occurred.\n";
            exit;
        }
        $sql = "UPDATE ambulancias SET estado=1 WHERE cod_ambulancias='" . $setField . "'";
        $result = $connection->execute($connect, $sql);
        if (!$result) {
            echo "An error occurred.\n";
            exit;
        }
        echo $result;
        break;
}

$conexion = null;
