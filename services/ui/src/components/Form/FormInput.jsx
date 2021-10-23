import { FormGroup, Label, Input, FormFeedback, FormText } from "reactstrap";
import { PropTypes } from "prop-types";

export const FormInput = ({ controlId, id, name, type, placeholder, label, onChange, valid, invalid, feedbackMessage, text, value, ...props }) => {
    return <FormGroup controlId={ controlId || `${name}Input` }>
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
        { feedbackMessage ? <FormFeedback valid={ valid || !invalid }>{ feedbackMessage }</FormFeedback> : null }
        { text ? <FormText className="text-muted">{ text }</FormText> : null }
    </FormGroup>
}

FormInput.propTypes = {
	controlId: PropTypes.string,
	id: PropTypes.string,
	label: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['text', 'textarea', 'password']),
	valid: PropTypes.bool,
	invalid: PropTypes.bool,
	onChange: PropTypes.func,
	placeholder: PropTypes.string,
	name: PropTypes.string,
	feedbackMessage: PropTypes.string,
	text: PropTypes.string,
}