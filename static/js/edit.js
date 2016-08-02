function edit() {
  if (element) {
    // Body data
    var body = $("#overlay").find(".element-info").find("#element-info-body");
    $(body).html('<textarea placeholder="Text..." class="element-editor">'+loadElementData.data.text+'</textarea>');
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
    data.element = body.find('[data-elm="id"]').text();
    $(body).html(md.render(body.find("textarea").val()));
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
    $.post("/api/element/"+loadElementData.data.element, data, function(data){
      console.log(data);
    });
    // Toggle edit button
    $("#edit").attr("onclick", "edit();");
    $("#edit .material-icons").text("edit");
  }
}
