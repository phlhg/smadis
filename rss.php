<?php

    header("Content-Type: text/xml");

    echo file_get_contents("https://www.srf.ch/news/bnf/rss/1646");

?>