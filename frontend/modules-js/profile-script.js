async function logout(url = "/logout") {
    const response = await fetch(url,
        { method: "POST" });
    if (response.redirected) {
        window.location.href = response.url;
    }
}

    //------------username on user profile----------
    var user = document.cookie
        .split("; ")
        .find((row) => row.startsWith("userCookie="))
        ?.split("=")[1];

    const username = document.querySelector(".username");
    username.innerHTML = user;

// const logout_btn = document.getElementById('logout_btn');

// logout_btn.addEventListener('click', () => {
//     fetch('/logout')
//         .then(() => {
//             // The server should automatically redirect to the new page.
//         })
//         .catch((error) => {
//             console.error('Failed to fetch URL:', error);
//         });
// });