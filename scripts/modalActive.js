const modal = document.querySelector('.modal-overlay')

const buttonNew = document.querySelector('.button.new')
const buttonCancel = document.querySelector('.button.cancel')
const buttonAdd = document.querySelector('.button.add')

const Modal = {
    open() {
        modal.classList.add('active')
    },

    exit() {
        modal.classList.remove('active')
    },

    both() {
        modal.classList.toggle('active')
    }
}

buttonNew.addEventListener("click", () => {
    Modal.open()
})

buttonCancel.addEventListener(
    "click",
    () => {
    Modal.exit()})

buttonAdd.addEventListener("click", () => {
    Modal.exit()
})