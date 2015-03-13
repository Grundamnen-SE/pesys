<?php
  $dir = "wiki/pages/";
  $link = $_GET['simple_link'];
  $link_r = explode("/", $link);
  if ($link_r[0] != "") {
  if (file_exists($dir.$link_r[0].".html")) {
  ?>
<script>
  if ()
  if ($(".atomic_text").parent("td").hasClass("ick")) { $("#newHTML").css({"background-color":"#7D89E8"}); }
  else if ($(".atomic_text").parent("td").hasClass("alk")) { $("#newHTML").css({"background-color":"#E87D7D"}); }
  else if ($(".atomic_text").parent("td").hasClass("jor")) { $("#newHTML").css({"background-color":"#E8B87D"}); }
  else if ($(".atomic_text").parent("td").hasClass("ove")) { $("#newHTML").css({"background-color":"#7DE894"}); }
  else if ($(".atomic_text").parent("td").hasClass("eju")) { $("#newHTML").css({"background-color":"#E87DAD"}); }
  else if ($(".atomic_text").parent("td").hasClass("ovr")) { $("#newHTML").css({"background-color":"#7DE8CF"}); }
  else if ($(".atomic_text").parent("td").hasClass("hme")) { $("#newHTML").css({"background-color":"#7DC6E8"}); }
  else if ($(".atomic_text").parent("td").hasClass("ick")) { $("#newHTML").css({"background-color":"#7D89E8"}); }
  else if ($(".atomic_text").parent("td").hasClass("hao")) { $("#newHTML").css({"background-color":"#AB7DE8"}); }
  else if ($(".atomic_text").parent("td").hasClass("gas")) { $("#newHTML").css({"background-color":"#E67DE8"}); }
  else if ($(".atomic_text").parent("td").hasClass("lan")) { $("#newHTML").css({"background-color":"#DDE87D"}); }
  else if ($(".atomic_text").parent("td").hasClass("akt")) { $("#newHTML").css({"background-color":"#A2E87D"}); }
  else {alert("Du har hittat en bugg! Kontakta oss och berätta att du fick detta meddelande, och hur. Mail finns på om-sidan.")}
  $("body").css({"overflow":"hidden"});
  $.ajax({
    type: "POST",
    url: "/wiki/template.php",
    data: {"file": "<?= $link_r[0] ?>"},
    success: function( data ) {
      $("#newHTML").append(data);
      $("#newHTML").show("scale", 300, function () {});
    },
    dataType: "html"
  });
</script>
<?php
  } else {
?>
<script>
  $("body").css({"overflow":"hidden"});
  $("#newHTML").append('<div onclick="exit();" id="exit">X</div><h1>Detta ämne har vi inte skrivit om än! (Eller så finns inte ämnet i det kända periodiska systemet!)</h1><h2>Vill du hjälpa till att skriva en sida? Skicka in din text till oss via <a href="mailto:info.grundamnen@gmail.com">mail</a> så lägger vi till den till ämnet. </h2>');
  $("#newHTML").show("scale", 300, function () {});
</script>
<?php
}
}
?>
