import { FormGroup, Label, Input, FormFeedback, FormText } from "reactstrap";
import { PropTypes } from "prop-types";

export const FormSelect = ({ controlId, id, name, options, label, onChange, valid, invalid, feedbackMessage, text, defaultValue, ...props }) => {
    return <FormGroup>
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
            <option selected disabled value="" className="text-muted">Select an Option</option>
            { options.map(i => <option key={ i.value } value={ i.value }>{ i.name }</option>) }
        </Input>
        <FormFeedback valid={ valid } invalid={ invalid }>{ feedbackMessage }</FormFeedback>
        <FormText className="text-muted">
            { text }
        </FormText>
    </FormGroup>
}

FormSelect.propTypes = {
    id: PropTypes.string,
    label: PropTypes.string.isRequired,
    valid: PropTypes.bool,
    invalid: PropTypes.bool,
    onChange: PropTypes.func,
    options: PropTypes.arrayOf(PropTypes.object),
    name: PropTypes.string,
    feedbackMessage: PropTypes.string,
    text: PropTypes.string,
    defaultValue: PropTypes.string,
}