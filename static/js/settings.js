function isInArray(value, array) {
  return array.indexOf(value) > -1;
}

$(document).on('ready', function(me){
  console.log(permissions, "permissions");

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

  // Load page based on url
  var url = window.location.href;
  page = url.split("/")[3];
  subpage = url.split("/")[4];
  console.log(url, page, subpage);
  if (page == "settings" && subpage != null && subpage != "") {
    if (subpage == "profile" || subpage == "approve" ||
        subpage == "users"    || subpage == "superadmin") {
      loadPage(subpage);
    } else {
      window.location.href = "/settings/profile";
    }
  } else {
    window.location.href = "/settings/profile";
  }
});

function loadPage(page) {
  $.post("/settings/"+page, {}, function(data){

  }, "json");
}
