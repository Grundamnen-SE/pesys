<?php
$dir = "wiki/pages/";
if (file_exists($dir.$_GET['simple_link'].".html")) {
?>
<script>
$.ajax({
  type: "POST",
  url: "wiki/template.php",
  data: {"file": "<?= $_GET['simple_link'] ?>"},
  success: function( data ) {
    $("#newHTML").append(data);
    $("body").css({"overflow":"hidden"});
    $("#newHTML").show("scale", 300, function () {});
  },
  dataType: "html"
});
</script>
<?php
}
?>
