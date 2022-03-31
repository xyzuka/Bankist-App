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
