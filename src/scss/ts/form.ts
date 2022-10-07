function handleSubmit() {
    const submitButton = document.getElementById("submit") as HTMLInputElement
    if (!submitButton) return
    submitButton.addEventListener("click", async (e) => {
        e.preventDefault()
        const firstName = document.querySelector(".first") as HTMLInputElement
        const lastName = document.querySelector(".last") as HTMLInputElement
        if (!firstName && !lastName) return
        await handleFetch(firstName, lastName)
    })
}

function initialCheck () {
    console.log("here",checkIfCompleted() )
    if (checkIfCompleted()) return addCompletedToInnerContainer()
}

async function handleFetch(firstName: HTMLInputElement, lastName: HTMLInputElement){
    if (checkIfCompleted()) return addCompletedToInnerContainer();
    if (lastName.value.trim() === "" && firstName.value.trim() === "") return
    const url = "https://script.google.com/macros/s/AKfycbxijLYMObBtoW2ok1RfpNW8kbiaprJGs2-RGUgLVPSFtyfBAiAB8R07-EaeQApnZ7w/exec"
    const formData = new FormData();
    [{k: "Last_Name", v: lastName.value.trim()}, {k: "First_Name", v: firstName.value.trim()}].forEach(value => formData.append(value.k, value.v))
    try {
        const {result} = await fetch(url, {
            method: "POST",
            body: formData,
        })
            .then(res => res.json())
        resetInputValues (firstName, lastName)
        saveToLocalStorage(result)
    } catch (err: any){
        console.log(err["message"])
    }
}

function addCompletedToInnerContainer() {
    const completedInnerContainer = document.querySelector(".inner-container") as HTMLDivElement
    if (!completedInnerContainer) return
    completedInnerContainer?.classList.add("completed")
    animationEnd()
}

function saveToLocalStorage(state:string) {
    if (!state) return
    const date: Date = new Date()
    const save = {
        completed:  true,
        date: date.toDateString()
    }
    localStorage.setItem("completed", JSON.stringify(save))
    addCompletedToInnerContainer()
}

function checkIfCompleted():boolean {
    const isCompleted = localStorage.getItem("completed")
    const today = new Date()
    if (!isCompleted) return false
    const savedValue = JSON.parse(isCompleted)
    return (today.toDateString() === savedValue.date);
}

function resetInputValues (...inputs: HTMLInputElement[]) {
    for (let input of inputs) {
        input.value = ""
    }
}

function animationEnd() {
    const innerContainerCompleted = document.querySelector(".inner-container.completed") as HTMLDivElement
    if (!innerContainerCompleted ) return
    innerContainerCompleted .addEventListener("animationend", ()=>{
        innerContainerCompleted .style.display= "none"
    })
}

export {handleSubmit, initialCheck}