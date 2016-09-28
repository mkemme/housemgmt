function loadData() {
  // Get actual statistics
  $("#ajax-loader").show();
  var xhr = $.ajax({ 
    url: "/temperature.json", 
    async: true,
    error: function(jqXHR, textStatus, errorThrown) { 
      // alert("ajax error");
    }
  }).done(function() { 
      $("#ajax-loader").hide();

      // Loop through json elements and search if there are such elements on the page. Update value if found
      // '{  "timestamp" : "Mon Jun 11 2012 16:04:01 GMT+0300 (EET)",  "datestamp" : "2012-06-11",  "agreementCount" : 19,  "users" : 74,  "newUserList" : [   "alex.abad@gmail.com",  "lbkoudijs@gmail.com",  "geh0jm5@fpl.com" ],  "uniqueUserDomainCount" : 40 }'
      var statistics = JSON.parse(xhr.responseText, function(key, value) {
        var element = document.getElementById(key);
  
        if (element) {
          element.innerHTML = value;
        }
      })    
    });
}

window.setInterval("loadData()", 1000 * 5); /* Once in 5 seconds */

$(document).ready(function() {
  loadData(); 
})