"use strict";

/////////////////////////////////////////////////
// ELEMENTS
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/////////////////////////////////////////////////
// DATA
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

/////////////////////////////////////////////////
// FUNCTIONS

// Updates DOM for movements of deposits and withdrawals
const displayMovements = function (movements) {
  containerMovements.innerHTML = "";

  movements.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">${mov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};
displayMovements(account1.movements);

/* Notes from updating the DOM movement container:
    1. Template literals are useful for inserting raw html 
    2. .insertAdjacentHTML() is used to insert the raw html created into the selected DOM element
    3. innerHTML returns all of the html items
    4. textContent returns only the text content 
*/

// Calculating user balance and updating the DOM
const calcDisplayBalance = function (movements) {
  const balance = movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `$${balance}`;
};
calcDisplayBalance(account1.movements);

/* Notes from updating the DOM balance
    1. A function was created taking in the user account's movements as a parameter
    2. This movement is then passed as an array with the reduce method to calculate the total end sum of the balance
    3. The DOM element which display's the user's balance is then updated based off the total end sum 
*/

// Computing usernames for each user stored in data
// Usernames will be their initials in lower case

const createUserNames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
createUserNames(accounts);
console.log(accounts);

/* Notes from computing usernames
    1. A function was created to create a new property in the accounts object to create the account's username based off their initials 
    2. The initials were created by referencing the account owner's name and chaining four methods 
    - .toLowerCase() : to convert the owner's name to lowercase
    - .split(' ') : to split the owner's name into an array of substrings
    - .map((name) => name[0]) : to obtain the first letter of the owner's name
    - .join() : to join the first letters together to create the initials as a single string
*/
