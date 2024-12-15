import { User } from '../../interfaces/User';

export interface AuthState {
    user: User | null;
    status: 'checking' | 'authenticated' | 'not-authenticated';
}

export type AuthAction =
    | { type: 'auth'; payload: { user: User } }
    | { type: 'not-authenticated' }
    | { type: 'logout' }
    | { type: 'update-user'; payload: { user: User } }
    | { type: 'refresh-user'; payload: { user: User } };

export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case 'auth':
            return { ...state, status: 'authenticated', user: action.payload.user };
        case 'not-authenticated':
        case 'logout':
            return { ...state, status: 'not-authenticated', user: null };
        case 'update-user':
            return { ...state, user: { ...state.user, ...action.payload.user } };
        case 'refresh-user':
            return { ...state, user: {...state.user, ...action.payload.user} };
        default:
            return state;
    }
};
