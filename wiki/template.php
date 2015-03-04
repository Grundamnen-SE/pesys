<div onclick="exit();" id="exit">X</div>

<?php
  $file = "pages/" . $_POST['file'];
  if (file_exists($file)) {
?>

  <?php include ($file); ?>

<?php
  } else {
    echo "<h1>Detta ämne har vi inte skrivit om än!</h1>";
    echo $_POST['file'];
  }
?>
