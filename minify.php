#!/usr/bin/env php
<?php

$path = __DIR__ . '/dist/';
$component = file_get_contents(__DIR__ . '/src/settings-card.js');

foreach (scandir($path) as $file) {
    $fileinfo = pathinfo($path . $file);
    if ($fileinfo['extension'] === 'css') {
        $component = preg_replace(
            '/<link rel="stylesheet" href="\${style_path}' . $fileinfo['basename'] . '">/',
            '<style>' . file_get_contents($path . $file) . '</style>',
            $component
        );
    }
}

file_put_contents($path . 'settings-card.js', $component);

exec('minify ' . $path . 'settings-card.js > ' . $path . 'settings-card.min.js');
unlink($path . 'settings-card.js');
