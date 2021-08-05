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
let buyFlag = true;

let computers = [];
let computerPrice = 0;
let defaultComputer = [];
let computerSpecsList = [];

/* Fetches every computer from the API by the URL. 
gets the data and sends it the the addComputersToStore to handle the data recevied.
*/
fetch("https://noroff-komputer-store-api.herokuapp.com/computers")
    .then(response => response.json())
    .then(data => computers = data)
    .then(computers => addComputersToStore(computers))

/*Function that sends every computer one by one through to
* a new function.
*/
const addComputersToStore = (computers) => {
    computers.forEach(x => addComputerToStore(x));
}

/* Takes in a computer from addComputersToStore and adds every one to
* a select object in the index.html
*/
const addComputerToStore = (computer) => {
    const computerElement = document.createElement("option");
    computerElement.value = computer.id;
    computerElement.appendChild(document.createTextNode(computer.title));
    computersElement.appendChild(computerElement);
    createSpecsList(computer.specs); // loads in the first computers specs as default when starting the page.
    loadInComputer(computers);

}

//function that displays the first computer as default when loading the page
const loadInComputer = (computers) => {
    const selectedComputer = computers[0];
    createSpecsList(selectedComputer.specs);
    computerCostElement.innerText = selectedComputer.price + " Kr";
    computerPrice = selectedComputer.price;
    computerTitleElement.innerText = selectedComputer.title;
    computerDescription.innerText = selectedComputer.description;
    computerImage.src = "https://noroff-komputer-store-api.herokuapp.com/" + selectedComputer.image;
}

//sends the specs array for each computer to a function that adds it to the page.
const createSpecsList = (specs) => {
    computerSpecsListElement.innerText = "";
    specs.forEach(x => addSpecsToList(x))
}

// function that adds the computer specs when loading the page.
const addSpecsToList = (spec) => {
    const computerSpec = document.createElement("li");
    computerSpec.className = "specFontSize";
    computerSpec.appendChild(document.createTextNode(spec));
    computerSpecsListElement.appendChild(computerSpec);
}

// changes the computer specs to the selected computer.
const handleComputerStoreChange = e => {
    const selectedComputer = computers[e.target.selectedIndex]
    createSpecsList(selectedComputer.specs);

}

// changes the computer price to the selected computer.
const displayComputerPrice = e => {
    const selectedComputer = computers[e.target.selectedIndex]
    computerCostElement.innerText = selectedComputer.price + " Kr";
    computerPrice = selectedComputer.price;
}

// changes the computer title to the selected computer.
const showComputerTitle = e => {
    const selectedComputer = computers[e.target.selectedIndex]
    computerTitleElement.innerText = selectedComputer.title;
}

// changes the computer description to the selected computer.
const showComputerDescription = e => {
    const selectedComputer = computers[e.target.selectedIndex]
    computerDescription.innerText = selectedComputer.description;
}

// changes the computer image to the selected computer.
const showComputerImage = e => {
    const selectedComputer = computers[e.target.selectedIndex]
    computerImage.src = "https://noroff-komputer-store-api.herokuapp.com/" + selectedComputer.image;
}

//When work. The pay value increases woth 100.
const work = () => {
    updatePay(pay + 100);
}

/*
if some work has been done and if no loan is taken, the balance updates (balance+pay).
if a loan is taken 10% of pay is take to pay off the loan. if the loan is payed off
the loanTitle, loan element and repay-button is changed to hidden.
*/
const bank = () => {
    if (pay > 0) { // if no work is done. It skips updating balance.
        if (remainingLoan > 0) {
            if (remainingLoan <= (pay * 0.1)) {
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
            repayButtonDisplayElement.className = "hide";
        }
    }
}

/*
If a loan is taken the input is shown and the loan an buy flag is set to false.
This so that a user cant take a new loan if the loan isnt payed off and if a computer 
isnt bought. 
*/
const loan = () => {
    if (loanFlag === true && buyFlag === true) {
        loanInputElement.className = "show";
        loanFlag = false;
        buyFlag = false;
    }
    else if (buyFlag === false && loanFlag === true) {
        alert("You need to buy a computer before taking a new loan");
    }
    else {
        alert("You cant loan more than one time");
    }
}

/*
If the enter key is pressed when giving a loan-value it checks if the input-box
are empty and if the value is more then double the balance. If it is some alerts are sent.
Otherwise the loan are set to the value.
*/
const getALoan = (event) => {
    if (event.key === 'Enter') {
        if (loanInputElement.value.trim().length != "") {
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
                alert("You cant loan more than double of balance.");
            }
        }
        else {
            alert("You cant leave the input empty");
        }
    }
    else { }
}

/*
This function repays a loan if a loan exists. If the pay is higher than the remaining loan 
difference are added to the balance. If the loan are fully repayed the loan title, loan value 
and repay button are changed to be hidden.
*/
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

/*
If balance are higher than the computer price the computer is bought and 
the balance are updated. Otherwise an alert are shown telling the computer 
are to expensive.
*/
const buyComputer = () => {
    if (balance >= computerPrice) {
        updateBalance(balance - computerPrice);
        buyFlag = true;
        alert("Successfully bought a computer");
    }
    else {
        alert("The computer is to expensive");
    }
}

const onErrorImg = () => {
    computerImage.src = "https://st4.depositphotos.com/14953852/24787/v/600/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg";
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