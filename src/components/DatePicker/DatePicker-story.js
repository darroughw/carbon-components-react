import React from 'react';
import { storiesOf } from '@storybook/react';
import { action, decorateAction } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
import { withKnobs, boolean, select, text } from '@storybook/addon-knobs';
import DatePicker from '../DatePicker';
import DatePickerInput from '../DatePickerInput';
import DatePickerSkeleton from '../DatePicker/DatePicker.Skeleton';
import WithState from '../../tools/withState';

// Datepickers last argument contains an instance of flatpickr
// and will cause action logger to enter an infinite loop. Just don't log that argument
const datePickerOnChangeActions = decorateAction([
  args => args.slice(0, args.length - 2),
]);

const patterns = {
  'd{1,2}/d{4}': 'Short (d{1,2}/d{4})',
  'd{1,2}/d{1,2}/d{4}': 'Regular (d{1,2}/d{1,2}/d{4})',
};

const props = {
  datePicker: () => ({
    id: 'date-picker',
    light: boolean('Light variant (light in <DatePicker>)', false),
    onChange: datePickerOnChangeActions('onPickerChange'),
  }),
  datePickerInput: () => ({
    id: 'date-picker-input-id',
    className: 'some-class',
    labelText: text(
      'Label text (labelText in <DatePickerInput>)',
      'Date Picker label'
    ),
    locale: text('Locale (locale in <DatePickerInput>)', 'en'),
    pattern: select(
      'The date format (pattern in <DatePickerInput>)',
      patterns,
      'd{1,2}/d{4}'
    ),
    placeholder: text(
      'Placeholder text (placeholder in <DatePickerInput>)',
      'mm/dd/yyyy'
    ),
    disabled: boolean('Disabled (disabled in <DatePickerInput>)', false),
    invalid: boolean(
      'Show form validation UI (invalid in <DatePickerInput>)',
      false
    ),
    invalidText: text(
      'Form validation UI content (invalidText in <DatePickerInput>)',
      'A valid value is required'
    ),
    onClick: action('onClick'),
    onChange: action('onInputChange'),
  }),
};

storiesOf('DatePicker', module)
  .addDecorator(withKnobs)
  .add(
    'simple',
    withInfo({
      text: 'A simple Date Picker consists of an input field and no calendar.',
    })(() => (
      <DatePicker
        {...props.datePicker()}
        short={boolean('Use shorter width (short in <DatePicker>)', false)}
        datePickerType="simple">
        <DatePickerInput {...props.datePickerInput()} />
      </DatePicker>
    ))
  )
  .add(
    'single with calendar',
    withInfo({
      text: `
        A single Date Picker consists of an input field and a calendar.
      `,
    })(() => (
      <DatePicker
        {...props.datePicker()}
        datePickerType="single"
        dateFormat={text(
          'The date format (dateFormat in <DatePicker>)',
          'm/d/Y'
        )}>
        <DatePickerInput {...props.datePickerInput()} />
      </DatePicker>
    ))
  )
  .add(
    'range with calendar',
    withInfo({
      text: `
        A range Date Picker consists of two input fields and a calendar.
      `,
    })(() => {
      const datePickerInputProps = props.datePickerInput();
      return (
        <DatePicker
          {...props.datePicker()}
          datePickerType="range"
          dateFormat={text(
            'The date format (dateFormat in <DatePicker>)',
            'm/d/Y'
          )}>
          <DatePickerInput
            {...datePickerInputProps}
            id="date-picker-input-id-start"
          />
          <DatePickerInput
            {...datePickerInputProps}
            id="date-picker-input-id-end"
          />
        </DatePicker>
      );
    })
  )
  .add(
    'range with calendar and min/max dates',
    withInfo({
      text: `
        A range Date Picker consists of two input fields and a calendar, and optionally, the minDate and maxDate fields.
      `,
    })(() => {
      const datePickerInputProps = props.datePicker();
      return (
        <DatePicker
          {...props.datePicker()}
          minDate="1/10/2020"
          maxDate="1/20/2020"
          datePickerType="range"
          dateFormat="m/d/Y">
          <DatePickerInput
            {...datePickerInputProps}
            id="date-picker-input-id"
          />
          <DatePickerInput
            {...datePickerInputProps}
            id="date-picker-input-id-2"
          />
        </DatePicker>
      );
    })
  )
  .add(
    'fully controlled',
    withInfo({
      text: `
        If your application needs to control the value of the date picker and
        be notified of any changes.
      `,
    })(() => (
      <WithState initialState={{ date: '' }}>
        {({ state, setState }) => (
          <>
            <DatePicker
              datePickerType="single"
              dateFormat="m/d/Y"
              value={state.date}
              onChange={eventOrDates => {
                const value = eventOrDates.target
                  ? eventOrDates.target.value
                  : eventOrDates[0];
                setState({ date: value });
              }}>
              <DatePickerInput
                {...props.datePickerInput()}
                id="date-picker-input-id"
              />
            </DatePicker>
            <button onClick={() => setState({ date: '01/01/2011' })}>
              Click me to set to 01/01/2011
            </button>
          </>
        )}
      </WithState>
    ))
  )
  .add(
    'skeleton',
    withInfo({
      text: `
        Placeholder skeleton state to use when content is loading.
        `,
    })(() => <DatePickerSkeleton range />)
  );
