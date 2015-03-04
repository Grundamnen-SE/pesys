 // Gör så att när man klickar på ett grundämne öppnas rutan:
$("td").on("click", function() {
  if (!$(this).hasClass("td-extend") && !$(this).hasClass("td-header") && !$(this).hasClass("td-none") && !$(this).hasClass("td-about") ) {
    string = $(this).html();
    if (string[string.length - 2] == ">") {
      last = string.substr(string.length - 1);
    } else if (string[string.length - 3] == ">") {
      last = string.substr(string.length - 2);
    } else {
      last = string.substr(string.length - 3);
    }

    $.ajax({
      type: "POST",
      url: "wiki/template.php",
      data: {"file": last},
      success: function(data) {
        $("#newHTML").append(data);
        $("body").css({"overflow":"hidden"});
        $("#newHTML").show("scale", 300, function () {

        });
      },
      dataType: "html"
    });
  }
});

//Gör så att rutan stängs när man klickar på x. Funktionen anropas via onclick
function exit() {
  $("#newHTML").empty();
  $("#newHTML").hide("scale", 200);
  $("body").css({"overflow":"initial"});
}

// Byter till avancerat/enkelt läge beroende på om #advmode är 1 eller inte:
if (location.hash == "#advmode=1") {
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
});

$( document ).ready(function() {
  $("td").css("height", $('td').width());
});
