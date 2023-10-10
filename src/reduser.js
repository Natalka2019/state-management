import {COUNTER, USERS} from "./actions.js";

export const reducer = (state, action) => {
    switch (action.type) {
        case COUNTER.INCREMENT:
            state = {
                ...state,
                counter: state.counter + 1
            }
            break;
        case COUNTER.DECREMENT:
            state = {
                ...state,
                counter: state.counter - 1
            }
            break;
        case COUNTER.RESET:
            state = {
                ...state,
                counter: 0
            }
            break;
        case USERS.GET_USERS:
            state = {
                ...state,
                users: action.payload
            }
            break;
        case USERS.GET_USERS_REPOS:
            const usersWithRepos = state.users.map(user => {
                if (user.login === action.payload.userLogin) {
                    return { ...user, reposList: action.payload.userRepos }
                }
                return user;
            });

            state = {
                ...state,
                users: usersWithRepos
            }
            break;
        case USERS.CLEAR_USERS:
            state = {
                ...state,
                users: []
            }
            break;
        default:
            state = {
                ...state,
                counter: 0,
                users: []
            }
            break;
    }

    return state;
}
