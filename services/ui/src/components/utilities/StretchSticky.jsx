import classNames from "classnames/dedupe";
import React from "react";

export const StretchSticky = ({ className, style, children, ...props }) =>
    <div 
        { ...props }
        className={ classNames(className, "position-fixed") }
        style={ {...style, top: 0, bottom: 0} }>
        { children }
    </div>;
