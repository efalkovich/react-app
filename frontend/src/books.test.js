import { render, screen } from '@testing-library/react';
import { objsToOpts, Book } from './components/books';
import '@testing-library/jest-dom/extend-expect';

test("objsToOpts", () => {
	let vals = [
        {
            name: "name",
            id: 2,
            full_name: "full_name"
        },
        {
            name: "name2",
            id: 3,
            full_name: "full_name2"
        }
    ];
	let res = [
        {
            value: 2,
            label: "name"
        },
        {
            value: 3,
            label: "name2"
        }
    ];
	expect(objsToOpts(vals)).toEqual(res);
	vals = [];
	res = [];
	expect(objsToOpts(vals)).toEqual(res);
});

test('Book', () => {
    let id = 0;
	let name = "War and Piece";
    let lang = {
        name: "ru",
        full_name: "russian"
    }
    let status = "planned";
    let year = 2001;
    let authors = [{
        id: 1,
        name: "Tolstoi",
        bday: "2022-12-12",
        bio: "very good author",
        langs: [
            {
                name: "ru",
                full_name: "russian"
            }
        ]
    }];

	render(<Book id={id} name={name} authors={authors} lang={lang.name} year={year} status="planned"/>);

	const nameEl = screen.getByText(/War and Piece/i);
	expect(nameEl).toBeInTheDocument();

	const statEl = screen.getByText(/Не прочитана/i);
	expect(statEl).toBeInTheDocument();
});