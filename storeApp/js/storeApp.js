const balanceElement = document.getElementById("balance");
const loanTitleElement = document.getElementById("loanTitle");
const loanInputElement = document.getElementById("loanInput");
const loanElement = document.getElementById("loan");
const loanButtonElement = document.getElementById("getALoan");
const payElement = document.getElementById("pay");
const workButtonElement = document.getElementById("work");
const bankButtonElement = document.getElementById("bank");
const repayButtonDisplayElement = document.getElementById("repayButtonDisplay");
const repayButtonElement = document.getElementById("repay");
const computersElement = document.getElementById("computers");
const computerSpecsElement = document.getElementById("computerSpecs");
const computerCostElement = document.getElementById("computerCost");
const buyButtonElement = document.getElementById("buyButton");
const computerDescription = document.getElementById("computerDescription");
const computerImage = document.getElementById("computerImage");
const computerTitleElement = document.getElementById("computerTitle");
const computerSpecsListElement = document.getElementById("computerSpecsList");

let pay = 0;
let balance = 0;
let remainingLoan = 0;
let loanFlag = true;

const work = () => {
    updatePay(pay + 100);
}

const bank = () => {
    if (pay > 0) {
        if (remainingLoan > 0) {
            if (remainingLoan < (pay * 0.1)) {
                updatePay(pay - remainingLoan);
                updateOutstandingLoan(remainingLoan - remainingLoan);
            }
            else {
                updatePay(pay * 0.9)
                updateOutstandingLoan((pay * 0.1));
                balance += (pay * 0.9);
                pay = 0;
            }
        }
        else {
            updateBalance(balance + pay);
            updatePay(0);
            loanFlag = true;
            loanTitleElement.className = "leftSide hide";
            loanElement.className = "rightSide hide";
        }
    }
}

const loan = () => {
    if (loanFlag === true) {
        loanInputElement.className = "show";
        loanFlag = false;
    }
    else {
        alert("You cant loan more than one time");
    }
}

const getALoan = (event) => {
    if (event.key === 'Enter') {
        let loanInput = parseInt(loanInputElement.value);
        if (loanInput <= (balance * 2)) {
            updateOutstandingLoan(loanInput);
            loanTitleElement.className = "leftSide show";
            loanElement.className = "rightSide show";
            updateBalance(balance += loanInput);
            loanInputElement.className = "hide";
            repayButtonDisplayElement.className = "show";
        }
        else {
            alert("You cant loan more than double of balance.")
        }

    }
    else { }
}

const repayLoan = () => {
    if (pay > 0) {
        if (remainingLoan > 0) {
            if (pay > remainingLoan) {
                updatePay(pay - remainingLoan);
                updateOutstandingLoan(0);
            }
            else {
                updateOutstandingLoan(remainingLoan - pay);
                updatePay(0);
            }
        }
        loanTitleElement.className = "leftSide hide";
        loanElement.className = "rightSide hide";
        repayButtonDisplayElement.className = "hide";
    }
}

const updateBalance = (num) => {
    balanceElement.innerHTML = num;
    balance = num;
}

const updateOutstandingLoan = (num) => {
    loanElement.innerHTML = num;
    remainingLoan = num;
}

const updatePay = (num) => {
    payElement.innerHTML = num;
    pay = num;
}


let computers = [];
let computerPrice = 0;
let defaultComputer = [];
let computerSpecsList = [];


fetch("https://noroff-komputer-store-api.herokuapp.com/computers")
    .then(response => response.json())
    .then(data => computers = data)
    .then(computers => addComputersToStore(computers))

const addComputersToStore = (computers) => {
    computers.forEach(x => addComputerToStore(x));
}

const addComputerToStore = (computer) => {
    const computerElement = document.createElement("option");
    computerElement.value = computer.id;
    computerElement.appendChild(document.createTextNode(computer.title));
    computersElement.appendChild(computerElement);
    createSpecsList(computer.specs);
    loadInComputer(computers);

}

const loadInComputer = (computers) => {
    const selectedComputer = computers[0];
    createSpecsList(selectedComputer.specs);
    computerCostElement.innerText = selectedComputer.price + " Kr";
    computerPrice = selectedComputer.price;
    computerTitleElement.innerText = selectedComputer.title;
    computerDescription.innerText = selectedComputer.description;
    computerImage.src = "https://noroff-komputer-store-api.herokuapp.com/" + selectedComputer.image;
}

const createSpecsList = (specs) => {
    computerSpecsListElement.innerText = "";
    specs.forEach(x => addSpecsToList(x))
}

const addSpecsToList = (spec) => {
    const computerSpec = document.createElement("li");
    computerSpec.appendChild(document.createTextNode(spec));
    computerSpecsListElement.appendChild(computerSpec);
}


const handleComputerStoreChange = e => {
    const selectedComputer = computers[e.target.selectedIndex]
    createSpecsList(selectedComputer.specs);

}

const displayComputerPrice = e => {
    const selectedComputer = computers[e.target.selectedIndex]
    computerCostElement.innerText = selectedComputer.price + " Kr";
    computerPrice = selectedComputer.price;
}

const showComputerTitle = e => {
    const selectedComputer = computers[e.target.selectedIndex]
    computerTitleElement.innerText = selectedComputer.title;
}

const showComputerDescription = e => {
    const selectedComputer = computers[e.target.selectedIndex]
    computerDescription.innerText = selectedComputer.description;
}

const showComputerImage = e => {
    const selectedComputer = computers[e.target.selectedIndex]
    computerImage.src = "https://noroff-komputer-store-api.herokuapp.com/" + selectedComputer.image;
}

const buyComputer = () => {
    if (balance >= computerPrice) {
        updateBalance(balance - computerPrice);
        alert("Successfully bought a computer");
    }
    else {
        alert("The computer is to expensive");
    }
}



workButtonElement.addEventListener("click", work);
bankButtonElement.addEventListener("click", bank);
loanButtonElement.addEventListener("click", loan);
loanInputElement.addEventListener("keypress", getALoan);
repayButtonElement.addEventListener("click", repayLoan);
computersElement.addEventListener("change", handleComputerStoreChange);
computersElement.addEventListener("change", displayComputerPrice);
computersElement.addEventListener("change", showComputerDescription);
computersElement.addEventListener("change", showComputerImage);
computersElement.addEventListener("change", showComputerTitle);
buyButtonElement.addEventListener("click", buyComputer);