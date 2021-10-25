import React from "react";
import { Row as Rw } from "react-bootstrap";

// bootstrap doesn't always add "row" class. E.G. "row-md-9"
export const Row = ({ children, ...props }) =>
    <Rw { ...props }>
        { children }
    </Rw>;