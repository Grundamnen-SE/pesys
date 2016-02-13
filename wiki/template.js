// Jquery och JqueryUI redan inkluderat i index

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
