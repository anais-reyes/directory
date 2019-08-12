function init() {
  dropdownClick();
  fetchUsers();
}

//Function to dropdown event
function dropdownClick() {
  let dropdown = document.querySelectorAll('.dropdown');
  Array.from(dropdown).forEach(element => {
    element.addEventListener('click', function(event) {
      event.stopPropagation();
      element.classList.toggle('is-active');
    });
  });
}

//Function to make request to fetch users
function fetchUsers() {
  fetch('https://randomuser.me/api/?results=20')
    .then(function(response) {
      return response.json();
    })
    .then(function(myJson) {
      sessionStorage.setItem('users', JSON.stringify(myJson.results));
      displayUsers(myJson.results);
      getGenders(myJson.results);
      console.log(myJson.results);
    });
}

//Function to get gender of users
function getGenders(users) {
  genderArray = users.map(element => element.gender);
  displayOptions(genderArray);
}

//Function that adds options to the dropdown
function displayOptions(genderArray) {
  clearElement('gender-dropdown');
  genderArray.push('All users');
  new Set(genderArray).forEach(element => {
    let newOption = `<a href="#" class="dropdown-item is-capitalized" onClick="selectGender(this)">
            ${element}
        </a>`;
    document.getElementById('gender-dropdown').innerHTML =
      document.getElementById('gender-dropdown').innerHTML + newOption;
  });
}

//Function that filters users by gender
function selectGender(e) {
  document.getElementById('filter-button').innerText = e.innerText;
  console.log(e.innerText);
  if (e.innerText === 'All Users') {
    displayUsers(JSON.parse(sessionStorage.getItem('users')));
  } else {
    let filteredUsers = JSON.parse(sessionStorage.getItem('users')).filter(
      element => element.gender.toLowerCase() === e.innerText.toLowerCase()
    );
    displayUsers(filteredUsers);
  }
}

//Function to add active-class to selected user
function selectUser(e) {
  let containers = document.querySelectorAll('.user-container');
  Array.from(containers).forEach(element => {
    element.classList.remove('active-user');
  });
  e.classList.add('active-user');
  findUser(e.dataset.email);
}

//Function to find the user after the click event
function findUser(email) {
  console.log(email);
  let selectedUser = JSON.parse(sessionStorage.getItem('users')).find(
    element => element.email === email
  );
  showSelectedUser(selectedUser);
}

//Function to show info of selected user
function showSelectedUser(user) {
  const picture = user.picture.large;
  document.getElementById('single-user').innerHTML = `
  <div id="blurred-picture"></div>
  <img src="${user.picture.large}" alt="" />
  <p class="name has-text-weight-semibold is-capitalized">${user.name.title}. ${
    user.name.first
  } ${user.name.last}</p>
  <div class="aditional-info">
    <p class="has-text-weight-semibold">State</p>
    <p class="is-capitalized">${user.location.state}</p>
    <p class="has-text-weight-semibold">Email Adress</p>
    <p>${user.email}</p>
    <p class="has-text-weight-semibold">Phone number</p>
    <p>${user.phone}</p>
  </div>
  `;
  document.getElementById(
    'blurred-picture'
  ).style.backgroundImage = `url(${picture})`;
  document.getElementById('blurred-picture').style.display = 'block';
}

//Function that takes an array of users and show them in the DOM
function displayUsers(usersArray) {
  clearElement('users');
  usersArray.forEach(element => {
    let newUser = `
    <div class="user-container" onClick="selectUser(this)" data-email="${
      element.email
    }">
      <img src="${element.picture.thumbnail}"/>
      <span class="is-capitalized">${element.name.first} ${element.name.last}
      </span>
    </div>
    `;
    document.getElementById('users').innerHTML =
      document.getElementById('users').innerHTML + newUser;
  });
}

//Function to clear the content of an element
function clearElement(element) {
  document.getElementById(element).innerHTML = null;
}

init();
