import React from "react";
import classNames from "classnames/dedupe";

import { Container } from "react-bootstrap";

export const DataContainer = ({ title, subtitle, children, ...props }) => (
    <Container { ...props } className={ classNames(props.className, 'px-0', 'mx-0', 'mw-100') }>
        <h5 className="mb-0">{ title }</h5>
        <small className="text-primary">{ subtitle }</small>
        <div className="mt-2">{ children }</div>
    </Container>
)