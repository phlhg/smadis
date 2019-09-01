<?php
    $modules = array_filter(array_diff(scandir($_SERVER["DOCUMENT_ROOT"]."/modules/"),array(".","..")),function($f){
        return is_dir($_SERVER["DOCUMENT_ROOT"]."/modules/".$f);
    });
?>
<!DOCTYPE html>
<html>
    <head>
        <title>SMADIS by phlhg</title>
        <meta charset="UTF-8"/>
        <!-- APP -->
        <link href="/app/css/style.css" rel="stylesheet" />
        <script src="/app/js/config.js"></script>
        <script src="/app/js/main.js"></script>
        <?php foreach($modules as $m){ ?>
        <!-- MODULE: <?=strtoupper($m)?> -->
        <link href="/modules/<?=$m?>/main.css" rel="stylesheet" />
        <script src="/modules/<?=$m?>/main.js"></script>
        <?php } ?>
        <!-- FONTS -->
        <link href="https://fonts.googleapis.com/css?family=Montserrat:300,700&display=swap" rel="stylesheet"> 
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    </head>
    <body class="nightmode">
        <div class="hub_module_container"><!--
            --><div class="hub_module" style="--left: 1; --top: 1; --width: 2; --height: 2;" data-module="Clock" data-args=""></div><!--
            --><div class="hub_module" style="--left: 3; --top: 1; --width: 1; --height: 1;" data-module="Weather" data-args=""></div><!--
            --><div class="hub_module" style="--left: 3; --top: 2; --width: 1; --height: 2;" data-module="Calendar" data-args=""></div><!--
            --><div class="hub_module" style="--left: 4; --top: 1; --width: 1; --height: 2;" data-module="PublicTransport" data-args=""></div><!--
            --><div class="hub_module" style="--left: 1; --top: 3; --width: 2; --height: 1;" data-module="News" data-args=""></div><!--
            --><div class="hub_module" style="--left: 4; --top: 3; --width: 1; --height: 1;" data-module="Spotify" data-args=""></div><!--
        --></div>
    </body>
</html>