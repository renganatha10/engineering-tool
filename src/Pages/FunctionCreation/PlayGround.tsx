import React, { useContext } from 'react';
import styled from 'styled-components';

import { FunctionContext } from './../../Context/FunctionStoreContext';
import InputOutputBtn from './InputOutput';
import Condition from './Condition';
import State from './State';

type SelectionMode = 'function' | 'input' | 'output' | 'condition' | 'state';

const Wrapper = styled.div`
  display: flex;
  flex: 0.65;
  padding: 20px;
`;

const InnerWrapper = styled.div`
  background-color: #f5f5f5;
  height: 100%;
  width: 100%;
  overflow: scroll;
`;

const FunctionCreationPlayGround = () => {
  const {
    inputs,
    outputs,
    conditions,
    onAddingInput,
    onAddingOutput,
    onUpdateSelectedType,
    onAddingCondition,
    onDeletingInput,
    onDeletingState,
    onDeletingCondition,
    onDeletingOutput,
  } = useContext(FunctionContext);

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('id');
    if (id === 'input') {
      onAddingInput && onAddingInput();
    } else if (id === 'output') {
      onAddingOutput && onAddingOutput();
    } else if (id === 'condition') {
      onAddingCondition && onAddingCondition();
    }
  };

  const onDelItem = (id: string, type: SelectionMode, conditionId?: string) => {
    if (type === 'input') {
      onDeletingInput && onDeletingInput(id);
    } else if (type === 'output') {
      onDeletingOutput && onDeletingOutput(id);
    } else if (type === 'condition') {
      onDeletingCondition && onDeletingCondition(id);
    } else if (type === 'state') {
      onDeletingState && conditionId && onDeletingState(conditionId, id);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onInputBtnClick = (
    id: string,
    type: SelectionMode,
    conditionId?: string
  ) => {
    onUpdateSelectedType && onUpdateSelectedType(type, id, conditionId);
  };

  return (
    <Wrapper>
      <InnerWrapper onDragOver={onDragOver} onDrop={onDrop}>
        {inputs.map(input => (
          <InputOutputBtn
            key={input.id}
            isInput={true}
            onClick={onInputBtnClick}
            {...input}
            onDelClick={onDelItem}
          />
        ))}
        {conditions.map(condition => (
          <React.Fragment key={condition.id}>
            <Condition
              onClick={onInputBtnClick}
              name={condition.name}
              id={condition.id}
              onDelClick={onDelItem}
            />
            {condition.states.map(state => (
              <State
                key={state.id}
                onClick={onInputBtnClick}
                id={state.id}
                name={state.name}
                conditionId={condition.id}
                onDelClick={onDelItem}
              />
            ))}
          </React.Fragment>
        ))}
        {outputs.map(output => (
          <InputOutputBtn
            key={output.id}
            isInput={false}
            onClick={onInputBtnClick}
            {...output}
            onDelClick={onDelItem}
          />
        ))}
      </InnerWrapper>
    </Wrapper>
  );
};

export default FunctionCreationPlayGround;
