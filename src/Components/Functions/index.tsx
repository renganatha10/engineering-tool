import React from 'react';
import styled from 'styled-components';
import { Draggable, Droppable } from 'react-beautiful-dnd';

import FunctionBlock from './../FunctionBlock';

interface FunctionType {
  name: string;
  numberOfInputs: number;
  numberOfOutputs: number;
  id: string;
}

interface Props {
  functions: FunctionType[];
}

const Wrapper = styled.div`
  overflow: scroll;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const SVG_SIZE = 200;

const Functions = (props: Props) => {
  const { functions } = props;

  return (
    <Wrapper>
      <Droppable droppableId={'functionsdroppble'}>
        {provideddd => {
          return (
            <div ref={provideddd.innerRef}>
              {functions.map((func, index) => {
                const inputVarient = 100 / func.numberOfInputs;
                const outPutVarient = 100 / func.numberOfOutputs;
                return (
                  <Draggable index={index} draggableId={func.id} key={func.id}>
                    {provided => {
                      return (
                        <div
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                        >
                          <svg
                            height={SVG_SIZE}
                            width={SVG_SIZE}
                            strokeWidth={1}
                          >
                            <FunctionBlock
                              name={func.name}
                              numberOfInputs={func.numberOfInputs}
                              numberOfOutputs={func.numberOfOutputs}
                              inputVariant={inputVarient}
                              outputVariant={outPutVarient}
                            />
                          </svg>
                        </div>
                      );
                    }}
                  </Draggable>
                );
              })}
            </div>
          );
        }}
      </Droppable>
    </Wrapper>
  );
};

export default Functions;
