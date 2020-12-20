import { appSagas } from "app/redux/sagas"
import { SagaIterator } from "redux-saga"
import { all, fork } from "redux-saga/effects"

export function* rootSagas(): SagaIterator {
  yield all(appSagas.map(saga => fork(saga)))
}
