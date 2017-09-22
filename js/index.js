/* Globala variabler: */

var loading = false;

// Add :containsExact
$.expr[":"].containsExact = function(obj, index, meta, stack) {
  return (obj.textContent || obj.innerText || $(obj).text() || "") == meta[3];
};

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

// Highlight för grupper och perioder:

$(".td-group").hover(function() {
  var i = $(this).index();
  $("td.g" + i + " div").addClass("td-hover");
}, function() {
  var i = $(this).index();
  $("td.g" + i + " div").removeClass("td-hover");
});

$(".td-period").hover(function(){
  var i = $(this).parent().index() + 1;
  if (i > 8)
    return;
  $("tr:nth-child(" + i + ") td:not(.td-header, .td-about, .td-logo, .td-none, .td-extend) div").addClass("td-hover");
}, function() {
  var i = $(this).parent().index() + 1;
  $("tr:nth-child(" + i + ") td:not(.td-header, .td-about, .td-logo, .td-none, .td-extend) div").removeClass("td-hover");
});

$("td").on("click", function() {
  var td = this;

  if (!$(this).hasClass("td-extend") && !$(this).hasClass("td-header") && !$(this).hasClass("td-none") && !$(this).hasClass("td-about") && !$(this).hasClass("td-logo")) {
    var string = $(this).html();
    var notation;
    var position1 = string.search(/atomic_text">/);

    if (string.substr(position1 + 14, 1) == "<") {
      notation = string.substr(position1 + 13, 1);
    } else if (string.substr(position1 + 15, 1) == "<") {
      notation = string.substr(position1 + 13, 2);
    } else if (string.substr(position1 + 16, 1) == "<") {
      notation = string.substr(position1 + 13, 3);
    }

    openWikiPage(notation);
  }
});

function openWikiPage(wikiName, disableEasing)
{
  disableEasing = typeof disableEasing === "undefined" ? false : true;

  // Först kollar vi om wikiName är ett element, isf letar vi upp den td:n för att ta reda på bakgrundsfärg:
  var tdElem = $("span.atomic_text:containsExact(" + wikiName + ")").first().parent("div").parent("td");

  if (tdElem.length > 0) {
    if      (tdElem.hasClass("pol")) $("#newHTML").css({"background-color":"#C2CAFF"});
    else if (tdElem.hasClass("alk")) $("#newHTML").css({"background-color":"#FFC2C2"});
    else if (tdElem.hasClass("jor")) $("#newHTML").css({"background-color":"#FFE4C2"});
    else if (tdElem.hasClass("ove")) $("#newHTML").css({"background-color":"#C2FFCF"});
    else if (tdElem.hasClass("eju")) $("#newHTML").css({"background-color":"#DFDFDF"});
    else if (tdElem.hasClass("ovr")) $("#newHTML").css({"background-color":"#C2FFF2"});
    else if (tdElem.hasClass("hme")) $("#newHTML").css({"background-color":"#C2ECFF"});
    else if (tdElem.hasClass("ick")) $("#newHTML").css({"background-color":"#C2C7FF"});
    else if (tdElem.hasClass("dia")) $("#newHTML").css({"background-color":"#DCC2FF"});
    else if (tdElem.hasClass("gas")) $("#newHTML").css({"background-color":"#FFC2FF"});
    else if (tdElem.hasClass("lan")) $("#newHTML").css({"background-color":"#FAFFC2"});
    else if (tdElem.hasClass("akt")) $("#newHTML").css({"background-color":"#D7FFC2"});
  } else {
    $("#newHTML").css({"background-color":"white"});
  }

  if (!loading) {
    loading = true;
    $.ajax({
      type: "POST",
      url: "/wiki/template.php",
      data: {"file": wikiName},
      success: function(data) {
        $("#newHTML").html(data);
        window.location.hash = wikiName;
        $("body").css({"overflow":"hidden"});
        if (getCookie("gr-settings-easing", "true") == "false" || disableEasing) {
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

$(".help").click(function() {
  openWikiPage("förklaring");
});

function displaySimple() {
  $(".tr-group").css("display", "none");
  $(".td-period, .td-period-empty").css("display", "none");
  $(".yt").css("display", "block");
  $(".atomic_mass").css("display", "none");
}

function displayAdvanced() {
  $(".tr-group").css("display", "table-row");
  $(".td-period, .td-period-empty").css("display", "table-cell");
  $(".yt").css("display", "none");
  $(".atomic_mass").css("display", "block");
}

/* Settings-rutan: */

$("#settings").dialog({
  autoOpen: false,
  title: "Inställningar"
});

$("#settings-button").click(function() {
  $("#settings").dialog("open");
});

// Alla cookie-settings på grundämnen.se börjar med 'gr-settings' som namn

function loadSettings() {
  if (getCookie("gr-settings-easing") === "false") {
    $("#settings-easing").prop("checked", true);
  }

  if (getCookie("gr-settings-adv") === "true") {
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
  loadSettings();
});

$("#settings-adv").click(function() {
  if( $(this).is(":checked") ) {
    setCookie("gr-settings-adv", "true");
  } else {
    setCookie("gr-settings-adv", "false");
  }
  loadSettings();
});

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
  removeHash();
}

// Om man klickar på Esc ska rutan stängas:
$(document).keyup(function(e) {
  if (e.keyCode == 27) {
    exit();
  }
});

function loadWikiPageFromHash() {
  if (window.location.hash) {
    openWikiPage(window.location.hash.substr(1), true);
  }
}

function removeHash() {
  history.pushState("", document.title, window.location.pathname);
}

addEventListener("hashchange", loadWikiPageFromHash);

/* Kod som ska köras direkt vid sidladdning: */

loadSettings();
loadWikiPageFromHash();
