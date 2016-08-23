var user;
$.get("/api/user", function(data){
  if (data.error) return alert("Error: "+data.error);
  user = data;
  console.log(user);
});
