import * as toolkitRaw from '@reduxjs/toolkit'
// import { combineReducers } from 'redux'
import report from './report'
import workflow from './workflow';

const { combineReducers } = ((toolkitRaw as any).default ?? toolkitRaw) as typeof toolkitRaw

const rootReducer = combineReducers({
    report,
    workflow
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
