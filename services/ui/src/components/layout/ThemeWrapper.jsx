import React, { useEffect, useState } from "react";
import { ThemeContext, themes } from "components/layout/ThemeContext";

export const ThemeContextWrapper = ({ children, ...props }) => {
    const [theme, setTheme] = useState(props.theme);

    const changeTheme = (newTheme) => setTheme(newTheme);

    useEffect(() => {
        switch (theme) {
            case themes.light:
                document.body.classList.add("white-content");

                break;
            case themes.dark:
            default:
                document.body.classList.remove("white-content");

                break;
            }
    }, [theme]);

    return (
        <ThemeContext.Provider value={ React.useMemo(() => ({ theme, changeTheme }), []) }>
            {children}
        </ThemeContext.Provider>
    );
};