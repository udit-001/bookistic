/* IndexJs in called in Login.js */

function indexJs() {
    /* Calling Toggle, Login Function and Sign Up Function */
    toggleBtnFunction();

}

/* Called this function in Details.html */
function reviewJs() {
    let searchform = document.getElementById('search-form');
    searchform.addEventListener('submit', (e) => {
        e.preventDefault();
    })
}

function pencilHover() {
    let pencil = document.getElementById('pencil');
    let email = document.getElementById('email');
    window.addEventListener('mouseover', (e) => {
        // console.log(e.target.id)
        if (e.target.id === "email") {
            pencil.style.visibility = 'visible'
        } else {
            pencil.style.visibility = 'hidden'
        }

    })
}

// Making Sure Service worker are supported 
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('../sw.js')
            .then(reg => console.log('Service worker: Registered'))
            .catch(err => console.log(`Service Worker: Error ${err}`))
    })
}