// Add :containsExact
 $.expr[":"].containsExact = function (obj, index, meta, stack) {
   return (obj.textContent || obj.innerText || $(obj).text() || "") == meta[3];
 };

var loading = false;

$("td").on("click", function(e) {
  if (!$(this).hasClass("td-extend") &&
      !$(this).hasClass("td-header") &&
      !$(this).hasClass("td-none") &&
      !$(this).hasClass("td-about") &&
      !$(this).hasClass("td-logo")) {

    var atomic_number = $(this).find(".atomic_number").text();
    var atomic_text = $(this).find(".atomic_text").text();
    if      ($(this).hasClass("pol")) { $("#newHTML").css({"background-color":"#C2CAFF"}); }
    else if ($(this).hasClass("alk")) { $("#newHTML").css({"background-color":"#FFC2C2"}); }
    else if ($(this).hasClass("jor")) { $("#newHTML").css({"background-color":"#FFE4C2"}); }
    else if ($(this).hasClass("ove")) { $("#newHTML").css({"background-color":"#C2FFCF"}); }
    else if ($(this).hasClass("eju")) { $("#newHTML").css({"background-color":"#DFDFDF"}); }
    else if ($(this).hasClass("ovr")) { $("#newHTML").css({"background-color":"#C2FFF2"}); }
    else if ($(this).hasClass("hme")) { $("#newHTML").css({"background-color":"#C2ECFF"}); }
    else if ($(this).hasClass("ick")) { $("#newHTML").css({"background-color":"#C2C7FF"}); }
    else if ($(this).hasClass("dia")) { $("#newHTML").css({"background-color":"#DCC2FF"}); }
    else if ($(this).hasClass("gas")) { $("#newHTML").css({"background-color":"#FFC2FF"}); }
    else if ($(this).hasClass("lan")) { $("#newHTML").css({"background-color":"#FAFFC2"}); }
    else if ($(this).hasClass("akt")) { $("#newHTML").css({"background-color":"#D7FFC2"}); }
    else {alert("Du har hittat en bugg! Kontakta oss och berätta att du fick detta meddelande, och hur. Mail: info.grundamnen@gmail.com")}
    if (!loading) {
      loading = true;
      $.ajax({
        type: "GET",
        url: "/"+atomic_text,
        dataType: "html",
        success: function(data) {
          $("#newHTML").append(data);
          $("body").css({"overflow":"hidden"});
          if (getCookie("gr-settings-easing", "true") == "false") {
            $("#newHTML").show();
          } else {
            $("#newHTML").show("scale", 300);
          }
          loading = false;
        }
      });
    }
  }
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

function settingsGet() {
  if (getCookie("gr-settings-easing") == "false") {
    $("#settings-easing").prop("checked", true);
  }
}

$("#settings-easing").click(function() {
  if( $(this).is(":checked") ) {
    setCookie("gr-settings-easing", "false", "30");
  } else {
    setCookie("gr-settings-easing", "true", "30");
  }

  settingsGet();
});

settingsGet();

//Gör så att rutan stängs när man klickar på x. Funktionen anropas via onclick
function exit() {
  $("#newHTML").empty();
  if (getCookie("gr-settings-easing", "true") == "false") {
    $("#newHTML").hide();
  } else {
    $("#newHTML").hide("scale", 200);
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

// Event-handlers:
