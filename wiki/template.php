<div onclick="exit();" id="exit">X</div>

<?php
  $file = "pages/" . $_POST['file'] . ".html";
  if (file_exists($file)) {
?>
<div class="info">
  <?php include ($file); ?>
</div>
<br>
<p>Vi reserverar för eventuella faktafel.</p>
<p>Snabblänk: grundämnen.se/l/<?= $_POST['file'] ?></p>
<p>Är något fel? Är det något du vill lägga till? <a href="mailto:info.grundamnen@gmail.com">Maila oss</a> så lägger vi till din ändring!</p>

<?php
  } else {
    echo "<h1>Detta ämne har vi inte skrivit om än!</h1>";
    echo "<h2>Vill du hjälpa till att skriva en sida? Skicka in din text till oss via <a href=\"mailto:info.grundamnen@gmail.com\">mail</a> så lägger vi till den till ämnet. </h2>";
  }
?>
