import React from 'react';
import { FormComponentProps } from 'antd/lib/form';
import uuid from 'uuid/v1';
import FunctionModal from './Form';

interface FunctionType {
  name: string;
  numberOfInputs: number;
  numberOfOutputs: number;
  id: string;
}

interface CollectionProps {
  isFunctionModalVisible: boolean;
  onCancel: () => void;
  onCreate: (func: FunctionType) => void;
}

class CollectionsPage extends React.PureComponent<CollectionProps> {
  public formRef: null | { props: object } = null;

  public handleCancel = () => {
    const { onCancel } = this.props;
    onCancel();
  };

  public handleCreate = () => {
    const { onCreate } = this.props;
    if (this.formRef) {
      const { form } = this.formRef.props as FormComponentProps;
      form.validateFields((err, values) => {
        if (err) {
          return;
        }
        const { name, input, output } = values;
        onCreate({
          id: uuid(),
          name,
          numberOfInputs: input,
          numberOfOutputs: output,
        });
        form.resetFields();
      });
    }
  };

  public saveFormRef = (formRef: { props: FormComponentProps }) => {
    this.formRef = formRef;
  };

  public render() {
    const { isFunctionModalVisible } = this.props;
    return (
      <FunctionModal
        onCreate={this.handleCreate}
        wrappedComponentRef={this.saveFormRef}
        onCancel={this.handleCancel}
        visible={isFunctionModalVisible}
      />
    );
  }
}

export default CollectionsPage;
