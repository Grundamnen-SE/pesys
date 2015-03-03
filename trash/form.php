<?php
if ($_POST == null) header('Location: /');

date_default_timezone_set("Europe/Stockholm");
$date_num = date('YmdGi');
$date_hum = date('Y-m-d G:i');

if ($_SERVER['REQUEST_METHOD'] == "POST") {
  if ($_POST['action'] == "post_comment") {
    if (strlen($_POST['name']) >= 5) {
      $data = array("name" => $_POST['name'], "date_hum" => $date_hum, "date_num" => $date_num, "comment" => $_POST['comment']);
      $data = json_encode($data);
      file_put_contents("comments/".$date_num, $data);
      $error = false;
      $error_msg = "";
      header('Location: /thankyou.php');
    } else {
      $error = true;
      $error_msg = "Ditt namn var för kort!";
    }
  }
}

if ($error) {?>
<meta charset="utf-8">
<div style="margin-top:10%; border:1px solid black; width:70%; margin-left:auto; margin-right:auto;">
  <h1 style="text-align:center;">Fel: <?= $error_msg ?></h1>
</div>
<?php } ?>
