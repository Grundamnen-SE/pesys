<?php
if ($_SERVER['SERVER_NAME'] == "pesys.joarc.se") header('Location: http://grundämnen.se/');
?>
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="author" content="Joar Classon, Gustav Ekner och Alicia Palmér">
    <meta name="description" content="Här kan du se och läsa om alla grundämnen på ett nytt och spännande sätt.">
    <meta name="keywords" content="grundämnen, atom, atomer, grundämne, webbstjärnan, .se, iis, grundämnen.se, grundamnen.ejn.nu, kunskap, veta, lära, verktyg, information, data, wiki, fakta, hjälpmedel, proton, elektron, neutron, elektronskal, atomkärna, joarc, gustavwiz, github">
    <meta name="google-site-verification" content="ZQatb-QOSPgfvycKK0gwfbvv9de19wTu_qM5iaI9IAg" />
    <meta name="google" content="notranslate" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:site" content="@grundamnen" />
    <meta name="twitter:title" content="Grundämnen.se" />
    <meta name="twitter:description" content="Lär dig allt om Grundämnena!" />
    <meta name="twitter:url" content="http://grundämnen.se/" />
    <title>Grundämnen</title>
    <link rel="icon" type="image/png" href="/favicon.png">
    <link rel="stylesheet/less" type="text/css" href="/css/global.less" />
    <link rel="stylesheet/less" type="text/css" href="/css/index.less" />
    <link rel="stylesheet/less" type="text/css" href="/css/wiki.less" />
    <script src="//cdnjs.cloudflare.com/ajax/libs/less.js/1.7.4/less.min.js"></script>
  </head>
  <body>
    <div id="newHTML"></div> <!-- I denna div visas HTML som laddas via AJAX är man klickar på ett ämne -->
    <?php include ("includes/sim_table.php"); ?>
    <br class="clearfix">
    <a class="webbstj" href="http://webbstjarnan.se" target="_blank"><img title="Webbstjärnan"
      src="http://www.webbstjarnan.se/wordpress/wp-content/uploads/se_webbstjarnan_ny_vit.png"
      alt="" width="250" /></a>
    <a class="license" rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">
          <img alt="Creative Commons-licens" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" />
        </a><br />
    <script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.3/jquery-ui.min.js"></script>
    <script src="/js/index.js"></script>
    <script>
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

      ga('create', 'UA-59839592-1', 'auto');
      ga('send', 'pageview');

    </script>
  </body>
</html>
