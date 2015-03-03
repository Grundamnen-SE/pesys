<!DOCTYPE html>
<html lang="sv">
  <head>
    <meta charset="utf-8">
    <meta name="author" content="Joar Classon, Gustav Ekner och Alicia">
    <meta name="description" content="Periodiska Systemet, Enkelt och informativt (*CHANGE*)">
    <!--<link href="feedback.css" rel="stylesheet" type="text/css">-->
    <link rel="stylesheet/less" type="text/css" href="feedback.less" />
    <script src="//cdnjs.cloudflare.com/ajax/libs/less.js/1.7.4/less.min.js"></script>
    <link href='http://fonts.googleapis.com/css?family=Ubuntu' rel='stylesheet' type='text/css'>
    <style>
    @import url(http://fonts.googleapis.com/css?family=Ubuntu);
    * {
      font-family: 'Ubuntu', sans-serif;
    }
    html, body
      {
        margin: 0;
      }
      body {
        background-color: #bfbfbf;
      }
    </style>
    <title>Elementen - Hitta Själv</title>
  </head>
  <body>
    <div class="mid">
      <h1>Skriv om vad du har hittat!<br><small>Har du hittat något ämne i stora vida världen? Skriv här och dela med dig av dina upptäckter!</small></h1>
      <div class="line"></div>
      <form method="post" action="/form.php" autocomplete="off" class="form-design">
        <input type="hidden" name="action" value="post_comment">
        <input type="text" name="name" value="" placeholder="Skriv ditt namn här!">
        <textarea name="comment" value="" placeholder="Skriv din kommentar här!" rows="10"></textarea>
        <button type="submit">Skicka</button>
      </form>
    </div>
  </body>
</html>
