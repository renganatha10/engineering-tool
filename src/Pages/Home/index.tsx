import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';

import AppLayout from './../../Components/AppLayout';
import FunctionBlock from './FunctionBlock';

import GlobalStyles from './../../Utils/globalStyles';

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const function1 = {
  id: '1',
  name: 'Sum 1',
  numberOfInputs: 3,
  numberOfOutputs: 1,
};
const function2 = {
  id: '2',
  name: 'Sum 2',
  numberOfInputs: 1,
  numberOfOutputs: 2,
};
const function3 = {
  id: '3',
  name: 'Sum 3',
  numberOfInputs: 4,
  numberOfOutputs: 3,
};
const function4 = {
  id: '4',
  name: 'Sum 4',
  numberOfInputs: 3,
  numberOfOutputs: 1,
};
const function5 = {
  id: '5',
  name: 'Sum 5',
  numberOfInputs: 4,
  numberOfOutputs: 4,
};

const funcs = [function4, function2, function3, function1, function5];

const connections = [
  { functionId: '1', sources: [], output: ['O1'] },
  { functionId: '2', sources: ['O1'], output: ['O2', 'O3'] },
  { functionId: '3', sources: ['O2', 'O1', 'O3'], output: ['O4', 'O5', 'O6'] },
  { functionId: '4', sources: ['O5', 'O6', 'O4'], output: ['O7'] },
  { functionId: '5', sources: ['O7'], output: ['O8'] },
];

const Home = () => {
  return (
    <React.Fragment>
      <GlobalStyles />
      <AppLayout>
        <Droppable droppableId={'editor'}>
          {provided => {
            return (
              <Wrapper ref={provided.innerRef}>
                <svg
                  id={'someSvgElementId'}
                  width="1300"
                  height="1300"
                  style={{ backgroundColor: 'white' }}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {connections
                    .map((connection, index) => {
                      const func = funcs.find(
                        item => item.id === connection.functionId
                      );

                      if (func) {
                        const { name, numberOfInputs, numberOfOutputs } = func;
                        const inputVarient = 100 / func.numberOfInputs;
                        const outPutVarient = 100 / func.numberOfOutputs;
                        const rectYVariant = Math.floor(index / 4);
                        return (
                          <FunctionBlock
                            key={`conneciton${index}`}
                            name={name}
                            numberOfInputs={numberOfInputs}
                            numberOfOutputs={numberOfOutputs}
                            inputVariant={inputVarient}
                            outputVariant={outPutVarient}
                            rectX={102.5 + (index - 4 * rectYVariant) * 295}
                            rectY={100 + rectYVariant * 220}
                            lineX={72.5 + (index - 4 * rectYVariant) * 295}
                          />
                        );
                      }
                    })
                    .filter(item => item)}
                </svg>
              </Wrapper>
            );
          }}
        </Droppable>
      </AppLayout>
    </React.Fragment>
  );
};

export default Home;
