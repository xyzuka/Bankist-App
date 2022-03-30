'use strict';

/////////////////////////////////////////////////
// ELEMENTS
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// DATA
const account1 = {
  owner: 'Brandon Yee',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// FUNCTIONS

// Updates DOM for movements of deposits and withdrawals
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const day = `${date.getDate()}`.padStart(2, '0');
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const year = date.getFullYear();
    const displayDate = `${day}/${month}/${year}`;

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${mov.toFixed(2)}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

/* Notes from updating the DOM movement container:
    1. Template literals are useful for inserting raw html
    2. .insertAdjacentHTML() is used to insert the raw html created into the selected DOM element
    3. innerHTML returns all of the html items
    4. textContent returns only the text content
    5. Added .toFixed() to the mov to limit figures to two decimal laces
    6. Refactor the arguments to pass in the entire account so the dates can also be referenced
    7. Use the current index in the forEach loop to loop through the movementDates
*/

// Calculating user balance and updating the DOM
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `$${acc.balance.toFixed(2)}`;
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
  labelSumIn.textContent = `$${incomes.toFixed(2)}`;

  const withdrawals = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `$${Math.abs(withdrawals.toFixed(2))}`;

  // Interest is paid on each deposit of 1.2%
  // Only interest payments equal to or above $1 are included
  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((interest, index, array) => interest >= 1)
    .reduce((acc, interest) => acc + interest, 0);
  labelSumInterest.textContent = `$${interest.toFixed(2)}`;
};

// Computing usernames for each user stored in data
// Usernames will be their initials in lower case

const createUserNames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map((name) => name[0])
      .join('');
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

// Update UI functionality
const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

// Login functionality

let currentAccount;

//////////////////////////////////////////
//////////////////////////////////////////
//* FAKE LOGIN
currentAccount = account1;
updateUI(currentAccount);
labelWelcome.textContent = `Welcome back, ${
  currentAccount.owner.split(' ')[0]
}`;
containerApp.style.opacity = 100;
//////////////////////////////////////////
//////////////////////////////////////////

// EVENT HANDLERS
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    console.log('LOGIN');
  }

  // Display UI and welcome message
  labelWelcome.textContent = `Welcome back, ${
    currentAccount.owner.split(' ')[0]
  }`;

  containerApp.style.opacity = 100;

  // Welcome screen date
  // day/month/year format
  const now = new Date();

  const day = `${now.getDate()}`.padStart(2, '0');
  const month = `${now.getMonth() + 1}`.padStart(2, '0');
  const year = now.getFullYear();
  const hour = now.getHours();
  const minute = now.getMinutes();

  labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minute}`;

  // Empty login fields and un-focusing login
  inputLoginUsername.value = inputLoginPin.value = '';
  inputLoginUsername.blur();
  inputLoginPin.blur();

  updateUI(currentAccount);
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

// Transfer functionality
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  const amount = Number(inputTransferAmount.value);
  console.log(amount, receiverAcc);

  // Empties input fields
  inputTransferTo.value = inputTransferAmount.value = '';
  inputTransferTo.blur();
  inputTransferAmount.blur();

  // Checking if user has enough money to transfer
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Transferring
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Updating UI
    updateUI(currentAccount);
  }
});

/* Notes from adding transfer functionality
    1. Add an event listener to the transfer button and prevent the page from refreshing
    2. Assign the transfer amount to a variable
    3. Use the .find method to look for the specific username the amount was transferred o and stored it in a variable
    4. .blur() the amounts
    5. Check if the transfer is positive, and check if the user has enough money to transfer
        - We need to update the calcDisplayBalance function to store the balance of the account based off the movement since it was previously hardcoded
        - We need to check if the receiver account exists
        - We need make sure the user cannot transfer to himself
        - Check if the receiver account exists with optional chaining (?)
    6. Push a negative amount of the transfer from the currentAccount; Push a positive amount of the transfer to the receiver
    7. Refactoring the UI display functions into one function
    8. Refactoring transfer function to include date of transfer for the receiver and user
*/

// THE .findIndex() METHOD
// Returns the index of the returned element and not the element itself

// Practical Example: Close account functionality
// Closing an account will delete the user's account and from accounts array and the .findIndex() method will help us target the specific account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );

    // Delete user account from the accounts array
    accounts.splice(index, 1);

    // Log user out by hiding UI
    containerApp.style.opacity = 0;

    // Clearing fields
    inputCloseUsername.value = inputClosePin.value = '';
  }
});

/* Notes from closing user account
  1. Add an event listener to the close account button
  2. Check if the username value and password is the same as the current account details
  3. Use the .findIndex() method to loop through the array to find the matching account username and then splice that specific index from the accounts array
  4. Clear input fields for closing the account
*/

// Loan functionality
// Loan is only granted if there is at least one deposit with at least 10% of the requested loan amount
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const emptyLoanFields = function () {
    inputLoanAmount.value = '';
    inputLoanAmount.blur();
  };

  const amount = Math.floor(inputLoanAmount.value);

  const highestDeposit = currentAccount.movements.reduce((acc, mov) => {
    if (acc > mov) return acc;
    else return mov;
  }, currentAccount.movements[0]);

  const minimumLoan = amount * 0.1;

  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    // Add the loan to the balance
    currentAccount.movements.push(amount);

    // Add loan date
    currentAccount.movementsDates.push(new Date().toISOString());

    // Update the UI
    updateUI(currentAccount);

    // Empty fields
    emptyLoanFields();
  } else {
    alert(
      `Error: You can only request a loan if there is one deposit with at least 10% of the requested loan amount.\nLoan Requested: ${amount}\nDeposit required for your loan request: ${minimumLoan}\nYour highest deposit is: ${highestDeposit}`
    );
    emptyLoanFields();
  }
});

/* Notes from loan functionality
    1. Add an event listener to the loan button
    2. Assign the input value of the loan amount to a variable
    3. Add the loan condition with an if statement - the .some() method is then used to specify this condition to loop through the movements array
    4. Added rounding so the user cannot receive decimal amounts - loan amounts are rounded down to nearest dollar
    5. Using the .toFixed() method to limit displayed numbers to two decimal places
    6. Refactored code to include date the loan was requested
*/

// Sorting functionality

let sorted = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/* Notes from Sorting
    1. Add a sort parameter in the displayMovements function and set the default value to false (to prevent sorting by default)
    2. Create a new variable inside the displayMovements function, add a conditional to determine if sort is set to true
    3. To prevent array mutation, we use .slice() first to obtain a copy of the array before using .sort()
    4. Refactor/Update the new variable into the displayMovements function
    5. Create a button/eventListener to change sort to true when clicked - to change to descending order
    6. Also allow users to click sort again to change back the movements to normal
      - Add a state variable to keep track we if are sorting the variable or not
      - Inverse the state variable when the sort button is clicked
*/
