import classNames from "classnames";
import { Card as Crd } from "react-bootstrap";
import React from "react";

export const PaddedCard = ({ children, ...props }) => {
    const className = classNames(props.className, "p-2", "mb-2");

    return <Crd { ...{...props, className } } className={ className }>{ children }</Crd>;
};