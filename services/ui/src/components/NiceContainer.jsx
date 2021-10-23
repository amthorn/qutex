import React from "react";
import classNames from "classnames/dedupe";
import { Container } from "components/Components";


export var NiceContainer = function({ children, ...props }) {
    const style = {
        "boxShadow": "0 2px 22px 0 rgb(0 0 0 / 10%), 0 4px 20px 0 rgb(0 0 0 / 15%)",
        "borderRadius": "5px"
    };

    return (
        <Container { ...props } className={ classNames(props.className, "p-2") } data={ props.data || "white" } style={ { ...style, ...props.style } }>
            { children }
        </Container>
    );
};