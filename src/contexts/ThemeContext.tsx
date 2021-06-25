import { createContext, ReactNode, useState } from 'react'

type ThemeType = 'light' | 'dark';

type ThemeContextType = {
    toggleTheme: () => void;
    theme: ThemeType;
}

type ThemeContextProviderProps = {
    children: ReactNode;
}

export const ThemeContext = createContext({} as ThemeContextType);

export function ThemeContextProvider(props: ThemeContextProviderProps) {
    const [theme, setTheme] = useState<ThemeType>('light')

    function toggleTheme() {
        setTheme(theme === 'light' ? 'dark' : 'light');
    }


    return (
        <ThemeContext.Provider value={{ toggleTheme, theme }}>
            {props.children}
        </ThemeContext.Provider>
    )
}