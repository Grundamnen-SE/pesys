<?php
$dir = "wiki/pages/";
$link = $_GET['simple_link'];
$link_r = explode("/", $link);
print_r($link_r);
if (file_exists($dir.$link_r[0].".html")) {
?>
<script>
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
$("#newHTML").append("<h1>Detta ämne har vi inte skrivit om än!</h1><h2>Vill du hjälpa till att skriva en sida? Skicka in din text till oss via <a href=\"mailto:info.grundamnen@gmail.com\">mail</a> så lägger vi till den till ämnet. </h2>");
$("#newHTML").show("scale", 300, function () {});
</script>
<?php
}
?>
