import './App.css';
import AsyncSelect from "react-select/async";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { BooksPage } from './components/books';
import { AuthorsPage } from './components/authors';
import React, { useState, useMemo, useRef, useEffect } from "react";
import {ToastContainer, toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export const UserAddBookContext = React.createContext();
export const UserAddAuthorContext = React.createContext();

const getAddingBook = () => {
  const book = JSON.parse(localStorage.getItem('bookData'));
  console.log(book);

  const initialValue = {
    name: null,
    year_publication: null,
    authors: null,
    status: null,
    lang: null
  };
  return book || initialValue;
}

const getAddingAuthor = () => {
  const author = JSON.parse(localStorage.getItem('authorData'));
  console.log(author);

  const initialValue = {
    name: null,
    bio: null,
    bday: null,
    langs: null
  };
  return author || initialValue;
}

export const UserAddBookProvider = (props) => {
  const [bookData, setBookData] = useState(getAddingBook);

  useEffect(() => {
    localStorage.setItem('bookData', JSON.stringify(bookData))
  }, [bookData]);

  return (
    <UserAddBookContext.Provider value={[bookData, setBookData]}>
      {props.children}
    </UserAddBookContext.Provider>
  )
}

export const UserAddAuthorProvider = (props) => {
  const [authorData, setAuthorData] = useState(getAddingAuthor);

  useEffect(() => {
    localStorage.setItem('authorData', JSON.stringify(authorData))
  }, [authorData]);

  return (
    <UserAddAuthorContext.Provider value={[authorData, setAuthorData]}>
      {props.children}
    </UserAddAuthorContext.Provider>
  )
}

export const useUserAddBook = () => React.useContext(UserAddBookContext);
export const useUserAddAuthor = () => React.useContext(UserAddAuthorContext);

export const Popup = (props) => {
  return (
    <div>
      <a className={props.active ? "popup active" : "popup"} onClick={() => { props.setActive(false); if(props.setBookId) props.setBookId(null);}}></a>
      <div className="popupBlock">
        <div className={props.active ? "popup_content active" : "popup_content"}>
          {props.children}
        </div>
      </div>
    </div>
  );
}

export const Button = (props) => {
  return (
    <a className="headerBtn editAddBtn" href={props.href} onClick={props.onClick}>
      {props.children}
    </a>
  );
};

export const Filter = (props) => {

  let filter;

  let statusOpts = [
    {value: "planned", label: "Не прочитана"},
    {value: "read", label: "Прочитана"}
  ];

  if(props.type == "Authors")
  {
    filter = 
      <div className="filterInputs">
        <input type="text" placeholder="Имя" onInput={e => props.setName(e.target.value)}/>
      </div>
  } else if(props.type == "Books") {
    filter = 
      <div className="filterInputs">
        <input type="text" placeholder="Название" onInput={e => props.setName(e.target.value)}/>
        <input type="text" placeholder="Год публикации" onInput={e => props.setYear(e.target.value)}/>
        <AsyncSelect placeholder="Автор" isClearable onChange={e => props.setAuth(e ? e.value : null)} loadOptions={props.loadAuthOpts} defaultOptions/>
        <AsyncSelect placeholder="Статус" isClearable onChange={e => props.setStatus(e ? e.value : null)} defaultOptions={statusOpts}/>
        <AsyncSelect placeholder="Язык" isClearable onChange={e => props.setLang(e ? e.label : null)} loadOptions={props.loadLangOpts} defaultOptions/>
      </div>
  }

  return (
    <div className="filter">
      <h2>{props.filterName}</h2>
      {filter}
    </div>
  );
};

export const Header = () => {
  return (
    <header>
      <Button href="./books">Книги</Button>
      <Button href="./authors">Авторы</Button>
    </header>
  )
}

const EmptyPage = (props) => {
  return (
    <div>
      <Header/>
    </div>
  )
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <EmptyPage/>,
  },
	{
		path: "/books",
		element: <BooksPage/>,
	},
  {
    path: "/authors",
    element: <AuthorsPage/>
  }
]);

function App() {
  return (
    <div className="App">
      <UserAddAuthorProvider>
        <UserAddBookProvider>
          <RouterProvider router={router}/>
          <ToastContainer theme="colored"/>
        </UserAddBookProvider>
      </UserAddAuthorProvider>
    </div>
  );
}

export default App;
