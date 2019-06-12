import { types } from 'mobx-state-tree';
import InputSource from './input';
import OutputSource from './output';

const Connection = types.model('Connection', {
  id: types.identifier,
  name: types.string,
  mx: types.number,
  my: types.number,
  lx: types.number,
  ly: types.number,
  inputSource: InputSource,
  outputSource: OutputSource,
});

export default Connection;
