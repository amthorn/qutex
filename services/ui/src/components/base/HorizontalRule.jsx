import React from "react";

const defaultBorderWidth = 3;
export const HorizontalRule = ({ width }) => <div className={ `border-bottom my-${width || defaultBorderWidth}` } />;