$(function () {
  $("#reset_btn").click(function (e) {
    $("#fullName").val("");
    $("#email").val("");
    $("#username").val("");
    $("#password").val("");
    $("#re_password").val("");
  });

  $("#register_btn").click(function (e) {
    var v_Fullname = $("#fullName").val();
    var v_Email = $("#email").val();
    var v_Username = $("#username").val();
    var v_Password = $("#password").val();
    var v_Re_Password = $("#re_password").val();
    var v_Department_ID = "1";
    var v_Position_ID = "1";

    if (!v_Fullname || v_Fullname.length < 6 || v_Fullname.length > 50) {
      // show thông báo
      alert("Fullname name must be from 6 to 50 characters!");
      return false;
    }

    var validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (v_Email.match(validRegex)) {
      if (!v_Email || v_Email.length < 6 || v_Email.length > 50) {
        // show thông báo
        alert("Email name must be from 6 to 50 characters!");
        return false;
      }
    } else {
      alert("Invalid email address!");
      return false;
    }

    if (!v_Username || v_Username.length < 6 || v_Username.length > 50) {
      // show thông báo
      alert("Username name must be from 6 to 50 characters!");
      return false;
    }

    if (v_Password != v_Re_Password) {
      alert("Mật khẩu không trùng khớp");
      return false;
    }

    // Check email exists
    $.ajax({
      type: "GET",
      url: "http://localhost:8080/api/v1/accounts/EmailExists/" + v_Email,
      dataType: "json",
      beforeSend: function (xhr) {
        xhr.setRequestHeader(
          "Authorization",
          "Basic " + btoa("Username1:123456")
        );
      },

      success: function (data, textStatus, xhr) {
        if (data == true) {
          alert("This email already exists on the system !");
          console.log(data);
          return false;
        } else {
          // Check username exists
          $.ajax({
            type: "GET",
            url:
              "http://localhost:8080/api/v1/accounts/UsernameExists/" +
              v_Username,
            dataType: "json",
            beforeSend: function (xhr) {
              xhr.setRequestHeader(
                "Authorization",
                "Basic " + btoa("Username1:123456")
              );
            },

            success: function (data, textStatus, xhr) {
              if (data == true) {
                alert("This username already exists on the system !");
                console.log(data);
                return false;
              } else {
                // Tạo 1 đối tượng account để lưu thông tin, bỏ trường ID vì đã nhận ID tự động tăng từ API
                var account = {
                  fullname: v_Fullname,
                  email: v_Email,
                  username: v_Username,
                  password: v_Password,
                  departmentId: v_Department_ID,
                  positionId: v_Position_ID,
                };

                $.ajax({
                  type: "POST",
                  url: "http://localhost:8080/api/v1/accountsRegister",
                  // data: account,
                  // dataType: "json",
                  contentType: "application/json; charset=UTF-8",
                  data: JSON.stringify(account),
                  beforeSend: function (xhr) {
                    xhr.setRequestHeader(
                      "Authorization",
                      "Basic " + btoa("Username1:123456")
                    );
                  },

                  success: function (data, textStatus, xhr) {
                    console.log(data);
                    alert("Mời bạn xác thực Email để đang kí tài khoản");
                    window.location.replace("Login.html");
                  },

                  error(jqXHR, textStatus, errorThrown) {
                    alert("Error when loading data");
                    console.log(jqXHR);
                    console.log(textStatus);
                    console.log(errorThrown);
                  },
                });
              }
            },

            error(jqXHR, textStatus, errorThrown) {
              console.log(jqXHR);
              console.log(textStatus);
              console.log(errorThrown);
            },
          });
        }
      },

      error(jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      },
    });
  });
});
