import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import Condition from '../Condition';

afterEach(cleanup);

test('<Condition />', async () => {
  const handleClick = jest.fn();
  const handleDelClick = jest.fn();

  const { getByTestId } = render(
    <Condition
      id={'id of what'}
      name={'COndiiton'}
      onDelClick={handleDelClick}
      onClick={handleClick}
    />
  );

  fireEvent.click(getByTestId('btn'));
  fireEvent.click(getByTestId('delBtn'));

  expect(getByTestId('btn').innerHTML).toBe('<span>COndiiton</span>');
  expect(handleDelClick).toBeCalledTimes(1);
  expect(handleDelClick).toBeCalledTimes(1);
});
