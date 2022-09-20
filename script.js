var isVisible = false;

function newBilling() {
    if (isVisible) {
        document.getElementsByClassName("newBillingContainer")[0].classList.add("invisible");
    } else {
        document.getElementsByClassName("newBillingContainer")[0].classList.remove("invisible");
    }
    isVisible = !isVisible
}

function setInvisible(event) {
    console.log(event)
}
