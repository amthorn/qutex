import classNames from "classnames/dedupe";
import { Col } from "components/base/Col";
import React from "react";


export const RightAlignCol = ({ children, ...props }) => 
    <Col { ...props } className={ classNames(props.className, "d-flex", "justify-content-end") }>
        { children }
    </Col>;