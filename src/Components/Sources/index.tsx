import React from 'react';
import styled from 'styled-components';

interface Props {
  sources: string[];
}

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const Sources = (props: Props) => {
  const { sources } = props;
  return (
    <Wrapper>
      {sources.map((source, index) => (
        <svg height={40} width={40} key={`source${index}`}>
          <text x="20" y="15" textAnchor={'middle'} stroke="black">
            {source}
          </text>
          <circle r={10} cx={20} cy={30} />
        </svg>
      ))}
    </Wrapper>
  );
};

export default Sources;
