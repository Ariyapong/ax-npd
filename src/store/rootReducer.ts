import { combineReducers } from 'redux'
import report from './report'

const rootReducer = combineReducers({
    report,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
