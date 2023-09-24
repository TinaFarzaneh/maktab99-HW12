const API_URL = "http://localhost:5000/todos";

const ulElem = document.querySelector("#listItem");

async function getTodos() {
  const response = await fetch(API_URL);
  const todosData = await response.json();
  createList(todosData);
}
getTodos();

// *****delete modal*******

function createList(todoData = []) {
  ulElem.innerHTML = "";
  todoData?.map((todos) => {
    const { title, description, date, id, createAt, updateAt, isDone } = todos;
    const htmlTag = `<li id="item-${id}" class="todolist">
    <div class="top-item">
      <div>
      <input type="checkbox" onclick="checkInput(${id})" id="check-${id}" >
        <span id="title-${id}" class="title">${title}</span>
        <span id="duDate-${id}" class="date">${date}</span>
      </div>
      <div class="operation">
        <div id="edit-${id}" class="edite" onclick="editeTodo(${id})">
        <svg xmlns="http://www.w3.org/2000/svg"       xmlns:xlink="http://www.w3.org/1999/xlink"
            aria-hidden="true" role="img" class="iconify iconify--la" width="1em" height="1em"
            preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32" data-icon="la:pen">
            <path fill="currentColor"
              d="M23.906 3.969A4.097 4.097 0 0 0 21 5.188L5.187 21l-.062.313l-1.094 5.5l-.312 1.468l1.469-.312l5.5-1.094l.312-.063L26.813 11a4.075 4.075 0 0 0 0-5.813a4.097 4.097 0 0 0-2.907-1.218zm0 1.906c.504 0 1.012.23 1.5.719c.973.972.973 2.027 0 3l-.718.687l-2.97-2.969l.688-.718c.489-.489.996-.719 1.5-.719zm-3.593 2.844l2.968 2.969L11.188 23.78a6.813 6.813 0 0 0-2.97-2.968zM6.938 22.438a4.734 4.734 0 0 1 2.625 2.625l-3.282.656z">
            </path>
          </svg>
          </div>
        <div class="delete-btn" onclick="deleteTodo(${id})"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
            aria-hidden="true" role="img" class="iconify iconify--icomoon-free" width="1em" height="1em"
            preserveAspectRatio="xMidYMid meet" viewBox="0 0 16 16" data-icon="icomoon-free:bin">
            <path fill="currentColor"
              d="M2 5v10c0 .55.45 1 1 1h9c.55 0 1-.45 1-1V5H2zm3 9H4V7h1v7zm2 0H6V7h1v7zm2 0H8V7h1v7zm2 0h-1V7h1v7zm2.25-12H10V.75A.753.753 0 0 0 9.25 0h-3.5A.753.753 0 0 0 5 .75V2H1.75a.752.752 0 0 0-.75.75V4h13V2.75a.752.752 0 0 0-.75-.75zM9 2H6v-.987h3V2z">
            </path>
          </svg></div>
      </div>
    </div>
    <div class="bottom-item">
      <p id="desc-${id}">${description}</p>
    </div>
    
  </li>`;
    ulElem.insertAdjacentHTML("afterbegin", htmlTag);

    const checkInput = document.querySelector(`#check-${id}`);
    checkInput.checked = isDone;
  });
}

// ***************checkBox*******************/
async function checkInput(id) {
  try {
    const respons = await fetch(`${API_URL}/${id}`);
    const data = await respons.json();
    data.isDone ? (data.isDone = false) : (data.isDone = true);

    const check = await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
  } catch (error) {
    console.log(error);
  }
}

// *********************Delete******************/
function deleteTodo(id) {
  const elem = document.querySelector(`#item-${id}`);
  const deleteModal = document.querySelector(".deleteBox");
  deleteModal.style.display = "block";
  const btnDelete = document.querySelector("#deleteItem");
  const btnCancel = document.querySelector("#cancelDelete");

  btnDelete.addEventListener("click", async function () {
    // debugger;
    try {
      const respons = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      deleteModal.style.display = "none";
      getTodos();
      pagination();
    } catch {
      console.log("error");
    }
  });

  btnCancel.addEventListener("click", function () {
    deleteModal.style.display = "none";
  });
}

// ***********************edit*****************/
function editeTodo(id) {
  // location.assign(`file:///D:/02-HW/HW12/Todo/html/add_index.html?=${id}`);
  location.assign(`http://127.0.0.1:5500/html/add_index.html?id=${id}`);
}

//******************pagination******************/

function paginate(items, itemsPerPage) {
  let pageUrl = new URL(window.location.href);
  let page = pageUrl.searchParams.get("page");

  let currentPage = page ? page : 1;
  const totalPages = Math.ceil(items.length / itemsPerPage); //itemsPerpage=5

  function showItems(page) {
    // debugger;
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageItems = items.slice(startIndex, endIndex);

    const itemsContainer = document.querySelector("#listItem");
    itemsContainer.innerHTML = "";
    ulElem.innerHTML = "";
    createList(pageItems);
    setupPagination(pageItems);
  }

  function setupPagination() {
    const pagination = document.querySelector(".pagination-container");

    pagination.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
      const link = document.createElement("a");
      const href = todoPageHref(i);

      link.href = href;
      link.innerText = i;

      if (i === currentPage) {
        link.classList.add("active");
      }

      link.addEventListener("click", (event) => {
        event.preventDefault();
        currentPage = i;
        showItems(currentPage);
        todoPageHref(currentPage);
        // const currentActive = document.querySelector(".active");
        // currentActive.classList.remove("active");
        link.classList.add("active");
      });
      pagination.append(link);
    }
  }
  showItems(currentPage);
  if (currentPage > totalPages) {
    window.location.replace("../html/notFound.html");
  } else {
    console.log("error");
  }
}

async function pagination() {
  const response = await fetch(API_URL);
  const data = await response.json();
  // console.log(data);
  let items = [];
  data.forEach((elem) => items.push(elem));
  const itemsPerPage = 4;
  paginate(items, itemsPerPage);
}
pagination();

function todoPageHref(page) {
  let href =
    window.location.protocol +
    "//" +
    window.location.host +
    window.location.pathname +
    "?page=" +
    page;
  window.history.pushState({ path: href }, "", href);
  return href;
}
