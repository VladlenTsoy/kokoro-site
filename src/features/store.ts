import {configureStore} from "@reduxjs/toolkit"
import {persistCombineReducers, persistStore} from "redux-persist"
import storage from "redux-persist/lib/storage"
import {productVariantsApi} from "@/features/product-variants/productVariantsApi"

const persistConfig = {
    key: "root",
    storage,
    blacklist: [productVariantsApi.reducerPath]
}

const persistedCombineReducers = persistCombineReducers(persistConfig, {
    [productVariantsApi.reducerPath]: productVariantsApi.reducer
})

export const store = configureStore({
    reducer: persistedCombineReducers,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false
        }).concat(productVariantsApi.middleware)
})

export const persistor = persistStore(store)
