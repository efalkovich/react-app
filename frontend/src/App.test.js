import { render, screen } from '@testing-library/react';
import { Button } from './App';
import '@testing-library/jest-dom/extend-expect';

test('Button', () => {
	render(
	<Button href="" onClicl={() => {}}>
		Кнопка
	</Button>
	);

	const nameEl = screen.getByText(/Кнопка/i);
	expect(nameEl).toBeInTheDocument();
});
