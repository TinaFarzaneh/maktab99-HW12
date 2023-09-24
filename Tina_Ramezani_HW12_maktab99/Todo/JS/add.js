const API_URL = "http://localhost:5000/todos";

const toast = document.getElementById("toast");

const InputTextLabel = document.querySelector("#InputTextLabel");
const inputTitle = document.querySelector("#inputTitle");
const TitleError = document.querySelector("#TitleError");
const inputDescription = document.querySelector("#inputDescription");
const InputDateLabel = document.querySelector("#InputDateLabel");
const inputDueDate = document.querySelector("#inputDueDate");
const DateError = document.querySelector("#DateError");

const form = document.getElementById("addForm");
const btn = document.querySelector("#submitBtn");

// //Get information
// async function getTodos() {
//   const response = await fetch(API_URL);
//   // console.log(response);
//   const todosData = await response.json();
//   // console.log(todosData);
// }
// getTodos();
// *******************POST**********************//
function postForm(e) {
  e.preventDefault();
  const formData = Object.fromEntries(new FormData(form).entries());
  myToast();
  todosData(formData);
}

const todosData = async function (data) {
  const respons = await fetch(`${API_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: data.inputText,
      description: data.inputDescription,
      date: data.inputDueDate,
      createdAt: new Date(),
      isDone: false,
    }),
  });

  if (respons.ok) {
    form.reset();
    myToast();
    setTimeout(() => {
      window.location.href = "../html/todos.html";
    }, 2000);
  }
};

// *****************toast*******************/
function myToast() {
  let toast = document.getElementById("toast");
  toast.className = "show";
  setTimeout(function () {
    toast.className = toast.className.replace("show", "");
  }, 2000);
}
//****************Edit todo*****************/
const currentUrl = new URL(window.location.href); //get current page href
const editTodoID = currentUrl.searchParams.get("id");

async function editTodo() {
  const respons = await fetch(`${API_URL}/${editTodoID}`);
  const apiData = await respons.json();
  console.log(respons);
  console.log(apiData);
  if (!respons.ok) {
    window.location.href = "../html/notFound.html";
  }
  btn.innerHTML = "Save";
  inputTitle.value = apiData.title;
  inputDescription.value = apiData.description;
  inputDueDate.value = apiData.date;
}

function pachData(e) {
  e.preventDefault();

  fetch(`${API_URL}/${editTodoID}`, {
    method: "PATCH",
    body: JSON.stringify({
      title: inputTitle.value,
      description: inputDescription.value,
      date: inputDueDate.value,
      updatedAt: new Date(),
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
  form.reset();
  // window.location.href = "../html/notFound.html";
}

if (editTodoID) {
  editTodo();
  btn.addEventListener("click", pachData);
} else {
  form.addEventListener("submit", postForm);
}
