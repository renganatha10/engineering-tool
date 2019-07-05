import React from 'react';
import styled from 'styled-components';

import { FunctionContext } from '../../../../Contexts/FunctionStoreContext';
import InputProperties from './InputProperties';
import ConditionProperties from './ConditionProperties';
import StateProperties from './StateProperties';

const Wrapper = styled.div`
  flex: 0.25;
  border-left: 1px solid #1890ff;
  border-right: 1px solid #1890ff;
  padding: 10px;
`;

interface StateTypes {
  showSubTitle: boolean;
}

class FunctionCreationRightBar extends React.PureComponent<{}, StateTypes> {
  public render() {
    return (
      <Wrapper>
        <FunctionContext.Consumer>
          {({
            onUpdatingOutput,
            onUpdatingInput,
            inputs,
            outputs,
            selectedType,
            selectedId,
            conditions,
            selectedConditionId,
            onAddingState,
            onUpdatingCondition,
            onUpdatingState,
          }) => {
            if (selectedType === 'input' || selectedType === 'output') {
              let selectedProperty = null;

              if (selectedType === 'input') {
                selectedProperty = inputs.find(
                  input => input.id === selectedId
                );
              } else if (selectedType === 'output') {
                selectedProperty = outputs.find(
                  output => output.id === selectedId
                );
              }

              return (
                <InputProperties
                  selectedType={selectedType}
                  selectedProperty={selectedProperty}
                  onUpdatingInput={onUpdatingInput}
                  onUpdatingOutput={onUpdatingOutput}
                  key={selectedProperty ? selectedProperty.id : 'somethingels'}
                />
              );
            } else if (selectedType === 'condition') {
              const selectedProperty = conditions.find(
                input => input.id === selectedId
              );
              return (
                <ConditionProperties
                  onUpdatingCondition={onUpdatingCondition}
                  onAddingState={onAddingState}
                  selectedProperty={selectedProperty}
                />
              );
            } else if (selectedType === 'state') {
              const selectedCondition = conditions.find(
                input => input.id === selectedConditionId
              );

              if (selectedCondition) {
                const selectedProperty = selectedCondition.states.find(
                  state => state.id === selectedId
                );

                return (
                  <StateProperties
                    conditionId={selectedConditionId}
                    selectedProperty={selectedProperty}
                    onUpdateState={onUpdatingState}
                    key={selectedId}
                  />
                );
              }
            }
            return null;
          }}
        </FunctionContext.Consumer>
      </Wrapper>
    );
  }
}

export default FunctionCreationRightBar;
