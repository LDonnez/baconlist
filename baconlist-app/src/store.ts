import { createBrowserHistory } from "history"
import { applyMiddleware, createStore } from "redux"
import { composeWithDevTools } from "redux-devtools-extension"
import createSagaMiddleware from "redux-saga"
import { rootReducer } from "./reducers"
import { rootSagas } from "./sagas"

export const history = createBrowserHistory()

const sagaMiddleware = createSagaMiddleware()

const middlewares = [sagaMiddleware]

const composedMiddlewares = composeWithDevTools(applyMiddleware(...middlewares))

const store = createStore(rootReducer(), composedMiddlewares)

sagaMiddleware.run(rootSagas)

export default store
