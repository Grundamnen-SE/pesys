<div onclick="exit();" id="exit">X</div>

<?php
  $sysFile = "";
  $viewFile = false;
  if (isset($_POST['file']) && $_POST['file'] !== "") {
    if (strpos($_POST['file'], '..') === FALSE) {
      // Decide file name:
      $file = "pages/" . $_POST['file'] . ".html";
      if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
        $sysFile = iconv('utf-8', 'cp1252', $file); // Om vi kör på windows måste vi ha utf-8-support för å, ä och ö.
      } else {
        $sysFile = $file; // På linux behövs ingen konvertering
      }

      if (file_exists($sysFile))
        $viewFile = true;
    }
  }
  
  if ($viewFile) {
?>
    <div class="info">
      <?php include ($sysFile); ?>
    </div>
    <div class="extra-info">
      <p>Snabblänk: <a href="http://<?= $_SERVER['SERVER_NAME'] ?>/l/<?= $_POST['file'] ?>">grundämnen.se/l/<?= $_POST['file'] ?></a></p>
      <p>Vi reserverar oss för eventuella faktafel.</p>
      <p>Är något fel? Är det något du vill lägga till?
      <a href="mailto:info.grundamnen@gmail.com">Maila oss</a> så lägger vi till din ändring!</p>
    </div>

    <script src="wiki/template.js"></script>
<?php
  } else {
    echo '<div class="not-exist"><h1>Detta ämne har vi inte skrivit om än!</h1>';
    echo '<h2>Vill du hjälpa till att skriva en sida? Skicka in din text till oss via <a href=\"mailto:info.grundamnen@gmail.com\">mail</a> så lägger vi till den till ämnet. </h2></div>';
  }
?>
