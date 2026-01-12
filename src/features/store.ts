import {configureStore} from "@reduxjs/toolkit"
import {persistCombineReducers, persistStore} from "redux-persist"
import storage from "redux-persist/lib/storage"

const persistConfig = {
    key: "root",
    storage
}

const persistedCombineReducers = persistCombineReducers(persistConfig, {})

export const store = configureStore({
    reducer: persistedCombineReducers,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false
        })
})

export const persistor = persistStore(store)