import { types } from 'mobx-state-tree';

import Connection from './connection';
import Input from './input';
import Output from './output';

const Node = types
  .model('Node', {
    name: types.string,
    id: types.identifier,
    numberOfInputs: types.number,
    numberOfOutput: types.number,
    connections: types.array(Connection),
    x: types.number,
    y: types.number,
    height: types.number,
    width: types.number,
    inputs: types.array(Input),
    outputs: types.array(Output),
  })
  .actions(() => {
    const makeConnection = () => {};

    return {
      makeConnection,
    };
  });

const NodeStore = types.model('NodeStore', {
  nodes: types.map(Node),
});

export default NodeStore;
