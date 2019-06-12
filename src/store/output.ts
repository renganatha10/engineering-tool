import { types } from 'mobx-state-tree';

const OutputSource = types.model('OutputSource', {
  id: types.identifier,
  name: types.string,
});

export default OutputSource;
