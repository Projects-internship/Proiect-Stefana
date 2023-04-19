async function logout(url = "/logout") {
  const response = await fetch(url, { method: "POST" });
  if (response.redirected) {
    window.location.href = response.url;
  }
}
