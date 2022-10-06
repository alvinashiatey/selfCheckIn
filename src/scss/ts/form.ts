function handleSubmit() {
    const url = "https://script.google.com/macros/s/AKfycbxijLYMObBtoW2ok1RfpNW8kbiaprJGs2-RGUgLVPSFtyfBAiAB8R07-EaeQApnZ7w/exec"
    const formData = new FormData();
    const submitButton = document.getElementById("submit") as HTMLInputElement
    if (!submitButton) return
    submitButton.addEventListener("click", (e) => {
        e.preventDefault()
        formData.append("Last_Name", "Value")
        formData.append("First_Name", "Value")
        try {
            fetch(url, {
                method: "POST",
                body: formData,
            }).then(res => res.json()).then(val => console.log(val))
        } catch (err: any){
            console.log(err["message"])
        }
    })
}

export {handleSubmit}