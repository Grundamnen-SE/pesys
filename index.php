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
    <meta name="google-site-verification" content="ZQatb-QOSPgfvycKK0gwfbvv9de19wTu_qM5iaI9IAg">
    <meta name="google" content="notranslate">
    <meta name="twitter:card" content="summary">
    <meta name="twitter:site" content="@grundamnen">
    <meta name="twitter:title" content="Grundämnen.se">
    <meta name="twitter:description" content="Lär dig allt om Grundämnena!">
    <meta name="twitter:url" content="http://grundämnen.se/">
    <title>Grundämnen</title>
    <link rel="icon" type="image/png" href="/favicon.png">
    <link rel="stylesheet" type="text/css" href="/css/jquery-ui.min.css">
    <link rel="stylesheet" type="text/css" href="/css/jquery-ui.theme.min.css">
    <link rel="stylesheet" type="text/css" href="/css/index.css">
    <link rel="stylesheet" type="text/css" href="/css/wiki.css">
  </head>
  <body>
    <div id="help">
      <div><div></div><p>Icke-metaller</p></div>
      <div><div></div><p>Alkalimetaller</p></div>
      <div><div></div><p><pre>Alkaliska jordartsmetaller<pre></p></div>
      <div><div></div><p>Övergångsmetaller</p></div>
      <div><div></div><p>Halvmetaller</p></div>
      <div><div></div><p>Övriga metaller</p></div>
      <div><div></div><p>Halogener</p></div>
      <div><div></div><p>Ädelgaser</p></div>
      <div><div></div><p>Okända egenskaper</p></div>
      <div><div></div><p>Lantanoider</p></div>
      <div><div></div><p>Aktinoider</p></div>
    </div>
    <div id="settings" style="display: none;">
      <label for="settings-easing">Stäng av animationer: </label><input type="checkbox" id="settings-easing"></input>
      <br>
      <div class="ui-widget">
      	<div class="ui-state-highlight ui-corner-all" style="margin-top: 20px; padding: 0 .7em;">
      		<p><span class="ui-icon ui-icon-info" style="float: left; margin-right: .3em;"></span>
      		<p>Dessa inställningar kommer att sparas i form av en <a style="color: blue" href="https://sv.wikipedia.org/wiki/Webbkaka">cookie</a> på din dator.</p>
      	</div>
      </div>
    </div>
    <div id="newHTML"></div><!-- I denna div visas HTML som laddas via AJAX är man klickar på ett ämne -->
    <?php include ("includes/sim_table.php"); ?>
    <br class="clearfix">

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.3/jquery-ui.min.js"></script>
    <script src="/js/index.js"></script>
    <?php include("includes/url_handler.php"); ?>
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
