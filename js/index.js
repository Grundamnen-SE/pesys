/* Cookie-hantering: */

function getCookie(cname, defaultVal) {
  var name = cname + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1);
    if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
  }
  return defaultVal;
}

function setCookie(cname, cvalue) {
  var exdays = 30;
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + "; " + expires;
}

// shadow:
$(".td-group").hover(function() {
  var i = $(this).index();
  $("td.g" + i + " div").addClass("td-hover");
}, function() {
  var i = $(this).index();
  $("td.g" + i + " div").removeClass("td-hover");
});

// Add :containsExact
$.expr[":"].containsExact = function (obj, index, meta, stack) {
  return (obj.textContent || obj.innerText || $(obj).text() || "") == meta[3];
};

var loading = false;
$("td").on("click", function() {
  var td = this;
  if (!$(this).hasClass("td-extend") && !$(this).hasClass("td-header") && !$(this).hasClass("td-none") && !$(this).hasClass("td-about") && !$(this).hasClass("td-logo")) {
    string = $(this).html();
    var position1 = string.search(/atomic_text">/);
    if (string.substr(position1 + 14, 1) == "<") {
      last = string.substr(position1 + 13, 1);
    } else if (string.substr(position1 + 15, 1) == "<") {
      last = string.substr(position1 + 13, 2);
    } else if (string.substr(position1 + 16, 1) == "<") {
      last = string.substr(position1 + 13, 3);
    }
    if      ($(td).hasClass("pol")) { $("#newHTML").css({"background-color":"#C2CAFF"}); }
    else if ($(td).hasClass("alk")) { $("#newHTML").css({"background-color":"#FFC2C2"}); }
    else if ($(td).hasClass("jor")) { $("#newHTML").css({"background-color":"#FFE4C2"}); }
    else if ($(td).hasClass("ove")) { $("#newHTML").css({"background-color":"#C2FFCF"}); }
    else if ($(td).hasClass("eju")) { $("#newHTML").css({"background-color":"#DFDFDF"}); }
    else if ($(td).hasClass("ovr")) { $("#newHTML").css({"background-color":"#C2FFF2"}); }
    else if ($(td).hasClass("hme")) { $("#newHTML").css({"background-color":"#C2ECFF"}); }
    else if ($(td).hasClass("ick")) { $("#newHTML").css({"background-color":"#C2C7FF"}); }
    else if ($(td).hasClass("dia")) { $("#newHTML").css({"background-color":"#DCC2FF"}); }
    else if ($(td).hasClass("gas")) { $("#newHTML").css({"background-color":"#FFC2FF"}); }
    else if ($(td).hasClass("lan")) { $("#newHTML").css({"background-color":"#FAFFC2"}); }
    else if ($(td).hasClass("akt")) { $("#newHTML").css({"background-color":"#D7FFC2"}); }
    else {alert("Du har hittat en bugg! Kontakta oss och berätta att du fick detta meddelande, och hur. Mail finns på om-sidan.")}
    if (!loading) {
      loading = true;
      $.ajax({
        type: "POST",
        url: "/wiki/template.php",
        data: {"file": last},
        success: function(data) {
          $("#newHTML").append(data);
          $("body").css({"overflow":"hidden"});
          if (getCookie("gr-settings-easing", "true") == "false") {
            $("#newHTML").show();
          } else {
            $("#newHTML").show("scale", 300);
          }
          loading = false;
        },
        dataType: "html"
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

/* Settings-rutan: */

$("#settings").dialog({
  autoOpen: false,
  title: "Inställningar"
});

$("#settings-button").click(function() {
  $("#settings").dialog("open");
});

function displaySimple() {
  $(".tr-group").css("display", "none");
  $(".td-period").css("display", "none");
  $(".yt").css("display", "block");
}

function displayAdvanced() {
  $(".tr-group").css("display", "table-row");
  $(".td-period").css("display", "table-cell");
  $(".yt").css("display", "none");
}

/* Alla cookie-settings på grundämnen.se börjar med 'gr-settings' som namn */

function settingsGet() {
  if (getCookie("gr-settings-easing") == "false") {
    $("#settings-easing").prop("checked", true);
  }

  if (getCookie("gr-settings-adv") == "true") {
    $("#settings-adv").prop("checked", true);
    displayAdvanced();
  } else {
    displaySimple();
  }
}

$("#settings-easing").click(function() {
  if( $(this).is(":checked") ) {
    setCookie("gr-settings-easing", "false");
  } else {
    setCookie("gr-settings-easing", "true");
  }
  settingsGet();
});

$("#settings-adv").click(function() {
  if( $(this).is(":checked") ) {
    setCookie("gr-settings-adv", "true");
  } else {
    setCookie("gr-settings-adv", "false");
  }
  settingsGet();
});

settingsGet();

/* --slut-- Settings-rutan */

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
