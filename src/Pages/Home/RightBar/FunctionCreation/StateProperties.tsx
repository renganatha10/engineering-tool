import React from 'react';
import { PageHeader, Form, Input, Button } from 'antd';
import { FormComponentProps } from 'antd/lib/form';

const { TextArea } = Input;

interface FormProps {
  name: string;
  severity: string;
  possibleCause: string;
  suggestedAction: string;
  correctiveAction: string;
  logic: string;
}

interface SelectedProperty extends FormProps {
  id: string;
}

interface StatePropertiesProps extends FormComponentProps<FormProps> {
  onUpdateState?: ({
    conditionId,
    state,
  }: {
    conditionId: string;
    state: SelectedProperty;
  }) => void;
  selectedProperty?: null | SelectedProperty;
  conditionId: string;
}

class StateProperties extends React.PureComponent<StatePropertiesProps> {
  public handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { form, selectedProperty, conditionId, onUpdateState } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        if (selectedProperty) {
          onUpdateState &&
            onUpdateState({
              conditionId,
              state: { id: selectedProperty.id, ...values },
            });
        }
      }
    });
  };

  public render() {
    const { form, selectedProperty } = this.props;
    const { getFieldDecorator } = form;

    return (
      <React.Fragment>
        <PageHeader title="State" subTitle="Properties of State" />
        <Form onSubmit={this.handleSubmit}>
          <Form.Item style={{ marginBottom: 0 }} label="Name">
            {getFieldDecorator('name', {
              initialValue: selectedProperty ? selectedProperty.name : '',
              rules: [{ required: true, message: 'Please input your name' }],
            })(<Input />)}
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }} label="Severity">
            {getFieldDecorator('severity', {
              initialValue: selectedProperty ? selectedProperty.severity : '',
              rules: [
                { required: true, message: 'Please input your severity' },
              ],
            })(<Input />)}
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }} label="Possible Cause">
            {getFieldDecorator('possibleCause', {
              initialValue: selectedProperty
                ? selectedProperty.possibleCause
                : '',
              rules: [
                { required: true, message: 'Please input your possible cause' },
              ],
            })(<Input />)}
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }} label="Suggested Action">
            {getFieldDecorator('suggestedAction', {
              initialValue: selectedProperty
                ? selectedProperty.suggestedAction
                : '',
              rules: [
                {
                  required: true,
                  message: 'Please input your suggested action',
                },
              ],
            })(<Input />)}
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }} label="Corrective Action">
            {getFieldDecorator('correctiveAction', {
              initialValue: selectedProperty
                ? selectedProperty.correctiveAction
                : '',
              rules: [
                {
                  required: true,
                  message: 'Please input your corrective action',
                },
              ],
            })(<Input />)}
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }} label="logic">
            {getFieldDecorator('logic', {
              initialValue: selectedProperty ? selectedProperty.logic : '',
              rules: [{ required: true, message: 'Please input your logic' }],
            })(<TextArea />)}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </React.Fragment>
    );
  }
}

const WrappedApp = Form.create<StatePropertiesProps>({ name: 'coordinated' })(
  StateProperties
);

export default WrappedApp;
