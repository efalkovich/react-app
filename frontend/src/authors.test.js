import { render, screen } from '@testing-library/react';
import { isURI, findLangs, Author } from './components/authors';
import '@testing-library/jest-dom/extend-expect';

test("isURI", () => {
	expect(isURI("i love web")).toEqual(false);
	expect(isURI("https://en.wikipedia.org/wiki/Elon_Musk")).toEqual(true);
	expect(isURI("http://google.com")).toEqual(true);
});

test("findLangs", () => {
	let lang = [
        {
            value: "ru",
            label: "russia"
        },
        {
            value: "en",
            label: "english"
        }
    ];
	let langs = [
        {
            name: "ru",
            full_name: "russia"
        },
        {
            name: "sp",
            full_name: "spain"
        },
        {
            name: "en",
            full_name: "english"
        }
    ];
    let res = [
        {
            name: "ru",
            full_name: "russia"
        },
        {
            name: "en",
            full_name: "english"
        }
    ];
	expect(findLangs(lang, langs)).toEqual(res);
});

test('Author', () => {
    let author = {
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
    };

	render(<Author id={author.id} name={author.name} bday={author.bday} langs={author.langs} bio={author.bio} setIRI={()=>{}} popupQrActive={()=>{}} />);

	const nameEl = screen.getByText(/Tolstoi/i);
	expect(nameEl).toBeInTheDocument();

	const bioEl = screen.getByText(/very good author/i);
	expect(bioEl).toBeInTheDocument();
});