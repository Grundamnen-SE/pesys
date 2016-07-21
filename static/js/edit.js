function edit() {
  if (element) {
    var title = $("#overlay").find(".element-info").find("#element-info-title");
    var body = $("#overlay").find(".element-info").find("#element-info-body");
    var data = {};
    $("#overlay").find(".element-data").find("table").find("tr").each(function(i,e){
      if (i != 0) {
        var key   = $(this).find(".key");
        var value = $(this).find(".value");
        data[key.text()] = value.text();
      }
    });
    console.log("Overlay edit function |", title.text(), body.text(), data);
  }
}
