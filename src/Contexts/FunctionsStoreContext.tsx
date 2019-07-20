import React, { useState, useEffect, createContext } from 'react';

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

export interface Function {
  inputs: InputOutputType[];
  outputs: InputOutputType[];
  conditions: ConditionType[];
  id: string;
  name: string;
  modelId: string;
}

interface Props {
  children: React.ReactNode;
  initFunctions: Function[];
}

export interface FunctionContextType {
  functions: Function[];
  onAddingFunction?: (func: Function) => void;
}

export const FunctionsContext = createContext<FunctionContextType>({
  functions: [],
});

const FunctionState = (props: Props) => {
  const { children, initFunctions } = props;
  const [functions, addFunction] = useState<Function[]>(initFunctions);

  useEffect(() => {
    window.localStorage.setItem('functions', JSON.stringify(functions));
  }, [functions]);

  const onAddingFunction = (func: Function) => {
    const newFunctions = functions.concat(func);
    addFunction(newFunctions);
  };

  return (
    <FunctionsContext.Provider value={{ functions, onAddingFunction }}>
      {children}
    </FunctionsContext.Provider>
  );
};

export default FunctionState;
