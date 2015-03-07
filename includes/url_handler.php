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
  url: "wiki/template.php",
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
$( "html" ).html("<?php include("errors/404.php"); ?>");
</script>
<?php
}
?>
