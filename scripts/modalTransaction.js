const tbody = document.querySelector('tbody')

const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("devfinaces:transactions")) || []
    },
    set(transactions) {
        localStorage.setItem("devfinaces:transactions",
            JSON.stringify(transactions))
    },
    remove(id) {
        let newTransactions = Transaction.all.filter(function (transaction) {return transaction.id !== id })
        Storage.set(newTransactions)
        return newTransactions
        load()
        
    }
}

const Transaction = {
    all: Storage.get(),

    add(transaction) {
        Transaction.all.push(transaction)

    },
    remove(index) {
        let c = 0
        let Newtransactions = Transaction.all
        Transaction.all.forEach( trans => {
            if(trans.id == index) {
                Newtransactions = Transaction.all.splice(c, 1)

            }else {
                c++
            }
        })
        tbody.innerHTML = ""
        load()
    },

    income() {
        let income = 0

        Transaction.all.forEach((transaction) => {
            if (transaction.amount >= 0) {
                income += Number(transaction.amount)

            }
        });

        return income
    },
    expense() {
        let expense = 0

        Transaction.all.forEach((transaction) => {
            if (transaction.amount < 0) {
                expense += Number(transaction.amount)

            }
        });

        return expense
    },
    total() {
        const total = Transaction.income() + Transaction.expense()

        return total
    }
}

const DOM = {
    addTransaction(descrip, amoun, dat, id) {
        const tr = document.createElement("tr")

        tr.innerHTML = DOM.innerHTMLTransaction(descrip, amoun, dat, id)

        tbody.appendChild(tr)
    },
    innerHTMLTransaction(descrip, amoun, dat, id) {
        const cssClass = amoun > 0 ? "income" : "expense"

        const table = `
            <td class="descriptions">${descrip}</td>
            <td class="${cssClass}">${amoun}</td>
            <td class="date">${dat}</td>
            <td><a id="btnEdit"  class="id${id}" onclick = "editTransaction(${id})">Edit</a></td>
            <td><img src="img/minus.svg" alt="Remover transação" id="imgRemove" class="id${id}" onclick="removeTransaction(${id})"></td>`

        return table
    },
    updateBalance() {
        const incomeDisplay = document.querySelector('#income')
        const expenseDisplay = document.querySelector('#expense')
        const totalDisplay = document.querySelector('#total')

        incomeDisplay.innerHTML = utils.formatCurrency(Transaction.income())
        expenseDisplay.innerHTML = utils.formatCurrency(Transaction.expense())
        totalDisplay.innerHTML = utils.formatCurrency(Transaction.total())
    }
}

const utils = {
    formatAmount(value) {
        value = Number(value) * 100
    },
    formatValues(description, amount, date) {
        amount = utils.formatAmount(amount)
    },
    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""

        value = String(value).replace(/\D/g, "") 

        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })
        return signal + value
    },
    verificationNumber(amount) {
        let valueSplit = String(amount).split("")
        let i
        let amountFormat
        const signal = Number(amount) < 0 ? "-" : ""

        if (valueSplit.length == 6 && valueSplit[0] == 1 && valueSplit[1] == valueSplit[2] && valueSplit[1] == valueSplit[4] && valueSplit[4] == valueSplit[5]) {
            amountFormat = `${signal}R$ ${valueSplit[0] + valueSplit[1] + valueSplit[2]},${valueSplit[4] + valueSplit[5]}`

            return amountFormat

        } else if (valueSplit.length == 7 && valueSplit[1] == 1 && valueSplit[2] == valueSplit[3] && valueSplit[2] == valueSplit[5] && valueSplit[5] == valueSplit[6]) {
            amountFormat = `${signal}R$ ${valueSplit[1] + valueSplit[2] + valueSplit[3]},${valueSplit[5] + valueSplit[6]}`

            return amountFormat

        } else {
            amountFormat = utils.formatCurrency(amount * 100)

            return amountFormat

        }

    }
}

function editTransaction(tag) {
    exibModal()
    const modalEdit = document.querySelector('.modal-overlayEdit')
    modalEdit.classList.toggle('active')

    Transaction.all.forEach(trans => {
        if (tag == trans.id) {
            const buttonEdit= document.querySelector('.button.edit')
            let descriptionEdit= document.querySelector('#descriptionEdit').value
            let amountEdit= document.querySelector('#valueEdit').value
            let timeEdit= document.querySelector('#dateEdit').value

            document.querySelector('#descriptionEdit').value = trans.description
            document.querySelector('#valueEdit').value = Number(trans.amount) / 100

            buttonEdit.addEventListener("click", () => {
                if (document.querySelector('#descriptionEdit').value == "" || document.querySelector('#valueEdit').value == "") {
                    alert("Por favor, preencha todos os campos")

                } else if (document.querySelector('#descriptionEdit').value != "" && document.querySelector('#valueEdit').value != "") {
                    
                    trans.description = document.querySelector('#descriptionEdit').value
                    trans.amount = document.querySelector('#valueEdit').value *100
                    trans.date = document.querySelector('#dateEdit').value
                    Storage.set(Transaction.all)

                    DOM.updateBalance() 
                    descriptionEdit = ""
                    amountEdit = ""
                    timeEdit = ""
                    
                }
            })
        }
    })
}

function exibModal() {
    const modalEdit = document.querySelector('.modal-overlayEdit')

    const btnEdit = document.querySelector('#btnEdit')
    const buttonCancelE = document.querySelector('.button.cancelE')
    const buttonEdit = document.querySelector('.button.edit')

    const ModalEdit = {
        open() {
            modalEdit.classList.add('active')
        },

        exit() {
            modalEdit.classList.remove('active')
        },

        both() {
            modalEdit.classList.toggle('active')
        }
    }

    btnEdit.addEventListener("click", () => {
        ModalEdit.open()
    })

    buttonCancelE.addEventListener(
        "click",
        () => {
            ModalEdit.exit()
        })

    buttonEdit.addEventListener("click", () => {
        ModalEdit.exit()
    })
}

function removeTransaction(id) {
    Storage.remove(id)
    let idTrasaction = verificationId(id)
    Transaction.remove(idTrasaction)
    window.location.reload()
    
}

function verificationId(idAna) {
    let c = 0
    Transaction.all.forEach(transaction => {
        if (transaction.id == idAna) {
            idRemove = c
            return idRemove
        } else {
            c++
        }
    })
}

function load() {
    Transaction.all.forEach((transaction) => {
        DOM.addTransaction(transaction.description, utils.formatCurrency(transaction.amount, 100), transaction.date, transaction.id)
        DOM.updateBalance()
    })
    DOM.updateBalance()
}

function generatorId(i) {
    let ids = []
    Transaction.all.forEach(transaction => {
        ids.push(transaction.id)
    })
    if (ids.indexOf(i) == -1) {
        newId = i
    } else {
        generatorId(i + 1)
    }
    return newId
}

const buttonAdd2 = document.querySelector('.button.add')
buttonAdd2.addEventListener("click", () => {
    let description = document.querySelector('#description').value
    let amount = document.querySelector('#value').value
    let time = document.querySelector('#date').value.replace(/-/g, "/")

    if (description == "" || date == "" || amount == "") {
        alert("Por favor, preencha todos os campos")

    } else {
        const amountFormat = utils.verificationNumber(Math.round(amount))

        let idGenerated = generatorId(0)
        Transaction.add({
            id: idGenerated,
            description: description,
            amount: Math.round(amount) * 100,
            date: time
        })

        DOM.addTransaction(description, amountFormat, time, idGenerated)
        DOM.updateBalance()
        document.querySelector('#description').value = ""
        document.querySelector('#value').value = ""
        document.querySelector('#date').value = ""

    }
    Storage.set(Transaction.all)
})
