function goToRegisterPage() {
  // redirect to register page
  window.location.href = "http://127.0.0.1:5500/Register.html";
}

function loginSuccess() {
  // Get username and password
  var username = $("#username").val();
  var password = $("#password").val();

  // Call API
  $.ajax({
    type: "GET",
    url: "http://localhost:8080/api/v1/login",
    contentType: "application/json",
    dataType: "json", // datatype return
    beforeSend: function (xhr) {
      xhr.setRequestHeader(
        "Authorization",
        "Basic " + btoa(username + ":" + password)
      );
    },
    success: function (data, textStatus, xhr) {
      // check active status
      if (data.status == "NOT_ACTIVE") {
        alert("Please active account");
        return false;
      }
      // save data to storage
      // https://www.w3schools.com/html/html5_webstorage.asp
      localStorage.setItem("ID", data.id);
      localStorage.setItem("FULL_NAME", data.fullName);
      localStorage.setItem("USERNAME", username);
      localStorage.setItem("PASSWORD", password);

      // redirect to home page
      // https://www.w3schools.com/howto/howto_js_redirect_webpage.asp
      window.location.replace("index.html");
    },

    error(jqXHR, textStatus, errorThrown) {
      if (jqXHR.status == 401) {
        alert(" UserName or password is wrong, check the information again!!");
        return false;
      } else {
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      }
    },
  });
}
