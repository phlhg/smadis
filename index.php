<?php
    $dir = "/phub/";
    $modules = array_filter(array_diff(scandir($_SERVER["DOCUMENT_ROOT"].$dir."modules/"),array(".","..")),function($f){
        global $dir;
        return is_dir($_SERVER["DOCUMENT_ROOT"].$dir."modules/".$f);
    });
?>
<!DOCTYPE html>
<html>
    <head>
        <title>SMADIS by phlhg</title>
        <meta charset="UTF-8"/>
        <!-- APP -->
        <link href="<?=$dir?>app/css/style.css" rel="stylesheet" />
        <script src="<?=$dir?>app/js/config.js"></script>
        <script src="<?=$dir?>app/js/main.js"></script>
        <script> DIR = "<?=$dir?>"; </script>
        <?php foreach($modules as $m){ ?>
        <!-- MODULE: <?=strtoupper($m)?> -->
        <link href="<?=$dir?>/modules/<?=$m?>/main.css" rel="stylesheet" />
        <script src="<?=$dir?>/modules/<?=$m?>/main.js"></script>
        <?php } ?>
        <!-- FONTS -->
        <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700&display=swap" rel="stylesheet"> 
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    </head>
    <body class="nightmode">
        <div class="hub_module_container"><!--
            --><div class="hub_module" style="--left: 1; --top: 1; --width: 2; --height: 2;" data-module="Clock" data-args=""></div><!--
            --><div class="hub_module" style="--left: 3; --top: 1; --width: 1; --height: 1;" data-module="Weather" data-args=""></div><!--
            --><div class="hub_module" style="--left: 4; --top: 1; --width: 1; --height: 2;" data-module="PublicTransport" data-args=""></div><!--
            --><div class="hub_module" style="--left: 1; --top: 3; --width: 4; --height: 1;" data-module="News" data-args=""></div><!--
            --><div class="hub_module" style="--left: 3; --top: 2; --width: 1; --height: 1;" data-module="Spotify" data-args=""></div><!--
        --></div>
    </body>
</html>