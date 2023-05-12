import { combineReducers } from 'redux'
import report from './report'
import workflow from './workflow';

const rootReducer = combineReducers({
    report,
    workflow
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
