import { PropTypes } from "prop-types";
import { React } from "react";
import { FormFeedback, FormGroup, FormText, Input, Label } from "reactstrap";

export const FormSelect = ({ 
    id,
    name,
    options,
    label,
    onChange,
    valid,
    invalid,
    feedbackMessage,
    text,
    defaultValue
}) => 
    <FormGroup>
        <Label for={ id || `${name}Select` }>{ label }</Label>
        <Input
            type="select"
            id={ id || `${name}Select` }
            name={ name }
            onChange={ onChange }
            valid={ valid }
            invalid={ invalid }
            defaultValue={ defaultValue }
        >
            <option selected={ true } disabled={ true } value="" className="text-muted">Select an Option</option>
            { options.map(index => <option key={ index.value } value={ index.value }>{ index.name }</option>) }
        </Input>
        <FormFeedback valid={ valid } invalid={ invalid }>{ feedbackMessage }</FormFeedback>
        <FormText className="text-muted">{ text }</FormText>
    </FormGroup>;

FormSelect.propTypes = {
    label: PropTypes.string.isRequired,

    defaultValue: PropTypes.string,
    feedbackMessage: PropTypes.string,
    id: PropTypes.string,
    invalid: PropTypes.bool,
    name: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.object),
    text: PropTypes.string,
    valid: PropTypes.bool,

    onChange: PropTypes.func,
};