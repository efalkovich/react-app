import react, { useEffect, useState, useContext } from "react";
import { Header, Filter, Button, Popup } from "../App";
import AsyncSelect from "react-select/async";
import pencil from "./pencil.svg";
import trashCan from "./trashCan.svg";
import axios from "axios";
import { useUserAddBook } from "../App";
import './books.css';
import { toast } from "react-toastify";


let api = axios.create({
    baseURL: "http://localhost:5435/",
    timeout: 1000
});

export function objsToOpts(objs) {
    if(!objs) {
        return [];
    }
    return objs.map(ob => { return {value: ob.id, label: ob.name};});
}

export const BooksPage = () => {
    const [popupEditActive, setPopupEditActive] = useState(false);
    const [popupAddActive, setPopupAddActive] = useState(false);
    const [popupDeleteActive, setPopupDeleteActive] = useState(false);
    const [bookId, setBookId] = useState(null);
    const [bookName, setBookName] = useState(null);
    const [books, setBooks] = useState(null);
    const [authors, setAuthors] = useState(null);
    const [filter, setFilter] = useState(
        {
            lang_name: null,
            status: null,
            author_id: null,
            name: null,
            year_publication: null
        }
    );

    if(books == null)
        getBooks();

    function getBooks() {
        let req = api.get("/api/v1/book", {params: filter});
        req.then(res => { console.log(res.data); setBooks(res.data); });
    }

    useEffect(() => {
        getBooks();
    }, [filter])

    function setLang(name) {
        setFilter({
            lang_name: name != '' ? name : null,
            status: filter.status,
            author_id: filter.author_id,
            name: filter.name,
            year_publication: filter.year_publication
        });
    }
    function setStatus(stat) {
        setFilter({
            lang_name: filter.langName,
            status: stat != '' ? stat : null,
            author_id: filter.author_id,
            name: filter.name,
            year_publication: filter.year_publication
        });
    }
    function setAuthId(auth) {
        setFilter({
            lang_name: filter.langName,
            status: filter.status,
            author_id: auth != '' ? auth : null,
            name: filter.name,
            year_publication: filter.year_publication
        });
    }
    function setName(name) {
        setFilter({
            lang_name: filter.langName,
            status: filter.status,
            author_id: filter.author_id,
            name: name != '' ? name : null,
            year_publication: filter.year_publication
        });
    }
    function setPubl(year) {
        setFilter({
            lang_name: filter.langName,
            status: filter.status,
            author_id: filter.author_id,
            name: filter.name,
            year_publication: year != '' ? year : null
        });
    }

    function loadAuthorsOpts(inputValue, callback) {
        let req = api.get("/api/v1/authors");
        req.then(res => { setAuthors(res.data); callback(objsToOpts(res.data)); });
    }

    function loadLangOpts(inputValue, callback) {
        let req = api.get("/api/v1/langs");
        req.then(res => { callback(res.data.map(ob => { return {value: ob.full_name, label: ob.name};})); });
    }

    return (
        <div >
            <Header/>
            <hr/>
            <Filter filterName="Фильтр по книгам" type="Books"
                loadAuthOpts={loadAuthorsOpts} loadLangOpts={loadLangOpts}
                setName={setName} setYear={setPubl} setAuth={setAuthId} setStatus={setStatus} setLang={setLang}/>
            <div className="AllBlock">
                <div className="booksBl">
                    <Button onClick={() => setPopupAddActive(true)}>Добавить новую книгу</Button>
                    <div className="booksBlock">
                        {
                        books != null && books.Count != 0
                            ? books.map((b) => <Book setBookName={setBookName} setBookId={setBookId} popupDeleteActive={setPopupDeleteActive} popupEditActive={setPopupEditActive} key={b.id} id={b.id} name={b.name} authors={b.authors} lang={b.lang.name} year={b.year_publication} status={b.status}/>)
                            : <p>Книг нет</p>
                        }
                    </div>
                </div>
            </div>
            <Popup setBookId={setBookId} active={popupEditActive} setActive={setPopupEditActive}>
                <ChangeBookForm getBooks={getBooks} setBookId={setBookId} authors={authors} loadAuthOpts={loadAuthorsOpts} loadLangOpts={loadLangOpts} setPopupActive={setPopupEditActive} bookName={bookName} bookId={bookId}/>
            </Popup>
            <Popup active={popupAddActive} setActive={setPopupAddActive}>
                <AddBookForm setBookId={(id) => {}} getBooks={getBooks} authors={authors} loadAuthOpts={loadAuthorsOpts} loadLangOpts={loadLangOpts} setPopupActive={setPopupAddActive}/>
            </Popup>
            <Popup active={popupDeleteActive} setActive={setPopupDeleteActive}>
                <DeleteBookForm bookName={bookName} bookId={bookId} setBookId={setBookId} getBooks={getBooks} setPopupActive={setPopupDeleteActive}/>
            </Popup>
        </div>
    );
};

export const ChangeBookForm = (props) => {

    const [bookData, setBookData] = useState(null);

    function getBook () {
        let req = api.get("/api/v1/book/" + props.bookId);
        req.then(res => { console.log(res.data); setBookData(res.data); });
    }

    function changeBook() {
        api.put("/api/v1/book/" + props.bookId, bookData).then(
            (req) => {
                console.log(bookData);
                console.log(req);
                toast.success("Изменения внесены успешно");
                props.setPopupActive(false);
                props.setBookId(null);
                props.getBooks();
            }
        ).catch((req)  => {
            console.log(bookData);
            toast.error("Не удалось внести изменения, неверные данные")
        });
    }

    useEffect(() => {
        if(props.bookId)
            getBook();
    }, [props.bookId]);

    function chName(bookName) {
        console.log(bookName);
        setBookData(
            {
                id: bookData.id,
                name: bookName,
                year_publication: bookData.year_publication,
                authors: bookData.authors,
                status: bookData.status,
                lang: bookData.lang
            }
        );
    }
    function chYear(year) {
        setBookData(
            {
                id: bookData.id,
                name: bookData.name,
                year_publication: year,
                authors: bookData.authors,
                status: bookData.status,
                lang: bookData.lang
            }
        );
    }
    function chAuth(auth) {
        let auths = [];
        console.log(auth);
        console.log(props.authors);
        for(let i = 0; i < auth.length; i++)
            auths.push(props.authors.find(a => a.id == auth[i].value));
        setBookData(
            {
                id: bookData.id,
                name: bookData.name,
                year_publication: bookData.year_publication,
                authors: auths,
                status: bookData.status,
                lang: bookData.lang
            }
        )
    }
    function chStat(status) {
        setBookData(
            {
                id: bookData.id,
                name:  bookData.name,
                year_publication: bookData.year_publication,
                authors: bookData.authors,
                status: status,
                lang: bookData.lang
            }
        )
    }
    function chLang(lang) {
        setBookData(
            {
                id: bookData.id,
                name:  bookData.name,
                year_publication: bookData.year_publication,
                authors: bookData.authors,
                status: bookData.status,
                lang: lang
            }
        )
    }

    let statusOpts = [
        {value: "planned", label: "Не прочитана"},
        {value: "read", label: "Прочитана"}
      ];

    return (
        <div className="popupForm">
            <h2>Изменение {props.bookName}</h2>
            <div className="inputBlock">
                <input value={bookData ? bookData.name : ""} onChange={e => chName(e.target.value)} type="text" placeholder="Название"/>
                <input value={bookData ? bookData.year_publication : ""} onChange={e => {console.log(bookData);chYear(e.target.value)}} type="text" placeholder="Год публикации"/>
            </div>
            <AsyncSelect isMulti value={bookData ? bookData.authors.map(a => {return {value: a.id, label: a.name};}) : ""} onChange={e => chAuth(e)} className="AsySel" placeholder="Автор" isClearable loadOptions={props.loadAuthOpts} defaultOptions/>
            <AsyncSelect value={bookData ? {value: bookData.status, label: bookData.status == "planned" ? "Не прочитана" : "Прочитана"} : ""} onChange={e => chStat(e.value)} className="AsySel" placeholder="Статус" isClearable defaultOptions={statusOpts}/>
            <AsyncSelect value={bookData ? {value: bookData.lang.full_name, label: bookData.lang.name} : ""} onChange={e => chLang({full_name: e.value, name: e.label})} className="AsySel" placeholder="Язык" isClearable loadOptions={props.loadLangOpts} defaultOptions/>
            <Button  onClick={() => {changeBook()}}>Изменить</Button>
        </div>
    );
};

export const AddBookForm = (props) => {
    const [bookData, setBookData] = useUserAddBook();

    function chName(bookName) {
        console.log(bookName);
        setBookData(
            {
                name: bookName,
                year_publication: bookData.year_publication,
                authors: bookData.authors,
                status: bookData.status,
                lang: bookData.lang
            }
        );
    }
    function chYear(year) {
        setBookData(
            {
                name: bookData.name,
                year_publication: year,
                authors: bookData.authors,
                status: bookData.status,
                lang: bookData.lang
            }
        );
    }
    function chAuth(auth) {
        let auths = [];
        console.log(auth);
        console.log(props.authors);
        for(let i = 0; i < auth.length; i++)
            auths.push(props.authors.find(a => a.id == auth[i].value));
        setBookData(
            {
                name: bookData.name,
                year_publication: bookData.year_publication,
                authors: auths,
                status: bookData.status,
                lang: bookData.lang
            }
        )
    }
    function chStat(status) {
        setBookData(
            {
                name:  bookData.name,
                year_publication: bookData.year_publication,
                authors: bookData.authors,
                status: status,
                lang: bookData.lang
            }
        )
    }
    function chLang(lang) {
        setBookData(
            {
                name:  bookData.name,
                year_publication: bookData.year_publication,
                authors: bookData.authors,
                status: bookData.status,
                lang: lang
            }
        )
    }

    function addBook() {
        api.post("/api/v1/book/", bookData).then(
            (req) => {
                console.log(bookData);
                console.log(req);
                toast.success("Книга добавлена успешно");
                props.setPopupActive(false);
                props.getBooks();
            }
        ).catch((req)  => {
            console.log(bookData);
            toast.error("Неудалось добавить книгу, неверные данные")
        });
    }

    let statusOpts = [
        {value: "planned", label: "Не прочитана"},
        {value: "read", label: "Прочитана"}
      ];

    return (
        <div className="popupForm addForm">
            <h2>Добавить новую книгу</h2>
            <div className="inputBlock">
                <input type="text" value={bookData.name ? bookData.name : ""} onChange={e => chName(e.target.value)} placeholder="Название"/>
                <input type="text" value={bookData.year_publication ? bookData.year_publication : ""} onChange={e => chYear(e.target.value)} placeholder="Год публикации"/>
            </div>
            <AsyncSelect value={bookData.authors ? bookData.authors.map(a => {return {value: a.id, label: a.name};}) : ""} onChange={e => chAuth(e)} isMulti className="AsySel" placeholder="Автор" isClearable loadOptions={props.loadAuthOpts} defaultOptions/>
            <AsyncSelect value={bookData.status ? {value: bookData.status, label: bookData.status == "planned" ? "Не прочитана" : "Прочитана"} : ""} onChange={e => chStat(e.value)} className="AsySel" placeholder="Статус" isClearable defaultOptions={statusOpts}/>
            <AsyncSelect value={bookData.lang ? {value: bookData.lang.full_name, label: bookData.lang.name} : ""} onChange={e => chLang({full_name: e.value, name: e.label})} className="AsySel" placeholder="Язык" isClearable loadOptions={props.loadLangOpts} defaultOptions/>
            <Button onClick={() => {addBook()}}>Добавить</Button>
        </div>
    );
};

export const DeleteBookForm = (props) => {
    function deleteBook() {
        api.delete("/api/v1/book/" + props.bookId).then(
            (req) => {
                console.log(req);
                toast.success("Книга удалена успешно");
                props.setPopupActive(false);
                props.setBookId(null);
                props.getBooks();
            }
        ).catch((req)  => {
            toast.error("Не удалось удалить книгу, что-то пошло не так")
        });
    }

    return (
        <div className="deleteBlock">
            <h2>Удаление {props.bookName}</h2>
            <p>Вы уверены, что действительно хотите удалить {props.bookName}? Вернуть утерянные данные вы уже не сможете.</p>
            <Button onClick={() => deleteBook()}>Удалить</Button>
        </div>
    );
};

export const Book = (props) => {
    return (
        <div className="book">
            <h2>{props.name}</h2>
            <div className="bookBlock">
                <div>
                    <p><b>Авторы:</b> {props.authors.map(a => <span key={a.id}>{a.name} </span>)}</p>
                    <p><b>Язык:</b> {props.lang}</p>
                    <p><b>Год публикации:</b> {props.year}</p>
                    <p><b>Статус:</b> {(props.status != "planned") ? "Прочитана" : "Не прочитана"}</p>
                </div>
                <div className="bookBtnBlock">
                    <Button onClick={()=> {props.popupEditActive(true); props.setBookName(props.name); props.setBookId(props.id);}}><img src={pencil} alt="Изменить"/></Button>
                    <Button onClick={()=> {props.popupDeleteActive(true); props.setBookName(props.name); props.setBookId(props.id);}}><img src={trashCan} alt="Удалить"/></Button>
                </div>
            </div>
        </div>
    );
};