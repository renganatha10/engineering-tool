import React from 'react';
import { Form, Input, Icon } from 'antd';
import { FormComponentProps } from 'antd/lib/form';

interface FormInputProps {
  id: string;
  onDelete: (key: string) => void;
  mode: number;
}

class FormInput extends React.Component<FormInputProps & FormComponentProps> {
  public _onremove = () => {
    const { onDelete, id } = this.props;
    onDelete(id);
  };

  public render() {
    const { id, form, mode } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const keys =
      mode === 0 ? getFieldValue('keysInput') : getFieldValue('keysOutput');
    const label = mode === 0 ? 'input name' : 'output name';
    const identifier = mode === 0 ? 'input' : 'output';
    return (
      <Form.Item label="" required={false} key={id}>
        {getFieldDecorator(`names[${identifier}${id}]`, {
          validateTrigger: ['onChange', 'onBlur'],
          rules: [
            {
              required: true,
              whitespace: true,
              message: 'Please input name or delete this field.',
            },
          ],
        })(
          <Input placeholder={label} style={{ width: '80%', marginRight: 8 }} />
        )}
        {mode === 1 && keys.length > 1 ? (
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            onClick={this._onremove}
          />
        ) : (
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            onClick={this._onremove}
          />
        )}
      </Form.Item>
    );
  }
}

export default FormInput;
