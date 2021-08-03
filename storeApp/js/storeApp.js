const balanceElement = document.getElementById("balance");
//const loanTitleElement = document.getElementById("loanTitle");
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

let pay = 0;
let balance = 0;
let remainingLoan = 0;
let loanFlag = true;

const work = () => {
    pay = pay + 100;
    payElement.innerHTML = pay;
}

const bank = () => {
    if(remainingLoan > 0) {
        if(remainingLoan < (pay*0.1)) { 
            payElement.innerHTML = pay-remainingLoan;
            pay -= remainingLoan;
            remainingLoan -= remainingLoan;
            loanElement.innerHTML = remainingLoan;
        }
        else{
            payElement.innerHTML = pay*0.9;
            remainingLoan -= (pay*0.1);
            balance += (pay*0.9);
            pay=0;
            loanElement.innerHTML = remainingLoan;
        }
    }
    else {
        payElement.innerHTML = 0;
        balance += pay;
        pay=0;
        balanceElement.innerHTML = balance;
        loanFlag = true;
    }
}

const loan = () => {
    if(loanFlag === true) {
        loanInputElement.className="show";
        loanFlag = false;
    }
    else {
        alert("You cant loan more than one time");
    }
}

const getALoan = (event) => {
        if(event.key === 'Enter') {
            let textInput = parseInt(loanInputElement.value);
            if(textInput <= (balance*2)){
                remainingLoan = textInput;
                loanElement.innerHTML = remainingLoan;
                balance += textInput;
                balanceElement.innerHTML = balance;
                loanInputElement.className="hide";
                repayButtonDisplayElement.className="show";
            }
            else{
                alert("You cant loan more than double of balance.")
            }
        
        }
        else{}
    }

const repayLoan = () => {
    if(remainingLoan > 0) {
        if(pay > remainingLoan) {
            pay -= remainingLoan;
            remainingLoan = 0;
            payElement.innerHTML = pay;
            loanElement.innerHTML = remainingLoan;
        }
        else {

            remainingLoan -= pay;
            pay = 0;
            payElement.innerHTML = pay;
            loanElement.innerHTML = remainingLoan;
        }
    }
    else {
        repayButtonDisplayElement.className="hide";
    }
}

let computers= [];
let computerPrice = 0;


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
}

const handleComputerStoreChange = e => {
    const selectedComputer = computers[e.target.selectedIndex]
    computerSpecsElement.innerText = selectedComputer.specs;
}

const displayComputerPrice = e => {
    const selectedComputer = computers[e.target.selectedIndex]
    computerCostElement.innerText = selectedComputer.price;
    computerPrice = selectedComputer.price;
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
    if(balance >= computerPrice) {
        balance -= computerPrice;
        balanceElement.innerHTML = balance;
        alert("Successfully bought a computer");
    }
    else{
        alert("The computer is to expensive");
    }
}



workButtonElement.addEventListener("click", work);
bankButtonElement.addEventListener("click",bank);
loanButtonElement.addEventListener("click",loan);
loanInputElement.addEventListener("keypress",getALoan);
repayButtonElement.addEventListener("click",repayLoan);
computersElement.addEventListener("change",handleComputerStoreChange);
computersElement.addEventListener("change", displayComputerPrice);
computersElement.addEventListener("change", showComputerDescription);
computersElement.addEventListener("change", showComputerImage);
buyButtonElement.addEventListener("click",buyComputer);
