<?php

header('Content-Type: application/json');

$post_body = file_get_contents('php://input');
$return_message = [
    'messages' => [
        'Some server site processing'
    ],
    'success' => false
];

try {
    $post_data = json_decode($post_body, true);
    $return_message['success'] = true;
    $return_message['data'] = $post_body;
} catch (Exception $e) {
    $return_message['messages'][] = $e->getMessage();
}

echo json_encode($return_message);
