// Add :containsExact
$.expr[":"].containsExact = function (obj, index, meta, stack) {
  return (obj.textContent || obj.innerText || $(obj).text() || "") == meta[3];
};

var loading = false;
var elementLoaded = [];
var loadElementData;
var startElement = "";
var element = false;
var playbtn = []; // Detta måste fixas (Det ska hämtas med jquery)

// Sätt ut attribut:
$(".tab1 td").each(function(i, o) {
  if (!$(this).hasClass("td-extend") &&
      !$(this).hasClass("td-header") &&
      !$(this).hasClass("td-none") &&
      !$(this).hasClass("td-about") &&
      !$(this).hasClass("td-logo")) {

    var nr = $(this).find(".atomic_number").text();
    var name = $(this).find(".atomic_text").text();
    $(this).attr("data-number", nr);
    $(this).attr("data-name", name);
    $(this).attr("data-iselm", "true");
  }
});

// Fixa play-knapp
for (var key in playbtn) {
  if (!playbtn.hasOwnProperty(key)) continue;
  var obj = playbtn[key];
  $('td[data-name="'+obj.element+'"]').find(".atomic_number").after('<img class="yt" src="/img/play.svg">');
}

function loadElement(elm, override) {
  var jselm = $('td[data-iselm][data-name="'+elm+'"]');
  if (!$(jselm).hasClass("td-extend") &&
      !$(jselm).hasClass("td-header") &&
      !$(jselm).hasClass("td-none") &&
      !$(jselm).hasClass("td-about") &&
      !$(jselm).hasClass("td-logo")) {
    if (!loading) {

      loading = true;
      var atomic_number = $(jselm).attr("data-number");
      var atomic_text = $(jselm).attr("data-name");

      var colors = {
        "pol": "#C2CAFF", "alk": "#FFC2C2", "jor": "#FFE4C2", "ove": "#C2FFCF", "eju": "#DFDFDF", "ovr": "#C2FFF2",
        "hme": "#C2ECFF", "ick": "#C2C7FF", "dia": "#DCC2FF", "gas": "#FFC2FF", "lan": "#FAFFC2", "akt": "#D7FFC2"
      }
      for (var prop in colors) {
        if (!colors.hasOwnProperty(prop)) continue;
        if ($(jselm).hasClass(prop)) {
          $("#overlay").css({"background-color": colors[prop]});
          break;
        }
      }

      $.ajax({
        type: "GET",
        url: "/api/element/"+atomic_text,
        dataType: "html",
        success: function(data) {
          if (typeof data === "string") data = JSON.parse(data);
          console.log(data);
          loadElementData = data;
          var elementdata = data.data;
          if (data.error) {
            if (data.code === 56) {

            } else {
              alert("Error: "+data.error);
              loading = false;
              return;
            }
          }
          window.history.pushState("", "", "/"+elementdata.element);
          $("title").text(elementdata.element+" - "+title);
          if (data.logged_in) {
            $("#overlay").prepend('<div onclick="edit();" id="edit"><i class="material-icons">edit</i></div>');
          }

          // Den här delen måste göras om, för det är extremt fult:
          for (var key in elementdata) {
            if (!elementdata.hasOwnProperty(key)) continue;
            var obj = elementdata[key];
            if (typeof obj === "object" && obj.constructor !== Array) {
              for (var intkey in obj) {
                if (!obj.hasOwnProperty(intkey)) continue;
                var intobj = obj[intkey];
                if (intobj.constructor === Array) {
                  for (var i = 0; i < intobj.length; i++) {
                    $('[data-elm="'+key+"."+intkey+'"]').append("<li>"+intobj[i]+"</li>");
                  }
                } else {
                  $('[data-elm="'+key+"."+intkey+'"]').append(intobj);
                }
                elementLoaded.push(key+"."+intkey);
              }
            } else if (obj.constructor === Array) {
              for (var i = 0; i < obj.length; i++) {
                if (typeof obj[i] === "object") {
                  for (var intkey in obj[i]) {
                    if (!obj[i].hasOwnProperty(intkey)) continue;
                    var intobj = obj[i][intkey];
                    $('[data-elm="'+key+"."+intkey+'"]').append("<li>"+intobj+"</li>")
                    elementLoaded
                  }
                } else {
                  $('[data-elm="'+key+'"]').append("<li>"+obj[i]+"</li>");
                }
              }
              elementLoaded.push(key);
            } else {
              if ($('[data-elm="'+key+'"]').attr("data-elm-attr") == "markdown") {
                $('[data-elm="'+key+'"]').attr("data-elm-raw", obj.toString());
                obj = md.render(obj.toString());
                $('[data-elm="'+key+'"]').append(obj);
              } else if ($('[data-elm="'+key+'"]').attr("data-elm-attr") == "attribute") {
                $('[data-elm="'+key+'"]').attr("data-elm-raw", obj.toString());
              } else {
                $('[data-elm="'+key+'"]').append(obj);
              }
              elementLoaded.push(key);
            }
          }
          $("body").css({"overflow":"hidden"});
          if (getCookie("gr-settings-easing", "true") == "false" || override) {
            $("#overlay").show();
          } else {
            $("#overlay").show("scale", 300);
          }
          element = true;
          loading = false;
        }
      });
    }
  }
}


if (startElement !== "") {
  loadElement(startElement);
}

$("td").on("click", function(e) {
  if ($(this).attr("data-iselm") === "true" && $(this).attr("data-name") !== null && $(this).attr("data-name") !== "") {
    console.log("test");
    loadElement($(this).attr("data-name"));
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

//Gör så att rutan stängs när man klickar på x. Funktionen anropas via onclick
function exit(override) {
  $("title").text(title);
  window.history.pushState("", "", "/");
  $("#edit").remove();
  for (var i = 0; i < elementLoaded.length; i++) {
    $('[data-elm="'+elementLoaded[i]+'"]').empty();
    if ($('[data-elm="'+elementLoaded[i]+'"]').attr("data-elm-raw") != false) {
      $('[data-elm="'+elementLoaded[i]+'"]').removeAttr("data-elm-raw");
    }
  }
  elementLoaded = [];
  if (getCookie("gr-settings-easing", "true") == "false" || override) {
    $("#overlay").hide();
  } else {
    $("#overlay").hide("scale", 200);
  }
  $("#rst").css({"overflow":"hidden", "display":"none"});
  $("body").css({"overflow":"initial"});
  element = false;
  loadElementData = {};
}

// Om man klickar på Esc ska rutan stängas:
$(document).keyup(function(e) {
  if (e.keyCode == 27) {
    exit();
  }
});
