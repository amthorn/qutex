import classNames from "classnames/dedupe";
import React from "react";
import { Row } from "components/base/Row";

export const RightAlignRow = ({ children, ...props }) => 
    <Row { ...props } className={ classNames(props.className, "d-flex", "justify-content-end") }>
        { children }
    </Row>;