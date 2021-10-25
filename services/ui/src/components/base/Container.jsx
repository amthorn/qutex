import { Container as Containr } from "react-bootstrap";
import React from "react";

export const Container = ({ children, ...props }) => 
    <Containr { ...props } fluid={ props.fluid || "inf" }>
        { children }
    </Containr>;