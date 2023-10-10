export const createStore = (initialState, reducer) => {
    function emit(name, detail) {
        let event = new CustomEvent(name, {
            bubbles: true,
            cancelable: true,
            detail: detail
        });

        return document.dispatchEvent(event);

    }

    const state = new Proxy(
        { value: initialState, segmentOfStore: "" },
        {
            set(obj, prop, value) {
                obj[prop] = value;

                emit(prop, obj);
                return true;
            },
        }
    );

    function getState() {
        return { ...state.value };
    }

    function dispatch(action, segmentOfStore) {
        const prevState = getState();

        state.value = reducer(prevState, action);
        state.segmentOfStore = segmentOfStore;
    }

    return { dispatch };
}
