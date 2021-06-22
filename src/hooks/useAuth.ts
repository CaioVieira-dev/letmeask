import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContextProvider'

export function useAuth() {
    const value = useContext(AuthContext);
    return value;
}