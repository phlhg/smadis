<?php

    header("Content-Type: text/xml");

    $content = @file_get_contents("https://www.srf.ch/news/bnf/rss/1646");

    if($content !== false){
        @file_put_contents("./rss.xml",$content);
        echo $content;
    } else {
        echo @file_get_contents("./rss.xml");
    }

?>