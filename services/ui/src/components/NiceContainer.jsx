import classNames from "classnames/dedupe";
import { Container } from "components/Components";
import React from "react";


export const NiceContainer = ({ children, ...props }) => 
    <Container
        { ...props } 
        className={ classNames(props.className, "p-2") }
        data={ props.data || "white" }
        style={ {
            boxShadow: "0 2px 22px 0 rgb(0 0 0 / 10%), 0 4px 20px 0 rgb(0 0 0 / 15%)",
            borderRadius: "5px",
            ...props.style 
        } }
    >
        { children }
    </Container>;