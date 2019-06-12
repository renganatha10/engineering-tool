import React from 'react';
import { PageHeader, Form, Select, Input, Button } from 'antd';
import { FormComponentProps } from 'antd/lib/form';

const { Option } = Select;

interface StateTypes {
  showSubTitle: boolean;
}

interface FormProps {
  name: string;
  dataType: string;
  subDatatype: string;
}

interface InputOutputType {
  name: string;
  id: string;
  dataType?: string;
  subDatatype?: string;
}

interface InputOutputPropertiesProps extends FormComponentProps<FormProps> {
  selectedProperty?: InputOutputType | null;
  selectedType: string;
  onUpdatingInput?: (id: string, input: InputOutputType) => void;
  onUpdatingOutput?: (id: string, output: InputOutputType) => void;
}

class InputOutputProperties extends React.PureComponent<
  InputOutputPropertiesProps,
  StateTypes
> {
  public constructor(props: InputOutputPropertiesProps) {
    super(props);
    const { selectedProperty } = props;
    this.state = {
      showSubTitle: !!(selectedProperty && selectedProperty.subDatatype),
    };
  }

  public handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const {
      selectedType,
      selectedProperty,
      form,
      onUpdatingInput,
      onUpdatingOutput,
    } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        if (selectedProperty) {
          if (selectedType === 'input') {
            onUpdatingInput &&
              onUpdatingInput(selectedProperty.id, {
                id: selectedProperty.id,
                ...values,
              });
          } else {
            onUpdatingOutput &&
              onUpdatingOutput(selectedProperty.id, {
                id: selectedProperty.id,
                ...values,
              });
          }
        }
      }
    });
  };

  public handleDatatypeChange = (value: string) => {
    if (value === 'array') {
      this.setState({ showSubTitle: true });
    } else {
      this.setState({ showSubTitle: false });
    }
  };

  public handleSubDataTypeChange = () => {};

  public render() {
    const { form, selectedProperty, selectedType } = this.props;
    const { getFieldDecorator } = form;
    const { showSubTitle } = this.state;

    return (
      <React.Fragment>
        <PageHeader
          title={selectedType.toUpperCase()}
          subTitle="Properties of Function"
        />
        <Form onSubmit={this.handleSubmit}>
          <Form.Item style={{ marginBottom: 0 }} label="Name">
            {getFieldDecorator('name', {
              initialValue: selectedProperty ? selectedProperty.name : '',
              rules: [{ required: true, message: 'Please input your note' }],
            })(<Input />)}
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }} label="Datatype">
            {getFieldDecorator('dataType', {
              initialValue:
                selectedProperty && selectedProperty.dataType
                  ? selectedProperty.dataType
                  : '',
              rules: [{ required: true, message: 'Please select Datatype' }],
            })(
              <Select
                placeholder="Please select Datatype"
                onChange={this.handleDatatypeChange}
              >
                <Option value="string">string</Option>
                <Option value="number">number</Option>
                <Option value="boolean">boolean</Option>
                <Option value="array">array</Option>
              </Select>
            )}
          </Form.Item>
          {showSubTitle && (
            <Form.Item style={{ marginBottom: 0 }} label="Sub Datetype">
              {getFieldDecorator('subDatatype', {
                initialValue:
                  selectedProperty && selectedProperty.subDatatype
                    ? selectedProperty.subDatatype
                    : '',
                rules: [
                  { required: true, message: 'Please select sub datatype' },
                ],
              })(
                <Select
                  placeholder="Please select sub datatype"
                  onChange={this.handleSubDataTypeChange}
                >
                  <Option value="string">string</Option>
                  <Option value="number">number</Option>
                  <Option value="boolean">boolean</Option>
                </Select>
              )}
            </Form.Item>
          )}
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          </Form.Item>
        </Form>
      </React.Fragment>
    );
  }
}

const WrappedApp = Form.create<InputOutputPropertiesProps>({
  name: 'cordinated',
})(InputOutputProperties);

export default WrappedApp;
