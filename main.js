import State from "./State.js";
// Application
const store = new State();

// Define default state
store.todos = [];

// Define 'reducer' methods. Alter the state in response to actions

store.addTodo = function (description) {
    this.todos.push(description);
}

store.removeTodo = function (index) {
    this.todos.splice(index, 1);
}

store.removeAll = function () {
    this.todos = [];
}

// Get an element
var todos = document.getElementById("todos");

// Subscribe the element to actions
// Callback is called with subscriber elements as context
store.subscribe(todos, "addTodo", function (description, action, store) {
    // We can do what we like here. Update the DOM using vanilla
    // JS or jQuery or whatever.
    // We could even dispatch other actions
    var item = document.createElement('li');
    var checkBox = document.createElement('input');
    checkBox.setAttribute('type', 'checkbox');


    item.addEventListener('change', function (event) {
        store.dispatch(
            "todoCompletion",
            [event.target.checked, Number(item.getAttribute('data-key'))]
        );
    });

    item.textContent = description;
    item.appendChild(checkBox);
    item.setAttribute('data-key', store.todos.length - 1);

    this.appendChild(item);
});

store.subscribe(todos, "todoCompletion", function (isDone, index) {
    this
        .children[index]
        .classList[isDone ? 'add' : 'remove']('done');
});

store.subscribe(todos, "removeTodo", function (index) {
    this.removeChild(this.querySelectorAll('li')[index]);

    this.querySelectorAll('li').forEach(function (element, index) {
        element.setAttribute('data-key', index);
    })
});

store.subscribe(todos, "removeAll", function () {
    this.querySelectorAll('li').forEach(function (element) {
        this.removeChild(element);
    }.bind(this));
});

store.dispatch("addTodo", ["do a thing"]);
store.dispatch("addTodo", ["do another thing"]);
store.dispatch("addTodo", ["do a thing"]);
store.dispatch("removeTodo", [0]);

document.getElementById("addToDo").addEventListener("submit", function (event) {
    event.preventDefault();
    var description = document.getElementById("description").value;

    store.dispatch("addTodo", [description]);
    document.getElementById("description").value = null;
});

document.getElementById("removeAll").addEventListener("click", function () {
    store.dispatch("removeAll");
})
