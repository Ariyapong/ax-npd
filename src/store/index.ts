// import { createStore } from 'redux';
import { configureStore, applyMiddleware } from '@reduxjs/toolkit'
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import rootReducer from './rootReducer'

const persistConfig = {
    key: 'root',
    storage,
    blacklist: ['workflow']
}

const presistedReducer = persistReducer(persistConfig, rootReducer)
const store = configureStore({
    reducer: presistedReducer,
    devTools: process.env.NODE_ENV !== 'production',
    middleware: [thunk],
})
const persistor = persistStore(store)
export { persistor, store }
