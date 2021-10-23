import { createContext } from "react";

const themes = {
    dark: "",
    light: "white-content",
};

const ThemeContext = createContext({
    theme: themes.dark,
    changeTheme() {}, // eslint-disable-line no-empty-function
});

export {
    ThemeContext,
    themes
};