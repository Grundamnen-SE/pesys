<div onclick="exit();" id="exit">X</div>

<?php
  $file = "pages/" . $_POST['file'] . ".html";
  if (file_exists($file)) {
?>
<div class="info">
  <?php include ($file); ?>
</div>
<div class="extra-info">
  <p>Snabblänk: <a href="http://<?= $_SERVER['SERVER_NAME'] ?>/l/<?= $_POST['file'] ?>">grundämnen.se/l/<?= $_POST['file'] ?></a></p>
  <p>Vi reserverar oss för eventuella faktafel.</p>
  <p>Är något fel? Är det något du vill lägga till?
  <a href="mailto:info.grundamnen@gmail.com">Maila oss</a> så lägger vi till din ändring!</p>
</div>

<?php
  } else {
    echo '<div class="not-exist"><h1>Detta ämne har vi inte skrivit om än!</h1>';
    echo '<h2>Vill du hjälpa till att skriva en sida? Skicka in din text till oss via <a href=\"mailto:info.grundamnen@gmail.com\">mail</a> så lägger vi till den till ämnet. </h2></div>';
  }
?>
