import React, { useState, createContext } from 'react';

interface State {
  name: string;
  severity: string;
  possibleCause: string;
  suggestedAction: string;
  correctiveAction: string;
  logic: string;
  id: string;
}

interface InputOutputType {
  name: string;
  id: string;
  dataType?: string;
  subDatatype?: string;
}

interface ConditionType {
  name: string;
  states: State[];
  id: string;
}

interface Function {
  inputs: InputOutputType[];
  outputs: InputOutputType[];
  conditions: ConditionType[];
  id: string;
  name: string;
}

export interface FunctionContextType {
  functions: Function[];
  onAddingFunction?: (func: Function) => void;
}

export const FunctionsContext = createContext<FunctionContextType>({
  functions: [],
});

const FunctionState = (props: { children: React.ReactNode }) => {
  const [functions, addFunction] = useState<Function[]>([]);

  const onAddingFunction = (func: Function) => {
    const newFunctions = functions.concat(func);
    addFunction(newFunctions);
  };

  const { children } = props;

  return (
    <FunctionsContext.Provider value={{ functions, onAddingFunction }}>
      {children}
    </FunctionsContext.Provider>
  );
};

export default FunctionState;
