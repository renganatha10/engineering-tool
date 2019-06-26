import React from 'react';
import FunctionModal from './Form';

interface CollectionProps {
  isFunctionModalVisible: boolean;
  onCancel: () => void;
  onCreate: (name: string) => void;
}

class CollectionsPage extends React.PureComponent<CollectionProps> {
  public handleCancel = () => {
    const { onCancel } = this.props;
    onCancel();
  };

  public handleCreate = (name: string) => {
    const { onCreate } = this.props;
    onCreate(name);
  };

  public render() {
    const { isFunctionModalVisible } = this.props;
    return (
      <FunctionModal
        onCreate={this.handleCreate}
        onCancel={this.handleCancel}
        visible={isFunctionModalVisible}
      />
    );
  }
}

export default CollectionsPage;
