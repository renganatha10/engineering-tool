import { types } from 'mobx-state-tree';

interface BasicType {
  id: string;
  name: string;
  inputs: string[];
  outputs: string[];
}

interface ComplexType {
  basicDevices: BasicType[];
  id: string;
  name: string;
}

interface PlantType {
  id: string;
  name: string;
  plantArea: string[];
  basicDevices: BasicType[];
  complexDevices: ComplexType[];
}

const BasicDevice = types.model('BasicDevice', {
  id: types.identifier,
  name: types.string,
  inputs: types.optional(types.array(types.string), []),
  outputs: types.array(types.string),
});

const ComplexDevice = types.model('ComplexDevice', {
  basicDevices: types.array(types.safeReference(BasicDevice)),
  id: types.identifier,
  name: types.string,
});

const Plants = types.model('Plants', {
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
    const addBasicDevice = (newDevice: BasicType) => {
      self.basicDevices.push(newDevice);
    };

    const addComplexDevice = (newDevice: ComplexType) => {
      //@ts-ignore
      self.complexDevices.push(newDevice);
    };

    const addPlant = (newPlant: PlantType) => {
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
