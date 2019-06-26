import React, { useState, createContext } from 'react';
import uuid from 'uuid/v1';

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

type SelectionMode = 'function' | 'input' | 'output' | 'condition' | 'state';

export const FunctionContext = createContext<{
  inputs: InputOutputType[];
  outputs: InputOutputType[];
  conditions: ConditionType[];
  selectedType: SelectionMode;
  selectedId: string;
  selectedConditionId: string;
  onAddingInput?: () => void;
  onAddingOutput?: () => void;
  onAddingState?: (conditionId: string) => void;
  onAddingCondition?: () => void;
  onUpdatingState?: ({
    conditionId,
    state,
  }: {
    conditionId: string;
    state: State;
  }) => void;
  onUpdateSelectedType?: (
    type: SelectionMode,
    id: string,
    conditionId?: string
  ) => void;
  onUpdatingInput?: (id: string, input: InputOutputType) => void;
  onUpdatingOutput?: (id: string, output: InputOutputType) => void;
  onUpdatingCondition?: (id: string, name: string) => void;
  onDeletingInput?: (id: string) => void;
  onDeletingOutput?: (id: string) => void;
  onDeletingCondition?: (id: string) => void;
  onDeletingState?: (conditionId: string, id: string) => void;
}>({
  inputs: [],
  outputs: [],
  conditions: [],
  selectedType: 'function',
  selectedId: '',
  selectedConditionId: '',
});

const FunctionState = (props: { children: React.ReactNode }) => {
  const [inputs, updateInput] = useState<InputOutputType[]>([]);
  const [outputs, updateOutput] = useState<InputOutputType[]>([]);
  const [conditions, updateCondition] = useState<ConditionType[]>([]);
  const [selectedId, updateSeledctedId] = useState<string>('');
  const [selectedType, updateSelectedType] = useState<SelectionMode>(
    'function'
  );
  const [selectedConditionId, updateSeledctedConditionId] = useState<string>(
    ''
  );

  const onAddingInput = () =>
    updateInput(inputs.concat({ name: `Input ${inputs.length}`, id: uuid() }));
  const onAddingOutput = () =>
    updateOutput(
      outputs.concat({ name: `Output ${outputs.length}`, id: uuid() })
    );
  const onUpdatingInput = (id: string, input: InputOutputType) => {
    const selectedInput = inputs.find(condition => condition.id === id);
    if (selectedInput) {
      const selectedInputIndex = inputs.indexOf(selectedInput);
      const newInputs = [
        ...inputs.slice(0, selectedInputIndex),
        input,
        ...inputs.slice(selectedInputIndex + 1),
      ];
      updateInput(newInputs);
    }
  };
  const onUpdatingOutput = (id: string, output: InputOutputType) => {
    const selectedoutput = outputs.find(output => output.id === id);
    if (selectedoutput) {
      const selectedoutputIndex = outputs.indexOf(selectedoutput);
      const newoutputs = [
        ...outputs.slice(0, selectedoutputIndex),
        output,
        ...outputs.slice(selectedoutputIndex + 1),
      ];
      updateOutput(newoutputs);
    }
  };
  const onUpdatingCondition = (id: string, name: string) => {
    const selectedCondition = conditions.find(condition => condition.id === id);
    if (selectedCondition) {
      const selectedConditionIndex = conditions.indexOf(selectedCondition);
      const newConditions = [
        ...conditions.slice(0, selectedConditionIndex),
        { id, name, states: selectedCondition.states },
        ...conditions.slice(selectedConditionIndex + 1),
      ];
      updateCondition(newConditions);
    }
  };
  const onAddingCondition = () => {
    const newCondition = {
      id: uuid(),
      name: `Condition ${conditions.length}`,
      states: [],
    };
    updateCondition(conditions.concat(newCondition));
  };
  const onUpdatingState = ({
    conditionId,
    state,
  }: {
    conditionId: string;
    state: State;
  }) => {
    const selectedCondition = conditions.find(
      condition => condition.id === conditionId
    );

    if (selectedCondition) {
      const selectedConditionStates = selectedCondition.states;
      const selectedConditionState = selectedConditionStates.find(
        oldState => oldState.id === state.id
      );

      if (selectedConditionState) {
        const selectedConditionStateIndex = selectedConditionStates.indexOf(
          selectedConditionState
        );

        const newStates = [
          ...selectedConditionStates.slice(0, selectedConditionStateIndex),
          state,
          ...selectedConditionStates.slice(selectedConditionStateIndex + 1),
        ];

        selectedCondition.states = newStates;
        const selectedConditionIndex = conditions.indexOf(selectedCondition);
        const newConditions = [
          ...conditions.slice(0, selectedConditionIndex),
          selectedCondition,
          ...conditions.slice(selectedConditionIndex + 1),
        ];
        updateCondition(newConditions);
      }
    }
  };
  const onAddingState = (conditionId: string) => {
    const selectedCondition = conditions.find(
      condition => condition.id === conditionId
    );
    if (selectedCondition) {
      const selectedConditionIndex = conditions.indexOf(selectedCondition);
      const newState = {
        id: uuid(),
        name: `State ${selectedCondition.states.length}`,
        severity: '',
        possibleCause: '',
        suggestedAction: '',
        correctiveAction: '',
        logic: '',
      };
      selectedCondition.states.push(newState);

      const newConditions = [
        ...conditions.slice(0, selectedConditionIndex),
        selectedCondition,
        ...conditions.slice(selectedConditionIndex + 1),
      ];

      updateCondition(newConditions);
    }
  };
  const onUpdateSelectedType = (
    type: SelectionMode,
    id: string,
    conditionId?: string
  ) => {
    updateSelectedType(type);
    updateSeledctedId(id);
    conditionId && updateSeledctedConditionId(conditionId);
  };
  const onDeletingInput = (id: string) => {
    const selectedInput = inputs.find(input => input.id === id);
    if (selectedInput) {
      const selectedInputIndex = inputs.indexOf(selectedInput);
      const newInputs = [
        ...inputs.slice(0, selectedInputIndex),
        ...inputs.slice(selectedInputIndex + 1),
      ];
      updateInput(newInputs);
    }
  };
  const onDeletingOutput = (id: string) => {
    const selectedOutput = outputs.find(output => output.id === id);
    if (selectedOutput) {
      const selectedOutputIndex = outputs.indexOf(selectedOutput);
      const newOutputs = [
        ...outputs.slice(0, selectedOutputIndex),
        ...outputs.slice(selectedOutputIndex + 1),
      ];
      updateOutput(newOutputs);
    }
  };
  const onDeletingCondition = (id: string) => {
    const selectedCondition = conditions.find(condition => condition.id === id);
    if (selectedCondition) {
      const selectedConditionIndex = conditions.indexOf(selectedCondition);
      const newConditions = [
        ...conditions.slice(0, selectedConditionIndex),
        ...conditions.slice(selectedConditionIndex + 1),
      ];
      updateCondition(newConditions);
    }
  };
  const onDeletingState = (conditionId: string, stateId: string) => {
    const selectedCondition = conditions.find(
      condition => condition.id === conditionId
    );
    if (selectedCondition) {
      const selectedConditionStates = selectedCondition.states;
      const selectedConditionState = selectedConditionStates.find(
        oldState => oldState.id === stateId
      );
      if (selectedConditionState) {
        const selectedConditionStateIndex = selectedConditionStates.indexOf(
          selectedConditionState
        );

        const newStates = [
          ...selectedConditionStates.slice(0, selectedConditionStateIndex),
          ...selectedConditionStates.slice(selectedConditionStateIndex + 1),
        ];
        selectedCondition.states = newStates;
        const selectedConditionIndex = conditions.indexOf(selectedCondition);
        const newConditions = [
          ...conditions.slice(0, selectedConditionIndex),
          selectedCondition,
          ...conditions.slice(selectedConditionIndex + 1),
        ];
        updateCondition(newConditions);
      }
    }
  };

  const { children } = props;

  return (
    <FunctionContext.Provider
      value={{
        inputs,
        outputs,
        conditions,
        onAddingInput,
        onAddingOutput,
        onAddingCondition,
        onUpdatingState,
        selectedType,
        selectedId,
        onUpdateSelectedType,
        onUpdatingInput,
        onUpdatingOutput,
        onUpdatingCondition,
        onAddingState,
        selectedConditionId,
        onDeletingInput,
        onDeletingState,
        onDeletingCondition,
        onDeletingOutput,
      }}
    >
      {children}
    </FunctionContext.Provider>
  );
};

export default FunctionState;
