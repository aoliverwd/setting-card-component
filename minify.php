#!/usr/bin/env php
<?php

$path = __DIR__ . '/dist/';
$src = __DIR__ . '/src/';

// $components = [
//     file_get_contents(__DIR__ . '/src/settings-card.js'),
//     file_get_contents(__DIR__ . '/src/form-input.js'),
//     file_get_contents(__DIR__ . '/src/add-rows.js')
// ];

// foreach (scandir($path) as $file) {
//     $fileinfo = pathinfo($path . $file);
//     if ($fileinfo['extension'] === 'css') {
//         $component = preg_replace(
//             '/<link rel="stylesheet" href="\${style_path}' . $fileinfo['basename'] . '">/',
//             '<style>' . file_get_contents($path . $file) . '</style>',
//             $component
//         );
//     }
// }

// file_put_contents($path . 'settings-card.js', $component);

exec('minify ' . $src . 'settings-card.js > ' . $path . 'settings-card.js');
exec('minify ' . $src . 'form-input.js > ' . $path . 'form-input.js');
exec('minify ' . $src . 'add-rows.js > ' . $path . 'add-rows.js');

// unlink($path . 'settings-card.js');
// unlink($path . 'form-input.js');
// unlink($path . 'add-rows.js');
