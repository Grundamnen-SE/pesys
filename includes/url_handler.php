<?php

  $dir = "wiki/pages/";
  if (isset($_GET['simple_link'])) {
    $link = $_GET['simple_link'];
    $link_r = explode("/", $link);
  }

  if (isset($link_r) && $link_r[0] != "" && $link_r != null && $link != null) {

    if (file_exists($dir.$link_r[0].".html")) {

      /* --------------------- */
      /*    Om ämnet finns:    */
      /* --------------------- */

?>
<script>

  if      ($("span.atomic_text:containsExact('<?= $link_r[0] ?>')").first().parent("div").parent("td").hasClass("ick")) { $("#newHTML").css({"background-color":"#C2CAFF"}); }
  else if ($("span.atomic_text:containsExact('<?= $link_r[0] ?>')").first().parent("div").parent("td").hasClass("alk")) { $("#newHTML").css({"background-color":"#FFC2C2"}); }
  else if ($("span.atomic_text:containsExact('<?= $link_r[0] ?>')").first().parent("div").parent("td").hasClass("jor")) { $("#newHTML").css({"background-color":"#FFE4C2"}); }
  else if ($("span.atomic_text:containsExact('<?= $link_r[0] ?>')").first().parent("div").parent("td").hasClass("ove")) { $("#newHTML").css({"background-color":"#C2FFCF"}); }
  else if ($("span.atomic_text:containsExact('<?= $link_r[0] ?>')").first().parent("div").parent("td").hasClass("eju")) { $("#newHTML").css({"background-color":"#FFC2DC"}); }
  else if ($("span.atomic_text:containsExact('<?= $link_r[0] ?>')").first().parent("div").parent("td").hasClass("ovr")) { $("#newHTML").css({"background-color":"#C2FFF2"}); }
  else if ($("span.atomic_text:containsExact('<?= $link_r[0] ?>')").first().parent("div").parent("td").hasClass("hme")) { $("#newHTML").css({"background-color":"#C2ECFF"}); }
  else if ($("span.atomic_text:containsExact('<?= $link_r[0] ?>')").first().parent("div").parent("td").hasClass("ick")) { $("#newHTML").css({"background-color":"#C2C7FF"}); }
  else if ($("span.atomic_text:containsExact('<?= $link_r[0] ?>')").first().parent("div").parent("td").hasClass("hao")) { $("#newHTML").css({"background-color":"#DCC2FF"}); }
  else if ($("span.atomic_text:containsExact('<?= $link_r[0] ?>')").first().parent("div").parent("td").hasClass("gas")) { $("#newHTML").css({"background-color":"#FFC2FF"}); }
  else if ($("span.atomic_text:containsExact('<?= $link_r[0] ?>')").first().parent("div").parent("td").hasClass("lan")) { $("#newHTML").css({"background-color":"#FAFFC2"}); }
  else if ($("span.atomic_text:containsExact('<?= $link_r[0] ?>')").first().parent("div").parent("td").hasClass("akt")) { $("#newHTML").css({"background-color":"#D7FFC2"}); }
  else {alert("Du har hittat en bugg! Kontakta oss och berätta att du fick detta meddelande, och hur. Mail finns på om-sidan.")}
  $("body").css({"overflow":"hidden"});
  $.ajax({
    type: "POST",
    url: "/wiki/template.php",
    data: {"file": "<?= $link_r[0] ?>"},
    success: function( data ) {
      $("#newHTML").append(data);
      $("body").css({"overflow":"hidden"});
      $("#newHTML").show();
    },
    dataType: "html"
  });
</script>

<?php

    } else {

      /* --------------------- */
      /*  Om ämnet inte finns: */
      /* --------------------- */

?>

<script>
  $("body").css({"overflow":"hidden"});
  $("#newHTML").css({"background-color":"white"});
  $("#newHTML").append('<div class="not-exist"><div onclick="exit();" id="exit">X</div><h1>Detta ämne har vi inte skrivit om än!</h1><h2>Vill du hjälpa till att skriva en sida? Skicka in din text till oss via <a href="mailto:info.grundamnen@gmail.com">mail</a> så lägger vi till den till ämnet. </h2></div>');
  $("#newHTML").show("scale", 300, function () {});
</script>

<?php

    }
  }

?>
