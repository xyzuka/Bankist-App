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
  owner: "Brandon Yee",
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

/* Notes from updating the DOM balance
    1. A function was created taking in the user account's movements as a parameter
    2. This movement is then passed as an array with the reduce method to calculate the total end sum of the balance
    3. The DOM element which display's the user's balance is then updated based off the total end sum
*/

// Calculating total deposits, withdraws, interest and updating the DOM
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `$${incomes}`;

  const withdrawals = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `$${Math.abs(withdrawals)}`;

  // Interest is paid on each deposit of 1.2%
  // Only interest payments equal to or above $1 are included
  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((interest, index, array) => interest >= 1)
    .reduce((acc, interest) => acc + interest, 0);
  labelSumInterest.textContent = `$${interest}`;
};

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

/* Notes from computing usernames
    1. A function was created to create a new property in the accounts object to create the account's username based off their initials
    2. The initials were created by referencing the account owner's name and chaining four methods
    - .toLowerCase() : to convert the owner's name to lowercase
    - .split(' ') : to split the owner's name into an array of substrings
    - .map((name) => name[0]) : to obtain the first letter of the owner's name
    - .join() : to join the first letters together to create the initials as a single string
*/

// Login functionality

let currentAccount;

// EVENT HANDLERS
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    console.log("LOGIN");
  }

  // Display UI and welcome message
  labelWelcome.textContent = `Welcome back, ${
    currentAccount.owner.split(" ")[0]
  }`;

  containerApp.style.opacity = 100;

  // Empty login fields and un-focusing login
  inputLoginUsername.value = inputLoginPin.value = "";
  inputLoginUsername.blur();
  inputLoginPin.blur();

  // Display movements
  displayMovements(currentAccount.movements);

  // Display balance
  calcDisplayBalance(currentAccount.movements);

  // Display summary
  calcDisplaySummary(currentAccount);
});

/* Notes from creating Login:
    1. Button in a form element - default behavior for a form when a form is submitted is to reload the page
      - To solve this, we need to prevent the form from reloading 
      - Give an event parameter in the function, and call the preventDefault method
      - preventDefault(); prevents a form to submit and reload the page
    2. Using the .find() method, we will match the user input to the accounts object's username 
    3. Define a current account to keep track of the account logged in
    4. Add a if statement to match the login pin (also convert the user input as a number since .value always returns a string)
    5. To see if an account exists when entering a pin, we use optional chaining (?) - will short-circuit with a return value of undefined if currentAccount is null or undefined
    6. Change the textContent of the login prompt with a welcome message referencing to the currentAccount logged in
    7. Setting the opacity of the dashboard back to 100
    8. Running the functions which displays the movements, balance, and summary based off the currentAccount
    9. Emptying the login field once the user has logged in
    10. Updating the interest function based off the current user logged in
*/
