import { types } from 'mobx-state-tree';

interface DeviceType {
  id: string;
  name: string;
  // position: {
  //   x: number;
  //   y: number;
  // };
  // data: any;
  // isDevice: boolean;
  inputs: string[];
  outputs: string[];
}

interface ComplexType {
  devices: DeviceType[];
  id: string;
  name: string;
  inputs: string[];
  outputs: string[];
  // position: {
  //   x: number;
  //   y: number;
  // };
  // data: any;
  // isDevice: boolean;
}

interface PlantType {
  plantName: string;
  plantArea: string[];
  devices: DeviceType[];
  complexDevices: ComplexType[];
}

// const PositionXY = types.model('PostionXY', {
//   x: types.number,
//   y: types.number,
// });

// const Data = types.model('Data', {
//   id: types.identifier,
//   nodeId: types.identifier,
// });

const BasicDevice = types.model('BasicDevice', {
  id: types.identifier,
  name: types.string,
  // position: types.maybe(PositionXY),
  // data: types.maybe(Data),
  // isDevice: types.boolean,
  inputs: types.optional(types.array(types.string), []),
  outputs: types.array(types.string),
});

const ComplexDevice = types.model('ComplexDevice', {
  basicDevices: types.array(BasicDevice),
  id: types.identifier,
  name: types.string,
  // position: types.maybe(PositionXY),
  // data: types.maybe(Data),
  // isDevice: types.boolean,
  inputs: types.optional(types.array(types.string), []),
  outputs: types.array(types.string),
});

const Plants = types.model('Plants', {
  plantName: types.string,
  plantArea: types.array(types.string),
  basicDevices: types.array(BasicDevice),
  complexDevices: types.array(ComplexDevice),
});

const Devices = types
  .model('Devices', {
    basicDevices: types.array(BasicDevice),
    complexDevices: types.array(ComplexDevice),
    plants: types.array(Plants),
  })
  .actions(self => {
    const addBasicDevice = (newDevice: DeviceType) => {
      self.basicDevices.push(newDevice);
    };

    const addComplexDevice = (newDevice: ComplexType) => {
      self.complexDevices.push(newDevice);
    };

    return {
      addBasicDevice,
      addComplexDevice,
    };
  });

export default Devices;
