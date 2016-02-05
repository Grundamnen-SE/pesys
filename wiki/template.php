<div onclick="exit();" id="exit">X</div>

<?php
  $file = "pages/" . $_POST['file'] . ".html";
  if (file_exists($file)) {
?>
<div class="info">
  <?php include ($file); ?>
</div>
<div class="extra-info">
  <p>Snabblänk: <a href="http://<?= $_SERVER['SERVER_NAME'] ?>/l/<?= $_POST['file'] ?>">grundämnen.se/l/<?= $_POST['file'] ?></a></p>
  <p>Vi reserverar oss för eventuella faktafel.</p>
  <p>Är något fel? Är det något du vill lägga till?
  <a href="mailto:info.grundamnen@gmail.com">Maila oss</a> så lägger vi till din ändring!</p>
</div>

<script>

  // Jquery ui JqueryUI redan inkluderat i index

  // Gör så när man klickar på en img med attributet "data-info", kommer värdet att visas i en ruta. (Licens-info, upphovsman, länk mm):

  $("img[data-info]").each(function(index) {
    el = $("<div class='data-info-div'>" + $( this ).attr("data-info") + "</div>");
    $(this).after(el);
    $(this).click(function(event) {
      el.fadeToggle(100);
    });

    el.fadeToggle(100); // Gör hidden by default

    // Sätt max width (Bredden måste vara minst 200):
    $(this).load(function() {
      var width = $(this).width();

      if (width > 199) {
        el.css("max-width", width);
      } else {
        el.css("max-width", 200);
      }
    });
  });
/*
  $("img[data-info]").after($("<div>" + img.attr("data-info") + "</div>")
    .addClass("data-info-div")
    .css("max-width", img.css("width"))
  );

  $("img[data-info]").click(function(event) {
    var img = $(event.target);

    info = img.after($("<div>" + img.attr("data-info") + "</div>")
      .addClass("data-info-div")
      .css("max-width", img.css("width"))
      .click(function(event2) {
        event2.target.remove();
      })
    );
  });
  */

</script>

<?php
  } else {
    echo '<div class="not-exist"><h1>Detta ämne har vi inte skrivit om än!</h1>';
    echo '<h2>Vill du hjälpa till att skriva en sida? Skicka in din text till oss via <a href=\"mailto:info.grundamnen@gmail.com\">mail</a> så lägger vi till den till ämnet. </h2></div>';
  }
?>
