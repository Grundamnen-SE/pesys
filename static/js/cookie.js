/* Cookie-hantering: */

function getCookie(cname, defaultVal) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return defaultVal;
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function settingsGet() {
  if (getCookie("gr-settings-easing") == "false") {
    $("#settings-easing").prop("checked", true);
  }
}

$("#settings-easing").click(function() {
  if( $(this).is(":checked") ) {
    setCookie("gr-settings-easing", "false", "30");
  } else {
    setCookie("gr-settings-easing", "true", "30");
  }

  settingsGet();
});

settingsGet();
