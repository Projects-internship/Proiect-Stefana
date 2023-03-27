async function logout(url = "http://localhost:5000/logout", data = {}) {
    const response = await fetch(url, {
        method: "POST",
        headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
           },
        body: JSON.stringify(data),
    });
    return response.json();
}