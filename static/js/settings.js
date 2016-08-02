function isInArray(value, array) {
  return array.indexOf(value) > -1;
}

$(document).on('ready', function(me){
  // Hide alert
  $("#alert").hide();

  //  Fix nav links with permissions
  $(".nav-link").each(function(i,e){
    var url = $(this).find("a").attr("href");
    var req_perm = $(this).find("a").attr("data-perm");
    if (!isInArray(req_perm, permissions)) {
      $(this).addClass("disabled");
      $(this).find("a").removeAttr("href");
      $(this).find("a").removeAttr("data-perm");
    }
  });

  // On nav link click
  $(".nav-link").on('click', function(e){
    if (!$(this).hasClass("disabled")) window.location.href = $(this).find("a").attr("href");
  });

  // (profile) On submit
  $('#profile-table button, #profile-table input').on('click keydown', function(e){
    console.log(e);
    if (e.which !== 13 && e.type == "keydown") return;
    if (e.type == "click" && $(this).is("input")) return;
    e.preventDefault();
    if ($(this).attr("type") === "text" || $(this).is("#save_profile")) {
      var pdata = {type: "profile", data: {username: $("#username").val(), name: $("#name").val()}};
    } else if ($(this).attr("type") === "password" || $(this).is("#save_password")) {
      if ($("#passwd").val() === $("#passwd_c").val()) {
        var pdata = {type: "passwd", data: {password: $("#passwd").val()}};
        $("#passwd").val("").removeClass("input-error");
        $("#passwd_c").val("").removeClass("input-error");
        $("#passwd_e").addClass("vishid").text("");
      } else {
        $("#passwd").addClass("input-error");
        $("#passwd_c").addClass("input-error");
        $("#passwd_e").removeClass("vishid").text("Passwords do not match");
        return;
      }
    } else {
      alert("invalid type");
      return;
    }
    $.post("/settings/profile", pdata, function(data){
      console.log(pdata, data);
      $("#alert").fadeIn();
      if (data.status == "success") {
        $("#alert").addClass("g")
        $("#alert p").text("Dina inställningar är sparade.");
      } else if (data.status == "error") {
        $("#alert").addClass("r")
        $("#alert p").text("Något gick fel! Error: "+data.error);
      }
      setTimeout(function(){
        $("#alert").fadeOut().removeClass("r g");
      }, 1000*10);
    }, "json");
  });
});
