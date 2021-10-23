import React from "react";
import { Tabs as Tbs } from "react-bootstrap";

export const Tabs = ({ children, defaultActiveKey, ...props }) => 
    <Tbs defaultActiveKey={ defaultActiveKey } { ...props }>
        { children }
    </Tbs>;