<?php
include_once 'connection.php';

$connection = new connection();
$connect = $connection->connect();

$option = (isset($_POST['option'])) ? $_POST['option'] : '';
$field = (isset($_POST['field'])) ? $_POST['field'] : '';
$setField = (isset($_POST['setField'])) ? $_POST['setField'] : '';
$id_patient = (isset($_POST['idP'])) ? $_POST['idP'] : '';
$ingress = (isset($_POST['ingress'])) ? $_POST['ingress'] : '';
$acompañante = (isset($_POST['acompañante'])) ? $_POST['acompañante'] : '';
$phone_acompañante = (isset($_POST['phone_acompañante'])) ? $_POST['phone_acompañante'] : '';

switch ($option) {
    case 'selectPatient':
        $sql = "SELECT * FROM pacientegeneral
        LEFT JOIN tipo_id ON pacientegeneral.tipo_doc = tipo_id.id_tipo
        LEFT JOIN tipo_edad ON pacientegeneral.cod_edad = tipo_edad.id_edad";
        if ($id_patient) $sql .= " WHERE id_paciente=" . $id_patient;
        $result = $connection->execute($connect, $sql);
        if (!$result) {
            echo "An error occurred.\n";
            exit;
        }
        $data = pg_fetch_all($result);
        print json_encode($data, JSON_UNESCAPED_UNICODE);
        break;
    case 'selectIngress':
        $sql = "SELECT * FROM tipo_ingreso";
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
    case 'selectTypeAge':
        $sql = "SELECT * FROM tipo_edad ORDER BY id_edad ASC";
        $result = $connection->execute($connect, $sql);
        if (!$result) {
            echo "An error occurred.\n";
            exit;
        }
        $data = pg_fetch_all($result);
        print json_encode($data, JSON_UNESCAPED_UNICODE);
        break;
    case 'selectAdmission':
        $sql = "SELECT * FROM admision
            INNER JOIN pacientegeneral ON admision.id_paciente=pacientegeneral.id_paciente
            INNER JOIN tipo_ingreso ON admision.id_ingreso=tipo_ingreso.id_ingreso
            ORDER BY id_admision ASC";
        $result = $connection->execute($connect, $sql);
        if (!$result) {
            echo "An error occurred.\n";
            exit;
        }
        $data = pg_fetch_all($result);
        print json_encode($data, JSON_UNESCAPED_UNICODE);
        break;
        break;
    case 'insertAdmission':
        $sql = "INSERT INTO admision (id_ingreso, acompañante, telefono_acompañante, fecha_admision) VALUES (" . $ingress . ", '" . $acompañante . "', '" . $phone_acompañante . "', '" . date('d-m-Y H:i:s') . "');";
        $result = $connection->execute($connect, $sql);
        if (!$result) {
            echo "An error occurred.\n";
            exit;
        }
        echo $result;
        break;
    case 'updateP':
        $sql = "UPDATE pacientegeneral SET " . $field . "='" . $setField . "' WHERE id_paciente=" . $id_patient;
        $result = $connection->execute($connect, $sql);
        if (!$result) {
            echo "An error occurred.\n";
            exit;
        }
        echo $result;
        break;
}

$connection = null;
