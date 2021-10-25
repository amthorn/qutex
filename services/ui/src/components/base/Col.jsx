import { Col as Cl } from "react-bootstrap";
import React from "react";

// bootstrap doesn't always add "col" class. E.G. "col-md-9"
export const Col = ({ children, ...props }) => 
    <Cl { ...props } >
        { children }
    </Cl>;