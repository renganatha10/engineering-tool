import { types } from 'mobx-state-tree';

const InputSource = types.model('InputSource', {
  id: types.identifier,
  name: types.string,
});

export default InputSource;
