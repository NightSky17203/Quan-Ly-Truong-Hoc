function register() {
    var form = JSON.stringify(Object.fromEntries(new FormData(document.getElementById("register-form"))));
    console.log(form)   
        fetch("http://localhost:3000/api/v1/register", {        
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: form
        }).then(res => res.json()).then(res => {
            if (res) {
                console.log(res.message)
            } else {    
                console.log(res.message)
            }
        });
}