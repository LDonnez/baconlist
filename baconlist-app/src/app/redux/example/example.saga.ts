import * as api from "app/api/example"
import { SagaIterator } from "redux-saga"
import { call, put, takeLatest } from "redux-saga/effects"
import * as actions from "./example.actions"

export function* getExampleFlow(): SagaIterator {
  try {
    const response = yield call(api.getExample)
    yield put(actions.getExampleSuccess(response?.data))
  } catch (e) {
    yield put(actions.getExampleFail(e))
  }
}

export default function* exampleSaga(): SagaIterator {
  yield takeLatest(actions.Types.GET, getExampleFlow)
}
