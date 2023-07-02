// import { createStore } from 'redux';
// import { configureStore, applyMiddleware } from '@reduxjs/toolkit'
import * as toolkitRaw from '@reduxjs/toolkit'
// import thunk from 'redux-thunk'
import * as thunk from 'redux-thunk'
import { persistStore, persistReducer, WebStorage } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import rootReducer from './rootReducer'

const { configureStore } = ((toolkitRaw as any).default ?? toolkitRaw) as typeof toolkitRaw

const persistConfig = {
    key: 'root',
    storage,
    blacklist: ['workflow']
}

const presistedReducer = persistReducer(persistConfig, rootReducer) as toolkitRaw.Reducer<toolkitRaw.CombinedState<any>>
const store = configureStore({
    reducer: import.meta.env.SSR ? rootReducer : presistedReducer,
    devTools: import.meta.env.DEV,
    middleware: import.meta.env.SSR ? [] : [thunk.default],
})
const persistor = persistStore(store)
export { persistor, store }
