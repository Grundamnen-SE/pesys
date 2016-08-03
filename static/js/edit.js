function edit() {
  if (element) {
    // Body data
    var body = $("#overlay").find(".element-info").find("#element-info-body");
    var rawdata = body.attr("data-elm-raw");
    $(body).html('<textarea placeholder="Text..." class="element-editor" rows="10">'+rawdata+'</textarea>');
    // Element info data
    $("#overlay").find(".element-data").find("table").find("tr").each(function(i,e){
      if (!$(this).find("td").hasClass("line")) {
        var value = $(this).find("[data-elm]").text();
        $(this).find("[data-elm]").html('<input type="number" value="'+value+'" class="element-editor">')
      }
    });
    // Title data
    if (user.permissions.indexOf("SUPERADMIN") !== -1) {
      /*var title = $("#overlay").find(".element-info").find("#element-info-title");
      $(title).html('<input type="text" value="'+title.text()+'" class="element-editor">');*/
    }
    // Toggle edit button
    $("#edit").attr("onclick", "save();");
    $("#edit .material-icons").text("save");
    //console.log("Overlay edit function activated |", title.text(), "|", body.text(), data);
  }
}

function save() {
  if (element) {
    var data = {};
    // Body data
    var body = $("#overlay").find(".element-info").find("#element-info-body");
    data.text = body.find("textarea").val();
    data.element = $("#overlay").find('[data-elm="element"]').text();
    data.number = $("#overlay").find('[data-elm="number"]').text();
    $(body).html(md.render(data.text));
    $(body).attr("data-elm-raw", data.text);
    // Element info data
    data["elementdata"] = {};
    $("#overlay").find(".element-data").find("table").find("tr").each(function(i,e){
      if (!$(this).find("td").hasClass("line")) {
        var obj = $(this).find("[data-elm]");
        var key = $(obj).attr("data-elm");
        var value = $(obj).find("input").val();
        data[key.split(".")[0]][key.split(".")[1]] = value;
        $(obj).html(value);
      }
    });
    // Title data
    if (user.permissions.indexOf("SUPERADMIN") !== -1) {
      /*var title = $("#overlay").find(".element-info").find("#element-info-title");
      var titletext = $(title).find("input").val();
      $(title).text(titletext);
      data.title = titletext;*/
    }
    // Extra data
    data["_id"] = $("#overlay").find('[data-elm="_id"]').text();
    // Send data
    console.log(data);
    $.post("/api/element/"+data.element, data, function(data){
      console.log(data);
      if (data.error) {
        if (data.error == "ok") {
          $("#alert").addClass("g");
          $("#alert p").text("Ämnet har sparats.");
          $("#alert").fadeIn(1500, alertFadeOut());
        } else if (data.error == "no change") {
          $("#alert").addClass("r");
          $("#alert p").text("Ämnet har inte sparats, något gick fel.");
          $("#alert").fadeIn(1500, alertFadeOut());
        }
      }
    });
    // Toggle edit button
    $("#edit").attr("onclick", "edit();");
    $("#edit .material-icons").text("edit");
  }
}

function alertFadeOut(){
  setTimeout(function(){
    $("#alert").fadeOut(1500, function(){
      $("#alert").removeClass("r g");
      $("#alert p").text("");
    });
  }, 1000*7);
}
