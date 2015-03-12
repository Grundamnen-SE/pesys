 // Gör så att när man klickar på ett grundämne öppnas rutan:

 // Updaterad!
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
    if ($(td).hasClass("ick")) { $("#newHTML").css({"background-color":"#7D89E8"}); }
    else if ($(td).hasClass("alk")) { $("#newHTML").css({"background-color":"#E87D7D"}); }
    else if ($(td).hasClass("jor")) { $("#newHTML").css({"background-color":"#E8B87D"}); }
    else if ($(td).hasClass("ove")) { $("#newHTML").css({"background-color":"#7DE894"}); }
    else if ($(td).hasClass("eju")) { $("#newHTML").css({"background-color":"#E87DAD"}); }
    else if ($(td).hasClass("ovr")) { $("#newHTML").css({"background-color":"#7DE8CF"}); }
    else if ($(td).hasClass("hme")) { $("#newHTML").css({"background-color":"#7DC6E8"}); }
    else if ($(td).hasClass("ick")) { $("#newHTML").css({"background-color":"#7D89E8"}); }
    else if ($(td).hasClass("hao")) { $("#newHTML").css({"background-color":"#AB7DE8"}); }
    else if ($(td).hasClass("gas")) { $("#newHTML").css({"background-color":"#E67DE8"}); }
    else if ($(td).hasClass("lan")) { $("#newHTML").css({"background-color":"#DDE87D"}); }
    else if ($(td).hasClass("akt")) { $("#newHTML").css({"background-color":"#A2E87D"}); }
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
          $("#newHTML").show("scale", 300, function () {});
          loading = false;
        },
        dataType: "html"
      });
    }
  }
});

//Info/Help-rutan (färgförklaring)
$(".help").on("click", function() {
  $("#help").toggle("fade", 200);
});

//Gör så att rutan stängs när man klickar på x. Funktionen anropas via onclick
function exit() {
  $("#newHTML").empty();
  $("#newHTML").hide("scale", 200);
  $("#rst").css({"overflow":"hidden", "display":"none"});
  $("body").css({"overflow":"initial"});
}

$(document).keyup(function(e) {
  if (e.keyCode == 27) {
      exit();
  }
});

// Byter till avancerat/enkelt läge beroende på om #advmode är 1 eller inte:
/*if (location.hash == "#advmode=1") {
  $("#advmode").attr('checked',true);
  $('#sim_table').hide();
  $('#adv_table').show();
} else {
  $('#sim_table').show();
  $('#adv_table').hide();
}

// Byter till avancerat/enkelt läge beroende på om checkrutan är ifylld eller inte:
$("#advmode").on('change', function() {
  if ($("#advmode").prop('checked') === false) {
    location.hash = "";
    $('#sim_table').show();
    $('#adv_table').hide();
  } else {
    location.hash = "#advmode=1";
    $('#sim_table').hide();
    $('#adv_table').show();
  }
}); */

// Kanske har någon betydelse...
