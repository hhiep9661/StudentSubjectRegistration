var listAccount = [];
var listDepartment = [];
var listPosition = [];

var currentPage = 1;
var size = 5;
var totalPages;
var totalElements;

var sortField = "id";
var isAsc = true;

// Load Page
$(function () {
  // Call API data

  getListStaffs();
  getListDepartments();
  getListPositions();

  $("#createDate").attr("disabled", "disabled");
  $("#ID").attr("disabled", "disabled");

  // reset form section
  $("#reset_btn").click(function (e) {
    $("#ID").val("");
    $("#email").val("");
    $("#userName").val("");
    $("#fullName").val("");
    $("#Department_ID").val("");
    $("#Position_ID").val("");
    $("#createDate").val("");
  });

  // save button section
  $("#save_btn").click(function (e) {
    // var v_ID = $("#ID").val();
    var v_email = $("#email").val();
    var v_userName = $("#userName").val();
    var v_fullName = $("#fullName").val();
    var v_Department_Name = $("#Department_ID").val();
    var v_Position_Name = $("#Position_ID").val();
    // var v_createDate = $("#createDate").val();

    // Validate
    var validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (v_email.match(validRegex)) {
      if (!v_email || v_email.length < 6 || v_email.length > 50) {
        alert("Email name must be from 6 to 50 characters!");
        return false;
      }
    } else {
      alert("Invalid email address!");
      return false;
    }

    if (!v_userName || v_userName.length < 6 || v_userName.length > 50) {
      alert("Username name must be from 6 to 50 characters!");
      return false;
    }

    if (!v_fullName || v_fullName.length < 6 || v_fullName.length > 50) {
      // show error message
      alert("Fullname name must be from 6 to 50 characters!");
      return false;
    }

    if (!v_Department_Name || v_Department_Name == "--Select a Department--") {
      // show error message
      alert("Please choose Department!");
      return false;
    }
    if (!v_Position_Name || v_Position_Name == "--Select a Position--") {
      // show error message
      alert("Please choose Possition!");
      return false;
    }

    for (let index = 0; index < listDepartment.length; index++) {
      if (listDepartment[index].name == v_Department_Name) {
        var v_Department_ID = listDepartment[index].id;
      }
    }

    for (let index = 0; index < listPosition.length; index++) {
      if (listPosition[index].name == v_Position_Name) {
        var v_Position_ID = listPosition[index].id;
      }
    }

    // Check email exists
    $.ajax({
      type: "GET",
      url: "http://localhost:8080/api/v1/accounts/EmailExists/" + v_email,
      dataType: "json",
      beforeSend: function (xhr) {
        xhr.setRequestHeader(
          "Authorization",
          "Basic " +
            btoa(
              localStorage.getItem("USERNAME") +
                ":" +
                localStorage.getItem("PASSWORD")
            )
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
              v_userName,
            dataType: "json",
            beforeSend: function (xhr) {
              xhr.setRequestHeader(
                "Authorization",
                "Basic " +
                  btoa(
                    localStorage.getItem("USERNAME") +
                      ":" +
                      localStorage.getItem("PASSWORD")
                  )
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
                  email: v_email,
                  username: v_userName,
                  fullname: v_fullName,
                  departmentId: v_Department_ID,
                  positionId: v_Position_ID,
                  // CreateDate: v_createDate,
                };
                //    add account vào ArrayList
                // listAccount.push(account);
                // showListAccount();

                // Push account to API
                $.ajax({
                  type: "POST",
                  url: "http://localhost:8080/api/v1/accounts",
                  // data: account,
                  // dataType: "json",
                  contentType: "application/json; charset=UTF-8",
                  data: JSON.stringify(account),
                  beforeSend: function (xhr) {
                    xhr.setRequestHeader(
                      "Authorization",
                      "Basic " +
                        btoa(
                          localStorage.getItem("USERNAME") +
                            ":" +
                            localStorage.getItem("PASSWORD")
                        )
                    );
                  },

                  success: function (data, textStatus, xhr) {
                    if ((totalElements %= 5)) {
                      currentPage = totalPages;
                    } else {
                      currentPage = totalPages + 1;
                    }
                    getListStaffs();
                    resetAfterCreate();
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

function deleteAccount(Index) {
  var v_id_del = listAccount[Index].ID;
  var confirm_del = confirm("Are you sure you want to delete ?");
  if (confirm_del) {
    $.ajax({
      type: "DELETE",
      url: "http://localhost:8080/api/v1/accounts/" + v_id_del,
      beforeSend: function (xhr) {
        xhr.setRequestHeader(
          "Authorization",
          "Basic " +
            btoa(
              localStorage.getItem("USERNAME") +
                ":" +
                localStorage.getItem("PASSWORD")
            )
        );
      },

      // success: function (response) {
      //   if (response == undefined || response == null) {
      //     alert("Error when loading data");
      //     return;
      //   }
      //   alert("Successfully deleted !!!");
      //   resetPaging();
      //   getListStaffs();
      // },

      success: function (data, textStatus, xhr) {
        alert("Successfully deleted !!!");
        resetPaging();
        getListStaffs();
        console.log(textStatus);
      },

      error(jqXHR, textStatus, errorThrown) {
        alert("Error when loading data");
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      },
    });
    // listAccount.splice(Index, 1); This is delete by listAccount method.
  } else {
    return;
  }
}

function editAccount(Index) {
  var v_id_update = listAccount[Index].ID;
  // Lấy giá trị các trường ID, Fullname, Department, Possition Fill vào Form
  // $("#ID").val(listAccount[Index].ID);
  // $("#email").val(listAccount[Index].Email);
  // $("#userName").val(listAccount[Index].UserName);
  $("#fullName").val(listAccount[Index].FullName);
  $("#Department_ID").val(listAccount[Index].Department);
  $("#Position_ID").val(listAccount[Index].Position);
  // $("#createDate").val(listAccount[Index].CreateDate);

  // Disable Email, Username, CreateDate field khi nhấn vào nút Edit do không cho cập nhật các trường này
  // $("#ID").attr("disabled", "disabled");
  $("#email").attr("disabled", "disabled");
  $("#userName").attr("disabled", "disabled");
  $("#createDate").attr("disabled", "disabled");

  $("#update_btn").click(function (e) {
    // return the result which need to edit to the screen
    // var v_ID = $("#ID").val();
    // var v_email = $("#email").val();
    // var v_userName = $("#userName").val();
    var v_fullName = $("#fullName").val();
    var v_Department_Name = $("#Department_ID").val();
    var v_Position_Name = $("#Position_ID").val();
    // var v_createDate = $("#createDate").val();

    for (let index = 0; index < listDepartment.length; index++) {
      if (listDepartment[index].name == v_Department_Name) {
        var v_Department_ID = listDepartment[index].id;
      }
    }

    for (let index = 0; index < listPosition.length; index++) {
      if (listPosition[index].name == v_Position_Name) {
        var v_Position_ID = listPosition[index].id;
      }
    }

    if (!v_fullName || v_fullName.length < 6 || v_fullName.length > 50) {
      // show error message
      alert("Fullname name must be from 6 to 50 characters!");
      return false;
    }

    var account_update = {
      // Email: v_email,
      // UserName: v_userName,
      fullname: v_fullName,
      departmentId: v_Department_ID,
      positionId: v_Position_ID,
      // CreateDate: v_createDate,
    };

    $.ajax({
      type: "PUT",
      url: "http://localhost:8080/api/v1/accounts/" + v_id_update,
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify(account_update),
      beforeSend: function (xhr) {
        xhr.setRequestHeader(
          "Authorization",
          "Basic " +
            btoa(
              localStorage.getItem("USERNAME") +
                ":" +
                localStorage.getItem("PASSWORD")
            )
        );
      },
      // success: function (response) {
      //   if (response == undefined || response == null) {
      //     alert("Error when loading data");
      //     return;
      //   } else {
      //     getListStaffs();
      //     resetAfterUpdate();
      //   }
      // },

      success: function (data, textStatus, xhr) {
        getListStaffs();
        resetAfterUpdate();
      },

      error(jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      },
    });
  });
}

function showListAccount() {
  // $("#Email_ID").removeAttr("disabled");
  // $("#Username_ID").removeAttr("disabled");
  //   Delete displayed results
  $("#resultSet_tbody").empty();

  for (let index = 0; index < listAccount.length; index++) {
    $("#resultSet_tbody").append(`
    <tr>
        <td>${listAccount[index].ID}</td>
        <td>${listAccount[index].Email}</td>
        <td>${listAccount[index].UserName}</td>
        <td>${listAccount[index].FullName}</td>
        <td>${listAccount[index].Department}</td>
        <td>${listAccount[index].Position}</td>
        <td>${listAccount[index].CreateDate}</td>
        <td>
           <button type="button" class="btn btn-warning" onclick="editAccount(${index})">
             Edit
           </button>
        </td>
        <td>
           <button type="button" class="btn btn-warning" onclick="deleteAccount(${index})">
             Delete
           </button>
        </td>
        <td><input id="myCheckbox${index}" type="checkbox"></td>
        
    </tr>
       `);
  }
}

function getListStaffs() {
  var url = "http://localhost:8080/api/v1/accounts/";

  // url += "?page=3&size=5";
  url += "?page=" + currentPage + "&size=" + size;

  // url += "&sort=id,asc";
  url += "&sort=" + sortField + "," + (isAsc ? "asc" : "desc");

  // url += "&search=Kỹ";
  var search = $("#input-search").val();
  if (search) {
    url += "&search=" + search;
  }

  // Call API from serve
  $.ajax({
    type: "GET",
    url: url,
    dataType: "json",
    beforeSend: function (xhr) {
      xhr.setRequestHeader(
        "Authorization",
        "Basic " +
          btoa(
            localStorage.getItem("USERNAME") +
              ":" +
              localStorage.getItem("PASSWORD")
          )
      );
    },

    // contentType: "application/json; charset=UTF-8",
    // success: function (response, status) {
    //   if (status == "error") {
    //     alert("Error when loading data");
    //     return;
    //   } else {
    //     console.log("Connect status is:", status);
    //     console.log("Data API is:", response);
    //     listAccount = [];
    //     parseData(response);
    //     showListAccount();
    //     totalPages = response.totalPages;
    //     pagingTable(totalPages);
    //   }
    // },

    success: function (data, textStatus, xhr) {
      listAccount = [];
      parseData(data);
      showListAccount();
      totalPages = data.totalPages;
      totalElements = data.totalElements;
      pagingTable(totalPages);
    },

    error(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

function parseData(data) {
  data.content.forEach((element) => {
    var account = {
      ID: element.id,
      Email: element.email,
      UserName: element.username,
      FullName: element.fullname,
      Department: element.department,
      Position: element.position,
      CreateDate: element.createDate,
    };
    listAccount.push(account);
  });
}

// Create pagination function
function pagingTable(pageAmount) {
  var pagingStr = "";

  // Generation previous button
  if (pageAmount > 1 && currentPage > 1) {
    pagingStr +=
      '<li class="page-item">' +
      '<a class="page-link" onClick="prevPaging()">Previous</a>' +
      "</li>";
  }

  // Generation 1,2,3... button
  for (let i = 0; i < pageAmount; i++) {
    pagingStr +=
      '<li class="page-item ' +
      (currentPage == i + 1 ? "active" : "") +
      '">' +
      '<a class="page-link" onClick="changePage(' +
      (i + 1) +
      ')">' +
      (i + 1) +
      "</a>" +
      "</li>";
  }

  // Generation next button
  if (pageAmount > 1 && currentPage < pageAmount) {
    pagingStr +=
      '<li class="page-item">' +
      '<a class="page-link" onClick="nextPaging()">Next</a>' +
      "</li>";
  }

  $("#pagination").empty();
  $("#pagination").append(pagingStr);
}

// When clicking previous button
function prevPaging() {
  changePage(currentPage - 1);
}

// When clicking 1,2,3... button
function changePage(page) {
  if (page == currentPage) {
    return;
  }
  currentPage = page;
  getListStaffs();
}

// When clicking next button
function nextPaging() {
  changePage(currentPage + 1);
}

function getListDepartments() {
  $.ajax({
    type: "GET",
    url: "http://localhost:8080/api/v1/departments",
    // contentType: "application/json",
    dataType: "json",
    beforeSend: function (xhr) {
      xhr.setRequestHeader(
        "Authorization",
        "Basic " +
          btoa(
            localStorage.getItem("USERNAME") +
              ":" +
              localStorage.getItem("PASSWORD")
          )
      );
    },

    // success: function (response, status) {
    //   if (status == "error") {
    //     alert("Error when loading data");
    //     return;
    //   } else {
    //     listDepartment = [];
    //     parseDataDep(response);
    //   }
    // },

    success: function (data, textStatus, xhr) {
      listDepartment = [];
      parseDataDep(data);
    },

    error(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

function parseDataDep(data) {
  data.forEach((element) => {
    var department = {
      id: element.id,
      name: element.name,
    };
    listDepartment.push(department);
  });

  for (let index = 0; index < listDepartment.length; index++) {
    $("#Department_ID").append(`
        <option>${listDepartment[index].name}</option>
        `);
  }
}

function getListPositions() {
  $.ajax({
    type: "GET",
    url: "http://localhost:8080/api/v1/positions",
    // contentType: "application/json",
    dataType: "json",
    beforeSend: function (xhr) {
      xhr.setRequestHeader(
        "Authorization",
        "Basic " +
          btoa(
            localStorage.getItem("USERNAME") +
              ":" +
              localStorage.getItem("PASSWORD")
          )
      );
    },

    // success: function (response, status) {
    //   if (status == "error") {
    //     alert("Error when loading data");
    //     return;
    //   } else {
    //     listPosition = [];
    //     parseDataPos(response);
    //   }
    // },

    success: function (data, textStatus, xhr) {
      listPosition = [];
      parseDataPos(data);
    },

    error(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

function parseDataPos(data) {
  data.forEach((element) => {
    var position = {
      id: element.id,
      name: element.name,
    };
    listPosition.push(position);
  });

  for (let index = 0; index < listPosition.length; index++) {
    $("#Position_ID").append(`
        <option>${listPosition[index].name}</option>
        `);
  }
}

// Sort function
function changeSort(field) {
  if (field == sortField) {
    isAsc = !isAsc;
  } else {
    sortField = field;
    isAsc = true;
  }
  getListStaffs();
}

// Reset default paging
function resetPaging() {
  currentPage = 1;
  size = 5;
  // sortField = "id";
}

function resetAfterUpdate() {
  $("#fullName").val("");
  $("#Department_ID").val("");
  $("#Position_ID").val("");
}

function resetAfterCreate() {
  $("#email").val("");
  $("#userName").val("");
  $("#fullName").val("");
  $("#Department_ID").val("");
  $("#Position_ID").val("");
}

// Search function
function handleSearch() {
  getListStaffs();
}

function deleteAll() {
  // get checked
  var ids = [];
  for (let index = 0; index < 5; index++) {
    var checkBox = document.getElementById("myCheckbox" + index);
    if (checkBox !== undefined && checkBox !== null) {
      if (checkBox.checked) {
        ids.push(listAccount[index].ID);
      }
    } else {
      break;
    }
  }

  console.log(ids);

  var confirm_del_All = confirm("Do you want to delete them all??");
  if (confirm_del_All) {
    $.ajax({
      type: "DELETE",
      url: "http://localhost:8080/api/v1/accounts/?ids=" + ids,
      beforeSend: function (xhr) {
        xhr.setRequestHeader(
          "Authorization",
          "Basic " +
            btoa(
              localStorage.getItem("USERNAME") +
                ":" +
                localStorage.getItem("PASSWORD")
            )
        );
      },

      success: function (data, textStatus, xhr) {
        alert("Successfully deleted !!!");
        resetPaging();
        getListStaffs();
        console.log(textStatus);
      },

      error(jqXHR, textStatus, errorThrown) {
        alert("Error when loading data");
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      },
    });
  } else {
    return;
  }
}
