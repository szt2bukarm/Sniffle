// loader


export const showLoader = function() {
    const loader = document.querySelector('.loader-wrapper')
    console.log(loader);
    loader.classList.add('loader-show')
}

export const hideLoader = function() {
    const loader = document.querySelector('.loader-wrapper')
    loader.classList.remove('loader-show')
}