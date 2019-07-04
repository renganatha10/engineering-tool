import React, { useState, useCallback, useContext } from 'react';
import styled from 'styled-components';
import { Button } from 'antd';
import uuid from 'uuid/v4';

import { FunctionContext } from './../../../Contexts/FunctionStoreContext';
import { FunctionsContext } from './../../../Contexts/FunctionsStoreContext';

import FunctionCreation from './../../FunctionCreation';
import Functions from './Functions';

const RightBarWrapper = styled.div`
  right: 0;
  position: absolute;
  top: 0;
  bottom: 0;
  width: 150px;
  background-color: white;
  box-shadow: -6px 2px 9px -5px rgba(0, 0, 0, 0.5);
  overflow-y: scroll;
  padding: 10px;
`;

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: 10px;
  border-bottom: 1px solid black;
`;

const RightBar = () => {
  const { inputs, outputs, conditions, resetAll } = useContext(FunctionContext);
  const { functions, onAddingFunction } = useContext(FunctionsContext);

  const [isCreateFunctionVisible, toggleCreateFunctionVisible] = useState<
    boolean
  >(false);

  const onFuntionCreation = useCallback(
    (name: string) => {
      const newFunc = {
        inputs,
        outputs,
        conditions,
        id: uuid(),
        name,
      };
      onAddingFunction && onAddingFunction(newFunc);
      resetAll && resetAll();
      toggleCreateFunctionVisible(false);
    },
    [inputs, outputs, conditions, onAddingFunction, resetAll]
  );

  const showFunctionCreation = useCallback(() => {
    toggleCreateFunctionVisible(true);
  }, []);

  const hideFunctionCreate = React.useCallback(() => {
    resetAll && resetAll();
    toggleCreateFunctionVisible(false);
  }, [resetAll]);

  const modifiedFunctions = functions.map(func => ({
    name: func.name,
    numberOfInputs: func.inputs.length,
    numberOfOutputs: func.outputs.length,
    id: func.id,
  }));

  if (isCreateFunctionVisible) {
    return (
      <FunctionCreation
        onClose={hideFunctionCreate}
        onCreateFuntion={onFuntionCreation}
      />
    );
  }

  return (
    <RightBarWrapper>
      <ButtonContainer>
        <Button
          onClick={showFunctionCreation}
          type="danger"
          shape="circle"
          icon="plus"
        />
      </ButtonContainer>
      <Functions data={modifiedFunctions} />
    </RightBarWrapper>
  );
};

export default RightBar;
