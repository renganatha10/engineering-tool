import React, { useState, useEffect, createContext } from 'react';

export interface Device {
  numberOfInputs: number;
  numberOfOutputs: number;
  id: string;
  name: string;
}

export interface DeviceContextType {
  devices: Device[];
  onAddingDevices?: (device: Device) => void;
}

interface Props {
  children: React.ReactNode;
  initDevices: Device[];
}

export const DevicesContext = createContext<DeviceContextType>({
  devices: [],
});

const DevicesState = (props: Props) => {
  const { children, initDevices } = props;
  const [devices, addDevice] = useState<Device[]>(initDevices);

  useEffect(() => {
    window.localStorage.setItem('devices', JSON.stringify(devices));
  }, [devices]);

  const onAddingDevices = (device: Device) => {
    const newDevices = devices.concat(device);
    addDevice(newDevices);
  };

  return (
    <DevicesContext.Provider value={{ devices, onAddingDevices }}>
      {children}
    </DevicesContext.Provider>
  );
};

export default DevicesState;
