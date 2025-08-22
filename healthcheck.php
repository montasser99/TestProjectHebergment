<?php
// Simple healthcheck endpoint for Railway
http_response_code(200);
echo json_encode([
    'status' => 'ok',
    'timestamp' => date('Y-m-d H:i:s'),
    'app' => 'AMAZIGHI SHOP',
    'version' => '1.0.0'
]);
?>