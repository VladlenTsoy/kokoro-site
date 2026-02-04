import {configureStore} from "@reduxjs/toolkit"
import {persistCombineReducers, persistStore} from "redux-persist"
import storage from "redux-persist/lib/storage"
import {productVariantsApi} from "@/features/product-variants/productVariantsApi"
import {cartReducer} from "@/features/cart/cartSlice"

const persistConfig = {
    key: "root",
    storage,
    blacklist: [productVariantsApi.reducerPath]
}

const persistedCombineReducers = persistCombineReducers(persistConfig, {
    [productVariantsApi.reducerPath]: productVariantsApi.reducer,
    cart: cartReducer
})

export const store = configureStore({
    reducer: persistedCombineReducers,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false
        }).concat(productVariantsApi.middleware)
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
