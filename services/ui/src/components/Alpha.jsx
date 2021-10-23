import React from "react";
import classNames from "classnames/dedupe";

export const Alpha = () => {
    const style = {
        'border': '1px solid',
        'borderRadius': '5px',
        'lineHeight': '18px',
        'float': 'right',
        'marginRight': '-10px',
        'marginTop': '5px'
    }
    return (
        <div className={ classNames('bg-info', 'd-inline-flex', 'px-1') } style={style}>
            Alpha
        </div>
    )
}