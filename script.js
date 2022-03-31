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
    '2021-05-08T14:11:59.604Z',
    '2022-03-25T17:01:17.194Z',
    '2022-03-28T23:36:17.929Z',
    '2022-03-30T10:51:36.790Z',
  ],
  currency: 'USD',
  locale: 'en-US',
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
    '2021-01-25T14:18:46.235Z',
    '2021-02-05T16:33:06.386Z',
    '2022-02-10T14:43:26.374Z',
    '2022-03-25T18:49:59.371Z',
    '2022-03-26T12:01:20.894Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// FUNCTIONS

// Format movement date function
const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);
  // 1000 mil in a sec => 60sec in a min =>  60min in a hr => 24hrs in a day

  const daysPassed = Math.round(calcDaysPassed(new Date(), date));

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  return new Intl.DateTimeFormat(locale).format(date);
};

// Formats Currencies
const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

// Updates DOM for movements of deposits and withdrawals
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
      \
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Calculating user balance and updating the DOM
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

// Calculating total deposits, withdraws, interest and updating the DOM
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const withdrawals = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(withdrawals, acc.locale, acc.currency);

  // Interest is paid on each deposit of 1.2%
  // Only interest payments equal to or above $1 are included
  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((interest, index, array) => interest >= 1)
    .reduce((acc, interest) => acc + interest, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
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

// Update UI functionality
const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

// Log out timer
const startLogOutTimer = function () {
  const tick = function () {
    let min = String(Math.trunc(time / 60)).padStart(2, '0');
    let sec = String(time % 60).padStart(2, '0');

    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Login in to get started';
      containerApp.style.opacity = 0;
    }

    time--;
  };

  let time = 120;

  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};

let currentAccount, timer;

// Login functionality
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
  // EXPERIMENT WITH API
  const now = new Date();
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  };
  const locale = currentAccount.locale;

  labelDate.textContent = new Intl.DateTimeFormat(locale, options).format(now);

  // Empty login fields and un-focusing login
  inputLoginUsername.value = inputLoginPin.value = '';
  inputLoginUsername.blur();
  inputLoginPin.blur();

  // Logout timer
  if (timer) clearInterval(timer);
  timer = startLogOutTimer();

  updateUI(currentAccount);
});

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

    // Reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

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
    setTimeout(function () {
      // Add the loan to the balance
      currentAccount.movements.push(amount);

      // Add loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update the UI
      updateUI(currentAccount);

      // Reset timer
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 2500);

    // Empty fields
    emptyLoanFields();
  } else {
    alert(
      `Error: You can only request a loan if there is one deposit with at least 10% of the requested loan amount.\nLoan Requested: ${amount}\nDeposit required for your loan request: ${minimumLoan}\nYour highest deposit is: ${highestDeposit}`
    );
    emptyLoanFields();
  }
});

// Sorting functionality

let sorted = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

// IGNORE - NOTES:
/* Notes from updating the DOM movement container:
    1. Template literals are useful for inserting raw html
    2. .insertAdjacentHTML() is used to insert the raw html created into the selected DOM element
    3. innerHTML returns all of the html items
    4. textContent returns only the text content
    5. Added .toFixed() to the mov to limit figures to two decimal laces
    6. Refactor the arguments to pass in the entire account so the dates can also be referenced
    7. Use the current index in the forEach loop to loop through the movementDates
*/

/* Notes from computing usernames
    1. A function was created to create a new property in the accounts object to create the account's username based off their initials
    2. The initials were created by referencing the account owner's name and chaining four methods
    - .toLowerCase() : to convert the owner's name to lowercase
    - .split(' ') : to split the owner's name into an array of substrings
    - .map((name) => name[0]) : to obtain the first letter of the owner's name
    - .join() : to join the first letters together to create the initials as a single string
*/

/* Notes from updating the DOM balance
    1. A function was created taking in the user account's movements as a parameter
    2. This movement is then passed as an array with the reduce method to calculate the total end sum of the balance
    3. The DOM element which display's the user's balance is then updated based off the total end sum
*/

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

/* Notes from closing user account
  1. Add an event listener to the close account button
  2. Check if the username value and password is the same as the current account details
  3. Use the .findIndex() method to loop through the array to find the matching account username and then splice that specific index from the accounts array
  4. Clear input fields for closing the account
*/

/* Notes from loan functionality
    1. Add an event listener to the loan button
    2. Assign the input value of the loan amount to a variable
    3. Add the loan condition with an if statement - the .some() method is then used to specify this condition to loop through the movements array
    4. Added rounding so the user cannot receive decimal amounts - loan amounts are rounded down to nearest dollar
    5. Using the .toFixed() method to limit displayed numbers to two decimal places
    6. Refactored code to include date the loan was requested
*/

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

/* Notes from Internationalizing Dates with the Intl API 
    1. new Intl.DateTimeFormat('en-AU', options).format(now);
        - .DateTimeFormat accepts two arguments - a location tag to format the time, an object to "style" the formatting, followed by the format method taking in the time
    2. It is better to get the locale from the user's browser rather than manually defining it (use navigator.language)
    3. Refactoring the code to consider the user's locale
    4. Formatting the dates in the movements based off the user's locale
*/

/* Notes from Internationalizing Numbers
    1. Similar to dates, it will take in a locale string and format the number based on the country's locale
    2. We can pass in an object following the locale, which will define the units and style of the number
    3. For the bankist app, we passed in the Intl API for numbers to format the number based off the user's currency (formatting the movement and balance amounts)
*/

/* Notes from using a timer to simulate the approval of a loan:
    1. Refactoring the code inside the loan event listener into a function to be use with setTimeout()
    
  Notes from setInterval - to create an updating clock to log user out after 5 minutes of inactivity
    1. Timer will start once the user logs in, so run a function which will count down once the user logs in
    2. Time starts at 5 minutes
    3. Call the timer every second to decrease 1s and print the remaining time to the UI
    5. When time reaches 0, stop the timer and log the user out by hiding the UI 
    6. Update the login function to check if there is a timer running already, if there is then the clearInterval() function will run to reset the timer
    7. Also updated the function to keep track of each activity of the user - resets the timer when the user does an action (transfer and loans)
*/
