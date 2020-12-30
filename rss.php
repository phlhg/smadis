<?php

    header("Content-Type: text/xml");

    $content = @file_get_contents("https://www.srf.ch/news/bnf/rss/1646");

    if($content !== false){
        echo $content;
    } else {
        echo '<?xml version="1.0" encoding="UTF-8"?>'."\n";
        echo '<rss version="2.0">'."\n";
        echo '</rss>';
    }

?>