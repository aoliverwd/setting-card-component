#!/usr/bin/env php
<?php

$path = __DIR__ . '/dist/';
$src = __DIR__ . '/src/';

$components = [
    __DIR__ . '/src/settings-card.js',
    __DIR__ . '/src/form-input.js',
    __DIR__ . '/src/add-rows.js'
];

$components = array_map(function ($file) use ($path) {
    if (file_exists($file)) {
        $file_info = pathinfo($file);
        $component = file_get_contents($file);

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

        file_put_contents($path . $file_info['basename'], $component);
    }

    return false;
}, $components);

exec('minify ' . $path . 'settings-card.js > ' . $path . 'settings-card.min.js');
exec('minify ' . $path . 'form-input.js > ' . $path . 'form-input.min.js');
exec('minify ' . $path . 'add-rows.js > ' . $path . 'add-rows.min.js');

unlink($path . 'settings-card.js');
unlink($path . 'form-input.js');
unlink($path . 'add-rows.js');
