import { UserSchema } from "enteties/User";
import { LoginSchema } from "features/AuthByUsername";
import {
    EnhancedStore,
    Reducer,
    ReducersMapObject, UnknownAction,
} from "@reduxjs/toolkit";
import { ProfileSchema } from "enteties/Profile";
import { NavigateOptions } from "react-router/dist/lib/context";
import { To } from "@remix-run/router";
import { AxiosInstance } from "axios";
import { MovieDetailsSchema } from "enteties/Movie";

export interface StateSchema {
    user: UserSchema,
    loginForm: LoginSchema,
    profile: ProfileSchema,
    movies: MovieDetailsSchema,
}

export type StateSchemaKey = keyof StateSchema;

export interface ReducerManager {
    getReducerMap: () => ReducersMapObject<StateSchema>;
    reduce: (state: StateSchema, action: UnknownAction) => StateSchema;
    add: (key: StateSchemaKey, reducer: Reducer) => void;
    remove: (key: StateSchemaKey) => void;
}

export interface ReduxStoreWithManager extends EnhancedStore<StateSchema> {
    reducerManager: ReducerManager;
}

export interface ThunkExtraArg {
    api: AxiosInstance;
    navigate?: (to: To, options?: NavigateOptions) => void;
}

export interface ThunkConfig<T> {
    rejectValue: T;
    extra: ThunkExtraArg;
    state: StateSchema;
}