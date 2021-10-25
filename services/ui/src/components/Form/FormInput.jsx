import { PropTypes } from "prop-types";
import { React } from "react";
import { FormFeedback, FormGroup, FormText, Input, Label } from "reactstrap";

export const FormInput = ({
    controlId,
    id,
    name,
    type,
    placeholder,
    label,
    onChange,
    valid,
    invalid,
    feedbackMessage,
    text,
    value
}) => 
    <FormGroup controlId={ controlId || `${name}Input` }>
        <Label for={ id || `${name}Input` }>{ label }</Label>
        <Input 
            type={ type || "text" }
            id={ id || `${name}Input` } 
            placeholder={ placeholder } 
            name={ name } 
            onChange={ onChange } 
            valid={ valid }
            invalid={ invalid }
            value={ value }
        />
        { feedbackMessage ? <FormFeedback valid={ valid || !invalid }>{ feedbackMessage }</FormFeedback> : undefined }
        { text ? <FormText className="text-muted">{ text }</FormText> : undefined }
    </FormGroup>;

FormInput.propTypes = {
    label: PropTypes.string.isRequired,

    controlId: PropTypes.string,
    feedbackMessage: PropTypes.string,
    id: PropTypes.string,
    invalid: PropTypes.bool,
    name: PropTypes.string,
    placeholder: PropTypes.string,
    text: PropTypes.string,
    type: PropTypes.oneOf(["text", "textarea", "password"]),
    valid: PropTypes.bool,

    onChange: PropTypes.func,
};