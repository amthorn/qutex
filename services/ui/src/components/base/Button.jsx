import PropTypes from "prop-types";
import React from "react";
import { Button as Buttn, UncontrolledTooltip } from "reactstrap";


const Button = ({ children, delay, help, id, placement, ...properties }) => 
    <>
        <UncontrolledTooltip
            placement={ placement || "right" }
            target={ id }
            delay={ delay !== undefined ? delay : { show: 250, hide: 400 } }
        >
            { help }
          </UncontrolledTooltip>
        <Buttn id={ id } { ...properties }>{ children }</Buttn>
    </>;

Button.propTypes = {
    help: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    delay: PropTypes.object,
    placement: PropTypes.string,
};

export { Button };