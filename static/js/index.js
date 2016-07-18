// Add :containsExact
 $.expr[":"].containsExact = function (obj, index, meta, stack) {
   return (obj.textContent || obj.innerText || $(obj).text() || "") == meta[3];
 };

var loading = false;
$(document).on("ready", function(e){
  $("td").on("click", function(e) {
  if (!$(this).hasClass("td-extend") &&
      !$(this).hasClass("td-header") &&
      !$(this).hasClass("td-none") &&
      !$(this).hasClass("td-about") &&
      !$(this).hasClass("td-logo")) {
      if (!loading) {
        loading = true;
        var atomic_number = $(this).attr("data-number");
        var atomic_text = $(this).attr("data-name");
        if      ($(this).hasClass("pol")) $("#overlay").css({"background-color":"#C2CAFF"});
        else if ($(this).hasClass("alk")) $("#overlay").css({"background-color":"#FFC2C2"});
        else if ($(this).hasClass("jor")) $("#overlay").css({"background-color":"#FFE4C2"});
        else if ($(this).hasClass("ove")) $("#overlay").css({"background-color":"#C2FFCF"});
        else if ($(this).hasClass("eju")) $("#overlay").css({"background-color":"#DFDFDF"});
        else if ($(this).hasClass("ovr")) $("#overlay").css({"background-color":"#C2FFF2"});
        else if ($(this).hasClass("hme")) $("#overlay").css({"background-color":"#C2ECFF"});
        else if ($(this).hasClass("ick")) $("#overlay").css({"background-color":"#C2C7FF"});
        else if ($(this).hasClass("dia")) $("#overlay").css({"background-color":"#DCC2FF"});
        else if ($(this).hasClass("gas")) $("#overlay").css({"background-color":"#FFC2FF"});
        else if ($(this).hasClass("lan")) $("#overlay").css({"background-color":"#FAFFC2"});
        else if ($(this).hasClass("akt")) $("#overlay").css({"background-color":"#D7FFC2"});
        else alert("Du har hittat en bugg! Kontakta oss och berätta att du fick detta meddelande, och hur. Mail: info.grundamnen@gmail.com");
        $.ajax({
          type: "GET",
          url: "/api/"+atomic_text+"/json",
          dataType: "html",
          success: function(data) {
            console.log(data, "element json");
            if (typeof data === "string") data = JSON.parse(data);
            var output = "";
            if (data.published) {
              output += '<div class="incomplete">Denna sida är inte klar än. Innehållet kan vara oklar eller felaktigt.</div>';
            }
            output += '<div onclick="exit();" id="exit">X</div>';
            output += '<div class="element-info">';
            if (data.title != null) {
              output += "<h1>"+data.title+"</h1>";
              $("title").text(data.title+" - "+title);
            } else {
              output += "<h1>"+data.element+"</h1>";
              $("title").text(data.element+" - "+title);
            }
            output += "<br>";
            output += "<p>"+data.text+"</p>";
            output += '</div>';
            output += '<div class="element-data">';
            output += '<table>';
            for (var key in playbtn) {
              if (!playbtn.hasOwnProperty(key)) continue;
              var obj = playbtn[key];
              output += '<tr><td>'+key+'</td><td>'+obj+'</td></tr>';
            }
            output += '</table>';
            output += '<p><b>Författare:</b> '+data.author+'</p>';
            output += '<p><b>Senast Ändrad av </b>'+data.lasteditedby+' <b>datum</b> '+data.lastediteddate+'</p>';
            output += '</div>';
            $("#overlay").append(output);
            $("body").css({"overflow":"hidden"});
            if (getCookie("gr-settings-easing", "true") == "false") {
              $("#overlay").show();
            } else {
              $("#overlay").show("scale", 300);
            }
            loading = false;
          }
        });
      }
    }
  });
});

//Info/Help-rutan (färgförklaring)
$( "#help" ).dialog({
  autoOpen: false,
  title: "Färgförklaring"
});
$( ".help" ).click(function() {
  $( "#help" ).dialog( "open" );
});

// Settings-rutan:
$( "#settings" ).dialog({
  autoOpen: false,
  title: "Inställningar"
});
$( "#settings-button" ).click(function() {
  $( "#settings" ).dialog( "open" );
});

//Gör så att rutan stängs när man klickar på x. Funktionen anropas via onclick
function exit() {
  $("title").text(title);
  $("#overlay").empty();
  if (getCookie("gr-settings-easing", "true") == "false") {
    $("#overlay").hide();
  } else {
    $("#overlay").hide("scale", 200);
  }
  $("#rst").css({"overflow":"hidden", "display":"none"});
  $("body").css({"overflow":"initial"});
}

// Om man klickar på Esc ska rutan stängas:
$(document).keyup(function(e) {
  if (e.keyCode == 27) {
    exit();
  }
});
