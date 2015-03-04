<div onclick="exit();" id="exit">X</div>

<?php
  $file = "pages/" . $_POST['file'] . ".html";
  if (file_exists($file)) {
?>
<div class="info">
  <?php include ($file); ?>
</div>
<?php
  } else {
    echo "<h1>Detta ämne har vi inte skrivit om än!</h1>";
  }
?>
