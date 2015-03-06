<div onclick="exit();" id="exit">X</div>

<?php
  $file = "pages/" . $_POST['file'] . ".html";
  if (file_exists($file)) {
?>
<div class="info">
  <?php include ($file); ?>
</div>
<h3>Är något fel? Är det något du vill lägga till? Maila oss så lägger vi till din ändring!</h3>
<?php
  } else {
    echo "<h1>Detta ämne har vi inte skrivit om än!</h1>";
    echo "<h2>Vill du hjälpa till att skriva en sida? Skicka in din text till oss via mail så lägger vi till den till ämnet. </h2>";
    echo '<img src="/img/grundamnen-kontakt.png">';
  }
?>
