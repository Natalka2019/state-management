import {createStore} from "./StateManager.js";
import {COUNTER, USERS} from "./actions.js";
import {reducer} from "./reduser.js";

window.addEventListener("DOMContentLoaded", startApp);

const SEGMENTS_OF_STORE = {
    counter: "counter",
    users: "users"
}

function startApp() {
    const counter = document.querySelector("#counter");
    const increment = document.querySelector("#increment");
    const decrement = document.querySelector("#decrement");
    const reset = document.querySelector("#reset");
    const getUsersButton = document.querySelector("#getUsers");
    const clearUsersButton = document.querySelector("#clearUsers");
    const usersList = document.querySelector("#usersList");

    const initialState = { counter: 0, users: [] };


    const store = createStore(initialState, reducer);

    const getUsersTemplate = (users) => {
        console.log("UPDATE USERS", users);
        if (!users.length) {
            return `
                <p><em>No users.</em></p>
                `;
        }

        return `
		<ul>
			${users.map(function (user) {
                const reposList = user.reposList.map(repo => `<li>${repo}</li>`);
            return `<li>
                <h4>${user.login}</h4>
                <ul>
                    ${reposList}
                </ul>
            </li>`;
        }).join('')}
		</ul>`;

    }

    const getCounterTemplate = (counterValue) => {
        console.log("UPDATE COUNTER");
        counter.innerText = counterValue;

    }

    // listen to global state update
    document.addEventListener('segmentOfStore', function (event) {
        switch (event.detail.segmentOfStore) {
            case SEGMENTS_OF_STORE.counter:
                getCounterTemplate(event.detail.value.counter)
                break;
            case SEGMENTS_OF_STORE.users:
                usersList.innerHTML = getUsersTemplate(event.detail.value.users)
                break;
        }
    });


    increment.addEventListener("click", () => {
        store.dispatch({ type: COUNTER.INCREMENT }, SEGMENTS_OF_STORE.counter);
    });
    decrement.addEventListener("click", () => {
        store.dispatch({ type: COUNTER.DECREMENT }, SEGMENTS_OF_STORE.counter);
    });
    reset.addEventListener("click", () => {
        store.dispatch({ type: COUNTER.RESET }, SEGMENTS_OF_STORE.counter);
    });

    getUsersButton.addEventListener("click", () => {
        fetch('https://api.github.com/users', {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        })
            .then(response => response.json())
            .then(data => {
                store.dispatch({ type: USERS.GET_USERS, payload: data }, SEGMENTS_OF_STORE.users);

                data.forEach(({ login }) => getUserRepositories(login));
            })
            .catch(error => console.error(error));
    });

    clearUsersButton.addEventListener("click", () => {
        store.dispatch({ type: USERS.CLEAR_USERS }, SEGMENTS_OF_STORE.users);
    });

    usersList.innerHTML = getUsersTemplate([]);

    function getUserRepositories(login) {
        fetch(`https://api.github.com/users/${login}/repos`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log("data", data);

                const reposNames = data.map(repo => repo.name);

                store.dispatch({ type: USERS.GET_USERS_REPOS, payload: { userLogin: login, userRepos: reposNames } }, SEGMENTS_OF_STORE.users);

            })
            .catch(error => console.error(error));
    }

}



