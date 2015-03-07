<?php
$dir = "wiki/pages/";
$link = $_GET['simple_link'];
$link_r = explode("/", $link);
if (file_exists($dir.$link_r[1].".html")) {
?>
<script>
$("body").css({"overflow":"hidden"});
$.ajax({
  type: "POST",
  url: "wiki/template.php",
  data: {"file": "<?= $link_r[1] ?>"},
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
$( document ).html(<?php include("errors/404.php"); ?>);
</script>
<?php
}
?>
