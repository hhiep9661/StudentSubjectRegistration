function logoutSuccess() {
  localStorage.removeItem("ID");
  localStorage.removeItem("FULL_NAME");
  localStorage.removeItem("USERNAME");
  localStorage.removeItem("PASSWORD");

  // redirect to login page
  window.location.replace("Login.html");
}
