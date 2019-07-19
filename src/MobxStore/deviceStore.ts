import { types } from 'mobx-state-tree';

export const BasicDevice = types.model('BasicDevice', {
  id: types.identifier,
  name: types.string,
  inputs: types.optional(types.array(types.string), []),
  outputs: types.array(types.string),
});

export const ComplexDevice = types.model('ComplexDevice', {
  basicDevices: types.array(types.safeReference(BasicDevice)),
  id: types.identifier,
  name: types.string,
});

export const Plants = types.model('Plants', {
  id: types.identifier,
  name: types.string,
  plantArea: types.array(types.string),
  basicDevices: types.array(types.safeReference(BasicDevice)),
  complexDevices: types.array(types.safeReference(ComplexDevice)),
});

const Devices = types
  .model('Devices', {
    basicDevices: types.array(BasicDevice),
    complexDevices: types.array(ComplexDevice),
    plants: types.array(Plants),
  })
  .actions(self => {
    const addBasicDevice = (newDevice: typeof BasicDevice.Type) => {
      self.basicDevices.push(newDevice);
    };

    const addComplexDevice = (newDevice: typeof ComplexDevice.Type) => {
      //@ts-ignore
      self.complexDevices.push(newDevice);
    };

    const addPlant = (newPlant: typeof Plants.Type) => {
      //@ts-ignore
      self.plants.push(newPlant);
    };

    return {
      addBasicDevice,
      addComplexDevice,
      addPlant,
    };
  });

export default Devices;
