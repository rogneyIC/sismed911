<?php
include_once 'connection.php';

$connection = new connection();
$connect = $connection->connect();

$option = (isset($_POST['option'])) ? $_POST['option'] : '';
$reason = (isset($_POST['reason'])) ? $_POST['reason'] : '';
$field = (isset($_POST['field'])) ? $_POST['field'] : '';
$setField = (isset($_POST['setField'])) ? $_POST['setField'] : '';
$id_patient = (isset($_POST['idP'])) ? $_POST['idP'] : '';
$patient = (isset($_POST['patient'])) ? $_POST['patient'] : '';
$id_ingress = (isset($_POST['ingress'])) ? $_POST['ingress'] : '';
$companion = (isset($_POST['acompañante'])) ? $_POST['acompañante'] : null;
$phone_companion = (isset($_POST['phone_acompañante'])) ? $_POST['phone_acompañante'] : null;
$cod911 = (isset($_POST['cod911'])) ? $_POST['cod911'] : null;
$dataAdmission = (isset($_POST['data'])) ? $_POST['data'] : null;
$id_medicalAttention = (isset($_POST['idMA'])) ? $_POST['idMA'] : null;
$dataExamen = (isset($_POST['dataExamen'])) ? $_POST['dataExamen'] : null;
$id_medicalAttentionExamen = (isset($_POST['idMAE'])) ? $_POST['idMAE'] : null;
$id_medicalAttentionMedical = (isset($_POST['idMAM'])) ? $_POST['idMAM'] : null;
$dosis = (isset($_POST['dosis'])) ? $_POST['dosis'] : null;

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
        $sql = "SELECT * FROM sala_admision
            INNER JOIN pacientegeneral ON sala_admision.id_paciente=pacientegeneral.id_paciente
            INNER JOIN tipo_ingreso ON sala_admision.id_ingreso=tipo_ingreso.id_ingreso
            LEFT JOIN sala_signos ON sala_admision.id_signos=sala_signos.id_signos
            ORDER BY id_admision ASC";
        $result = $connection->execute($connect, $sql);
        if (!$result) {
            echo "An error occurred.\n";
            exit;
        }
        $data = pg_fetch_all($result);
        print json_encode($data, JSON_UNESCAPED_UNICODE);
        break;
    case 'selectSignal':
        $sql = "SELECT * FROM sala_signos WHERE tipo_urgencias='" . $reason . "'";
        $result = $connection->execute($connect, $sql);
        if (!$result) {
            echo "An error occurred.\n";
            exit;
        }
        $data = pg_fetch_all($result);
        print json_encode($data, JSON_UNESCAPED_UNICODE);
        break;
    case 'selectUrgency':
    case 'selectEmergency':
        $sql = "SELECT * FROM sala_admision
            INNER JOIN pacientegeneral ON sala_admision.id_paciente=pacientegeneral.id_paciente
            INNER JOIN sala_motivoatencion ON sala_admision.id_motivoatencion=sala_motivoatencion.id_motivoatencion
            LEFT JOIN sala_atencionmedica ON sala_admision.id_admision=sala_atencionmedica.id_admision
            LEFT JOIN cuerpo_general ON sala_atencionmedica.id_general=cuerpo_general.id_general
            LEFT JOIN cuerpo_cabeza ON sala_atencionmedica.id_cabeza=cuerpo_cabeza.id_cabeza
            LEFT JOIN cuerpo_ojo ON sala_atencionmedica.id_ojo=cuerpo_ojo.id_ojo
            LEFT JOIN cuerpo_otorrino ON sala_atencionmedica.id_otorrino=cuerpo_otorrino.id_otorrino
            LEFT JOIN cuerpo_boca ON sala_atencionmedica.id_boca=cuerpo_boca.id_boca
            LEFT JOIN cuerpo_cuello ON sala_atencionmedica.id_cuello=cuerpo_cuello.id_cuello
            LEFT JOIN cuerpo_torax ON sala_atencionmedica.id_torax=cuerpo_torax.id_torax
            LEFT JOIN cuerpo_corazon ON sala_atencionmedica.id_corazon=cuerpo_corazon.id_corazon
            LEFT JOIN cuerpo_pulmon ON sala_atencionmedica.id_pulmon=cuerpo_pulmon.id_pulmon
            LEFT JOIN cuerpo_abdomen ON sala_atencionmedica.id_abdomen=cuerpo_abdomen.id_abdomen
            LEFT JOIN cuerpo_pelvis ON sala_atencionmedica.id_pelvis=cuerpo_pelvis.id_pelvis
            LEFT JOIN cuerpo_rectal ON sala_atencionmedica.id_rectal=cuerpo_rectal.id_rectal
            LEFT JOIN cuerpo_genital ON sala_atencionmedica.id_genital=cuerpo_genital.id_genital
            LEFT JOIN cuerpo_extremidad ON sala_atencionmedica.id_extremidad=cuerpo_extremidad.id_extremidad
            LEFT JOIN cuerpo_neuro ON sala_atencionmedica.id_neuro=cuerpo_neuro.id_neuro
            LEFT JOIN cuerpo_piel ON sala_atencionmedica.id_piel=cuerpo_piel.id_piel
            LEFT JOIN cie10 ON sala_atencionmedica.cod_cie10=cie10.codigo_cie
            LEFT JOIN tipo_edad ON pacientegeneral.cod_edad=tipo_edad.id_edad";
        $sql .= $option == 'selectUrgency'
            ? " WHERE sala_atencionmedica.id_estadoalta IS NULL AND (sala_admision.clasificacion_admision='Verde' OR sala_admision.clasificacion_admision='Azul')"
            : " WHERE sala_atencionmedica.id_estadoalta IS NULL AND (sala_admision.clasificacion_admision='Rojo' OR sala_admision.clasificacion_admision='Naranja' OR sala_admision.clasificacion_admision='Amarillo')";
        $sql .= " ORDER BY sala_admision.id_admision";
        $result = $connection->execute($connect, $sql);
        if (!$result) {
            echo "An error occurred.\n";
            exit;
        }
        $data = pg_fetch_all($result);
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
    case 'selectMedical':
        $sql = "SELECT * FROM sala_medicamentos ORDER BY producto ASC";
        $result = $connection->execute($connect, $sql);
        if (!$result) {
            echo "An error occurred.\n";
            exit;
        }
        $data = pg_fetch_all($result);
        $medical = $data;

        if ($id_medicalAttention) {
            $medical = [];
            $sql = "SELECT sala_medicamentos.id, sala_medicamentos.producto, sala_medicamentos.costo
                FROM sala_atencionmedica_medicamentos
                INNER JOIN sala_medicamentos ON sala_atencionmedica_medicamentos.id_medicamentos=sala_medicamentos.id
                WHERE sala_atencionmedica_medicamentos.id_atencionmedica=" . $id_medicalAttention;
            $result = $connection->execute($connect, $sql);
            if (!$result) {
                echo "An error occurred.\n";
                exit;
            }
            $id = pg_fetch_all($result);

            foreach ($data as $valor) {
                if ($id) {
                    if (!in_array($valor, $id)) array_push($medical, $valor);
                } else {
                    array_push($medical, $valor);
                }
            }
        }

        print json_encode($medical, JSON_UNESCAPED_UNICODE);
        break;
    case 'selectExamen':
        $sql = "SELECT * FROM sala_examen ORDER BY nombre_examen";
        $result = $connection->execute($connect, $sql);
        if (!$result) {
            echo "An error occurred.\n";
            exit;
        }
        $data = pg_fetch_all($result);
        $examen = $data;

        if ($id_medicalAttention) {
            $examen = [];
            $sql = "SELECT sala_examen.id_examen, sala_examen.nombre_examen FROM sala_atencionmedica_examen
                    INNER JOIN sala_examen ON sala_atencionmedica_examen.id_examen=sala_examen.id_examen
                    WHERE sala_atencionmedica_examen.id_atencionmedica=" . $id_medicalAttention;
            $result = $connection->execute($connect, $sql);
            if (!$result) {
                echo "An error occurred.\n";
                exit;
            }
            $id = pg_fetch_all($result);

            foreach ($data as $valor) {
                if ($id) {
                    if (!in_array($valor, $id)) array_push($examen, $valor);
                } else {
                    array_push($examen, $valor);
                }
            }
        }

        print json_encode($examen, JSON_UNESCAPED_UNICODE);
        break;
    case 'selectAttentionExamen':
        $sql = "SELECT sala_atencionmedica_examen.id_atencionmedica_examen, sala_examen.id_examen, sala_examen.nombre_examen FROM sala_atencionmedica
                INNER JOIN sala_atencionmedica_examen ON sala_atencionmedica.id_atencionmedica=sala_atencionmedica_examen.id_atencionmedica
                INNER JOIN sala_examen ON sala_atencionmedica_examen.id_examen=sala_examen.id_examen
                WHERE sala_atencionmedica.id_atencionmedica=" . $id_medicalAttention . " ORDER BY sala_examen.nombre_examen";
        $result = $connection->execute($connect, $sql);
        if (!$result) {
            echo "An error occurred.\n";
            exit;
        }
        $data = pg_fetch_all($result);
        print json_encode($data, JSON_UNESCAPED_UNICODE);
        break;
    case 'selectAttentionMedical':
        $sql = "SELECT sala_atencionmedica_medicamentos.id_atencionmedica_medicamentos, sala_medicamentos.id AS id_medicamentos, sala_medicamentos.producto, sala_atencionmedica_medicamentos.dosis FROM sala_atencionmedica
                INNER JOIN sala_atencionmedica_medicamentos ON sala_atencionmedica.id_atencionmedica=sala_atencionmedica_medicamentos.id_atencionmedica
                INNER JOIN sala_medicamentos ON sala_atencionmedica_medicamentos.id_medicamentos=sala_medicamentos.id
                WHERE sala_atencionmedica.id_atencionmedica=" . $id_medicalAttention;
        $result = $connection->execute($connect, $sql);
        if (!$result) {
            echo "An error occurred.\n";
            exit;
        }
        $data = pg_fetch_all($result);
        print json_encode($data, JSON_UNESCAPED_UNICODE);
        break;
    case 'loadSelectAdmission':
        $sql = "SELECT * FROM sala_motivoatencion";
        $result = $connection->execute($connect, $sql);
        if (!$result) {
            echo "An error occurred.\n";
            exit;
        }
        $data['attention'] = pg_fetch_all($result);

        $sql = "SELECT * FROM sala_localizaciontrauma";
        $result = $connection->execute($connect, $sql);
        if (!$result) {
            echo "An error occurred.\n";
            exit;
        }
        $data['locationTrauma'] = pg_fetch_all($result);

        $sql = "SELECT * FROM sala_causatrauma";
        $result = $connection->execute($connect, $sql);
        if (!$result) {
            echo "An error occurred.\n";
            exit;
        }
        $data['causeTrauma'] = pg_fetch_all($result);

        $sql = "SELECT * FROM sala_sistema";
        $result = $connection->execute($connect, $sql);
        if (!$result) {
            echo "An error occurred.\n";
            exit;
        }
        $data['system'] = pg_fetch_all($result);
        print json_encode($data, JSON_UNESCAPED_UNICODE);
        break;
    case 'loadSelectMedicalAttention':
        $sql = "SELECT * FROM cuerpo_general";
        $result = $connection->execute($connect, $sql);
        if (!$result) {
            echo "An error occurred.\n";
            exit;
        }
        $data['general'] = pg_fetch_all($result);

        $sql = "SELECT * FROM cuerpo_cabeza";
        $result = $connection->execute($connect, $sql);
        if (!$result) {
            echo "An error occurred.\n";
            exit;
        }
        $data['cabeza'] = pg_fetch_all($result);

        $sql = "SELECT * FROM cuerpo_ojo";
        $result = $connection->execute($connect, $sql);
        if (!$result) {
            echo "An error occurred.\n";
            exit;
        }
        $data['ojo'] = pg_fetch_all($result);

        $sql = "SELECT * FROM cuerpo_otorrino";
        $result = $connection->execute($connect, $sql);
        if (!$result) {
            echo "An error occurred.\n";
            exit;
        }
        $data['otorrino'] = pg_fetch_all($result);

        $sql = "SELECT * FROM cuerpo_boca";
        $result = $connection->execute($connect, $sql);
        if (!$result) {
            echo "An error occurred.\n";
            exit;
        }
        $data['boca'] = pg_fetch_all($result);

        $sql = "SELECT * FROM cuerpo_cuello";
        $result = $connection->execute($connect, $sql);
        if (!$result) {
            echo "An error occurred.\n";
            exit;
        }
        $data['cuello'] = pg_fetch_all($result);

        $sql = "SELECT * FROM cuerpo_torax";
        $result = $connection->execute($connect, $sql);
        if (!$result) {
            echo "An error occurred.\n";
            exit;
        }
        $data['torax'] = pg_fetch_all($result);

        $sql = "SELECT * FROM cuerpo_corazon";
        $result = $connection->execute($connect, $sql);
        if (!$result) {
            echo "An error occurred.\n";
            exit;
        }
        $data['corazon'] = pg_fetch_all($result);

        $sql = "SELECT * FROM cuerpo_pulmon";
        $result = $connection->execute($connect, $sql);
        if (!$result) {
            echo "An error occurred.\n";
            exit;
        }
        $data['pulmon'] = pg_fetch_all($result);

        $sql = "SELECT * FROM cuerpo_abdomen";
        $result = $connection->execute($connect, $sql);
        if (!$result) {
            echo "An error occurred.\n";
            exit;
        }
        $data['abdomen'] = pg_fetch_all($result);

        $sql = "SELECT * FROM cuerpo_pelvis";
        $result = $connection->execute($connect, $sql);
        if (!$result) {
            echo "An error occurred.\n";
            exit;
        }
        $data['pelvis'] = pg_fetch_all($result);

        $sql = "SELECT * FROM cuerpo_rectal";
        $result = $connection->execute($connect, $sql);
        if (!$result) {
            echo "An error occurred.\n";
            exit;
        }
        $data['rectal'] = pg_fetch_all($result);

        $sql = "SELECT * FROM cuerpo_genital";
        $result = $connection->execute($connect, $sql);
        if (!$result) {
            echo "An error occurred.\n";
            exit;
        }
        $data['genital'] = pg_fetch_all($result);

        $sql = "SELECT * FROM cuerpo_extremidad";
        $result = $connection->execute($connect, $sql);
        if (!$result) {
            echo "An error occurred.\n";
            exit;
        }
        $data['extremidad'] = pg_fetch_all($result);

        $sql = "SELECT * FROM cuerpo_neuro";
        $result = $connection->execute($connect, $sql);
        if (!$result) {
            echo "An error occurred.\n";
            exit;
        }
        $data['neuro'] = pg_fetch_all($result);

        $sql = "SELECT * FROM cuerpo_piel";
        $result = $connection->execute($connect, $sql);
        if (!$result) {
            echo "An error occurred.\n";
            exit;
        }
        $data['piel'] = pg_fetch_all($result);

        $sql = "SELECT * FROM sala_estadoalta";
        $result = $connection->execute($connect, $sql);
        if (!$result) {
            echo "An error occurred.\n";
            exit;
        }
        $data['disposal'] = pg_fetch_all($result);

        print json_encode($data, JSON_UNESCAPED_UNICODE);
        break;
    case 'insertAdmission':
        $sql = "INSERT INTO sala_admision (id_ingreso, id_paciente, acompañante, telefono_acompañante, fecha_admision, cod911)
                VALUES (" . $id_ingress . ", " . $id_patient . ", " . $companion . ", " . $phone_companion . ", '" . date('d-m-Y H:i:s') . "'," . $cod911 . ")";
        $result = $connection->execute($connect, $sql);
        if (!$result) {
            echo "An error occurred.\n";
            exit;
        }
        echo $result;
        break;
    case 'insertPatient':
        $sql = "INSERT INTO pacientegeneral (cod_casointerh, expendiente, num_doc, tipo_doc, nombre1, nombre2, apellido1, apellido2, genero, edad, fecha_nacido, cod_edad, telefono, direccion, aseguradro, observacion)
            VALUES (0, '" . $patient['expendiente'] . "', '" . $patient['num_doc'] . "', '" . $patient['tipo_doc'] . "', '" . $patient['nombre1'] . "', '" . $patient['nombre2'] . "', '" . $patient['apellido1'] . "', '" . $patient['apellido2'] . "', '" . $patient['genero'] . "', '" . $patient['edad'] . "', '" . $patient['fecha_nacido'] . "', '" . $patient['cod_edad'] . "', '" . $patient['telefono'] . "', '" . $patient['direccion'] . "', '" . $patient['aseguradro'] . "', '" . $patient['observacion'] . "')
            RETURNING id_paciente";
        $result = $connection->execute($connect, $sql);
        if (!$result) {
            echo "An error occurred.\n";
            exit;
        }
        $data = pg_fetch_all($result);
        print json_encode($data, JSON_UNESCAPED_UNICODE);
        break;
    case 'insertExamen':
        $data = [];
        foreach ($dataExamen as &$valor) {
            $sql = "INSERT INTO sala_atencionmedica_examen (id_atencionmedica, id_examen)
                    VALUES (" . $id_medicalAttention . "," . $valor . ")
                    RETURNING id_atencionmedica_examen";
            $result = $connection->execute($connect, $sql);
            if (!$result) {
                echo "An error occurred.\n";
                exit;
            }
            array_push($data, pg_fetch_all($result)[0]);
        }
        print json_encode($data, JSON_UNESCAPED_UNICODE);
        break;
    case 'insertMedical':
        $sql = "INSERT INTO sala_atencionmedica_medicamentos (id_atencionmedica, id_medicamentos, dosis)
                VALUES (" . $id_medicalAttention . "," . $id_medicalAttentionMedical . "," . $dosis . ")
                RETURNING id_atencionmedica_medicamentos";
        $result = $connection->execute($connect, $sql);
        if (!$result) {
            echo "An error occurred.\n";
            exit;
        }
        $data = pg_fetch_all($result);
        print json_encode($data, JSON_UNESCAPED_UNICODE);
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
    case 'updateAdmission':
        $sql = "UPDATE sala_admision SET id_motivoatencion=" . $dataAdmission['id_attention']
            . ",id_localizaciontrauma=" . $dataAdmission['id_locationTrauma']
            . ",id_causatrauma=" . $dataAdmission['id_causeTrauma']
            . ",id_sistema=" . $dataAdmission['id_system']
            . ",glasgow_admision=" . $dataAdmission['glasgow']
            . ",pas_admision=" . $dataAdmission['pas']
            . ",pad_admision=" . $dataAdmission['pad']
            . ",fc_admision=" . $dataAdmission['fc']
            . ",so2_admision=" . $dataAdmission['so2']
            . ",fr_admision=" . $dataAdmission['fr']
            . ",temp_admision=" . $dataAdmission['temp']
            . ",clasificacion_admision=" . $dataAdmission['classification']
            . ",dolor=" . $dataAdmission['dolor']
            . ",id_signos=" . $dataAdmission['id_signal']
            . ",motivo_consulta=" . $dataAdmission['motivation']
            . ",signos_sintomas=" . $dataAdmission['signalDescription']
            . ",fecha_clasificacion='" . date('d-m-Y H:i:s') . "'"
            . " WHERE id_admision=" . $dataAdmission['id_admission'];
        $result = $connection->execute($connect, $sql);
        if (!$result) {
            echo "An error occurred.\n";
            exit;
        }
        if (!$dataAdmission['old_classification']) {
            $sql = "INSERT INTO sala_atencionmedica (id_admision) VALUES (" . $dataAdmission['id_admission'] . ")";
            $result = $connection->execute($connect, $sql);
            if (!$result) {
                echo "An error occurred.\n";
                exit;
            }
        }
        echo $result;
        break;
    case 'updateMedicalAttention':
        $sql = "UPDATE sala_atencionmedica SET " . $field . "='" . $setField . "' WHERE id_atencionmedica=" . $id_medicalAttention;
        $result = $connection->execute($connect, $sql);
        if (!$result) {
            echo "An error occurred.\n";
            exit;
        }
        echo $result;
        break;
    case 'deleteAttentionExamen':
        $sql = "DELETE FROM sala_atencionmedica_examen WHERE id_atencionmedica_examen=" . $id_medicalAttentionExamen;
        $result = $connection->execute($connect, $sql);
        if (!$result) {
            echo "An error occurred.\n";
            exit;
        }
        echo $result;
        break;
    case 'deleteAttentionMedical':
        $sql = "DELETE FROM sala_atencionmedica_medicamentos WHERE id_atencionmedica_medicamentos=" . $id_medicalAttentionMedical;
        $result = $connection->execute($connect, $sql);
        if (!$result) {
            echo "An error occurred.\n";
            exit;
        }
        echo $result;
        break;
}

$connection = null;
