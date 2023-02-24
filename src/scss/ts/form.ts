function handleSubmit() {
    const submitButton = document.getElementById("submit") as HTMLInputElement
    if (!submitButton) return
    submitButton.addEventListener("click", async (e) => {
        e.preventDefault()
        const firstName = document.querySelector(".first") as HTMLInputElement
        const lastName = document.querySelector(".last") as HTMLInputElement
        const eventName = document.querySelector(".event") as HTMLInputElement
        if (!firstName && !lastName) return
        await handleFetch(firstName, lastName, eventName)
    })
}

function initialCheck () {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    if (checkIfCompleted()) return addAnimateCssClass()
}

async function handleFetch(firstName: HTMLInputElement, lastName: HTMLInputElement, event:HTMLInputElement){
    if (checkIfCompleted()) return addAnimateCssClass();
    if (lastName.value.trim() === "" && firstName.value.trim() === "") return
    const eventNamePlaceholder = document.getElementById("event_name_pl") as HTMLSpanElement
    const firstNamePlaceholder = document.getElementById("first_name_pl") as HTMLSpanElement
    const lastNamePlaceholder = document.getElementById("last_name_pl") as HTMLSpanElement
    const url = "https://script.google.com/macros/s/AKfycbxijLYMObBtoW2ok1RfpNW8kbiaprJGs2-RGUgLVPSFtyfBAiAB8R07-EaeQApnZ7w/exec"
    const formData = new FormData();
    // current time in hh:mm:ss
    const time = new Date().toLocaleTimeString();
    [{k: "Last_Name", v: lastName.value.trim()}, {k: "First_Name", v: firstName.value.trim()}, {k:"Event", v:event.value.trim()}, {k:"Current_Time", v:time}].forEach(value => formData.append(value.k, value.v))
    try {
        const {result} = await fetch(url, {
            method: "POST",
            body: formData,
        })
            .then(res => res.json())
        firstNamePlaceholder.textContent = firstName.value.trim()
        lastNamePlaceholder.textContent = lastName.value.trim()
        eventNamePlaceholder.textContent = lastName.value.trim()
        resetInputValues (firstName, lastName)
        saveToLocalStorage(result)
    } catch (err: any){
        console.log(err["message"])
    }
}

function addAnimateCssClass(){
    addCompletedToCheckedIn()
    addCompletedToInnerContainer()
}

function addCompletedToCheckedIn() {
    const checkInDiv = document.querySelector(".checked_in") as HTMLDivElement
    addClassToDiv(checkInDiv, "completed")
}

function addClassToDiv(div: HTMLDivElement, cls: string) {
    if (!div) return
    div?.classList.add(cls)
}

function addCompletedToInnerContainer() {
    const completedInnerContainer = document.querySelector(".inner-container") as HTMLDivElement
    addClassToDiv(completedInnerContainer, "completed")
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
    addAnimateCssClass()
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