import React from 'react';
import { PageHeader, Form, Input, Button } from 'antd';
import { FormComponentProps } from 'antd/lib/form';

interface FormProps {
  name: string;
}

interface InputOutputType {
  name: string;
  id: string;
}

interface ConditionPropertiesProps extends FormComponentProps<FormProps> {
  selectedProperty?: InputOutputType | null;
  onUpdatingCondition?: (id: string, name: string) => void;
  onAddingState?: (conditionId: string) => void;
}

class ConditionProperties extends React.PureComponent<
  ConditionPropertiesProps
> {
  public handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { form, selectedProperty, onUpdatingCondition } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        if (selectedProperty) {
          onUpdatingCondition &&
            onUpdatingCondition(selectedProperty.id, values.name);
        }
      }
    });
  };

  public onAddingState = () => {
    const { onAddingState, selectedProperty } = this.props;
    if (selectedProperty) {
      onAddingState && onAddingState(selectedProperty.id);
    }
  };

  public render() {
    const { form, selectedProperty } = this.props;
    const { getFieldDecorator } = form;

    return (
      <React.Fragment>
        <PageHeader title={'Condition'} subTitle="Properties of Condition" />
        <Form onSubmit={this.handleSubmit}>
          <Form.Item style={{ marginBottom: 0 }} label="Name">
            {getFieldDecorator('name', {
              initialValue: selectedProperty ? selectedProperty.name : '',
              rules: [{ required: true, message: 'Please input your note' }],
            })(<Input />)}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          </Form.Item>
          <Form.Item>
            <Button onClick={this.onAddingState} type="primary">
              Add States{' '}
              <span aria-label={'Add'} role={'img'}>
                ➕
              </span>
            </Button>
          </Form.Item>
        </Form>
      </React.Fragment>
    );
  }
}

const WrappedApp = Form.create<ConditionPropertiesProps>({
  name: 'cordinated',
})(ConditionProperties);

export default WrappedApp;
