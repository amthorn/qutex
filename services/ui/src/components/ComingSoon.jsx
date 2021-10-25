import classNames from "classnames/dedupe";
import React from "react";

export const ComingSoon = () => {
    const style = {
        "border": "1px solid",
        "borderRadius": "5px",
        "lineHeight": "18px",
        "float": "right",
        "marginRight": "-10px",
        "marginTop": "5px"
    };

    return (
        <div className={ classNames("bg-danger", "d-inline-flex", "px-1") } style={ style }>
            Coming
        </div>
    );
};