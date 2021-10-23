import React from "react";
import { Card as _Card } from "react-bootstrap";

const classes = 'p-2 mb-2';

export const PaddedCard = ({ children, ...props }) => {
	props.className = props.className || '';
	props.className += (' ' + classes);

	return (
		<_Card { ...props } className={ props.className}>
			{ children }
		</_Card>
	)
}