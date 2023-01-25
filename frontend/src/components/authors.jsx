import react, { useEffect, useState, useRef, useContext } from "react";
import { Header, Filter, Button, Popup } from "../App";
import AsyncSelect from "react-select/async";
import pencil from "./pencil.svg";
import trashCan from "./trashCan.svg";
import axios from "axios";
import { useUserAddAuthor } from "../App";
import './books.css';
import { toast } from "react-toastify";
import QRCode from "qrcode";

let api = axios.create({
    baseURL: "http://localhost:5435/",
    timeout: 1000
});

export const AuthorsPage = (props) => {
    const [popupEditActive, setPopupEditActive] = useState(false);
    const [popupAddActive, setPopupAddActive] = useState(false);
    const [popupDeleteActive, setPopupDeleteActive] = useState(false);
    const [popupQrActive, setPopupQrActive] = useState(false);
    const [authorId, setAuthorId] = useState(null);
    const [authorName, setAuthorName] = useState(null);
    const [langs, setLangs] = useState(null);
    const [authors, setAuthors] = useState(null);
    const [filter, setFilter] = useState(
        {
            name: null,
        }
    );
    const [uri, setUri] = useState(null);

    if(authors == null)
        getAuthors();

    function getAuthors() {
        let req = api.get("/api/v1/authors", {params: filter});
        req.then(res => { console.log(res.data); setAuthors(res.data); });
    }

    function getLangs() {
        let req = api.get("/api/v1/langs");
        req.then(res => { console.log(res.data); setLangs(res.data); });
    }

    if(langs == null)
        getLangs();

    useEffect(() => {
        getAuthors();
    }, [filter])

    function setName(name) {
        setFilter({
            name: name,
        });
    }

    function loadLangOpts(inputValue, callback) {
        let req = api.get("/api/v1/langs");
        req.then(res => { callback(res.data.map(ob => { return {value: ob.name, label: ob.full_name};})); });
    }

    return (
        <div >
            <Header/>
            <hr/>
            <Filter filterName="Фильтр по авторам" type="Authors" loadLangOpts={loadLangOpts} setName={setName}/>
            <div className="AllBlock">
                <div className="booksBl">
                    <Button onClick={() => setPopupAddActive(true)}>Добавить нового автора</Button>
                    <div className="booksBlock">
                        {
                        authors != null && authors.Count != 0
                            ? authors.map((a) => <Author setUri={setUri} popupQrActive={setPopupQrActive} setAuthorName={setAuthorName} setAuthorId={setAuthorId} popupDeleteActive={setPopupDeleteActive} popupEditActive={setPopupEditActive} key={a.id} id={a.id} name={a.name} bday={a.bday} langs={a.langs} bio={a.bio}/>)
                            : <p>Авторов нет</p>
                        }
                    </div>
                </div>
            </div>
            <Popup setAuthorId={setAuthorId} active={popupEditActive} setActive={setPopupEditActive}>
                <ChangeAuthorForm langs={langs} getAuthors={getAuthors} setAuthorId={setAuthorId} authors={authors} loadLangOpts={loadLangOpts} setPopupActive={setPopupEditActive} authorName={authorName} authorId={authorId}/>
            </Popup>
            <Popup active={popupAddActive} setActive={setPopupAddActive}>
                <AddAuthorForm langs={langs} setAuthorId={(id) => {}} getAuthor={getAuthors} loadLangOpts={loadLangOpts} setPopupActive={setPopupAddActive}/>
            </Popup>
            <Popup active={popupDeleteActive} setActive={setPopupDeleteActive}>
                <DeleteAuthorForm authorName={authorName} authorId={authorId} setAuthorId={setAuthorId} getAuthors={getAuthors} setPopupActive={setPopupDeleteActive}/>
            </Popup>
            <Popup active={popupQrActive} setActive={setPopupQrActive}>
                <QrPopup url={uri}/> 
            </Popup>
        </div>
    );
};

export function findLangs(lang, langs) {
    let fLangs = [];
    for(let i = 0; i < lang.length; i++)
        fLangs.push(langs.find(l => l.name == lang[i].value));
    return fLangs;
}

export const ChangeAuthorForm = (props) => {
    const [authorData, setAuthorData] = useState(null);

    function getAuthor () {
        let req = api.get("/api/v1/authors/" + props.authorId);
        req.then(res => { console.log(res.data); setAuthorData(res.data); });
    }

    function changeAuthor() {
        api.put("/api/v1/authors/" + props.authorId, authorData).then(
            (req) => {
                console.log(authorData);
                console.log(req);
                toast.success("Изменения внесены успешно");
                props.setPopupActive(false);
                props.setAuthorId(null);
                props.getAuthors();
            }
        ).catch((req)  => {
            console.log(authorData);
            toast.error("Не удалось внести изменения, неверные данные");
        });
    }

    useEffect(() => {
        if(props.authorId)
            getAuthor();
    }, [props.authorId]);

    function chName(authorName) {
        console.log(authorName);
        setAuthorData(
            {
                id: authorData.id,
                name: authorName,
                bio: authorData.bio,
                bday: authorData.bday,
                langs: authorData.langs
            }
        );
    }
    function chBio(bio) {
        setAuthorData(
            {
                id: authorData.id,
                name: authorData.name,
                bio: bio,
                bday: authorData.bday,
                langs: authorData.langs
            }
        );
    }
    function chBday(bday) {
        setAuthorData(
            {
                id: authorData.id,
                name: authorData.name,
                bio: authorData.bio,
                bday: bday,
                langs: authorData.langs
            }
        )
    }
    function chLang(lang) {
        let langs = findLangs(lang, props.langs)
        console.log(lang);
        setAuthorData(
            {
                id: authorData.id,
                name: authorData.name,
                bio: authorData.bio,
                bday: authorData.bday,
                langs: langs
            }
        )
    }

    return (
        <div className="popupForm">
            <h2>Изменение {props.authorName}</h2>
            <div className="inputBlock">
                <input value={authorData ? authorData.name : ""} onChange={e => chName(e.target.value)} type="text" placeholder="Имя"/>
                <input value={authorData ? authorData.bday : ""} onChange={e => {chBday(e.target.value)}} type="text" placeholder="Дата рождения"/>
            </div>
            <input value={authorData ? authorData.bio : ""} onChange={e => {chBio(e.target.value)}} type="text" placeholder="Биография"/>
            <AsyncSelect isMulti value={authorData ? authorData.langs.map(l => { return {value: l.name, label: l.full_name}}) : ""} onChange={e => chLang(e)} className="AsySel" placeholder="Язык" isClearable loadOptions={props.loadLangOpts} defaultOptions/>
            <Button  onClick={() => {changeAuthor()}}>Изменить</Button>
        </div>
    );
};

export const AddAuthorForm = (props) => {
    const [authorData, setAuthorData] = useUserAddAuthor();

    function chName(authorName) {
        console.log(authorName);
        setAuthorData(
            {
                id: authorData.id,
                name: authorName,
                bio: authorData.bio,
                bday: authorData.bday,
                langs: authorData.langs
            }
        );
    }
    function chBio(bio) {
        setAuthorData(
            {
                id: authorData.id,
                name: authorData.name,
                bio: bio,
                bday: authorData.bday,
                langs: authorData.langs
            }
        );
    }
    function chBday(bday) {
        setAuthorData(
            {
                id: authorData.id,
                name: authorData.name,
                bio: authorData.bio,
                bday: bday,
                langs: authorData.langs
            }
        )
    }
    function chLang(lang) {
        let langs = [];
        for(let i = 0; i < lang.length; i++)
            langs.push(props.langs.find(l => l.name == lang[i].value));
        console.log(langs)
        setAuthorData(
            {
                id: authorData.id,
                name: authorData.name,
                bio: authorData.bio,
                bday: authorData.bday,
                langs: langs
            }
        )
    }

    function addAuthor() {
        api.post("/api/v1/authors", authorData).then(
            (req) => {
                console.log(req);
                toast.success("Автор добавлен успешно");
                props.setPopupActive(false);
                props.getAuthor();
            }
        ).catch((req)  => {
            toast.error("Неудалось добавить автора, неверные данные")
        });
    }

    return (
        <div className="popupForm addForm">
            <h2>Добавить нового автора</h2>
            <div className="inputBlock">
                <input value={authorData ? authorData.name : ""} onChange={e => chName(e.target.value)} type="text" placeholder="Имя"/>
                <input value={authorData ? authorData.bday : ""} onChange={e => {chBday(e.target.value)}} type="text" placeholder="Дата рождения"/>
            </div>
            <input value={authorData ? authorData.bio : ""} onChange={e => {chBio(e.target.value)}} type="text" placeholder="Биография"/>
            <AsyncSelect isMulti value={authorData.langs ? authorData.langs.map(l => { return {value: l ? l.name : "er", label: l? l.full_name : "error"}}) : ""} onChange={e => {chLang(e); console.log(e)}} className="AsySel" placeholder="Язык" isClearable loadOptions={props.loadLangOpts} defaultOptions/>
            <Button onClick={() => {addAuthor()}}>Добавить</Button>
        </div>
    );
};

export const DeleteAuthorForm = (props) => {
    function deleteAuthor() {
        api.delete("/api/v1/authors/" + props.authorId).then(
            (req) => {
                console.log(req);
                toast.success("Автор удален успешно");
                props.setPopupActive(false);
                props.setAuthorId(null);
                props.getAuthors();
            }
        ).catch((req)  => {
            toast.error("Не удалось удалить автора, скорее всего из-за того, что он есть в какой-то книге")
        });
    }

    return (
        <div className="deleteBlock">
            <h2>Удаление {props.authorName}</h2>
            <p>Вы уверены, что действительно хотите удалить {props.authorName}? Вернуть утерянные данные вы уже не сможете.</p>
            <Button onClick={() => deleteAuthor()}>Удалить</Button>
        </div>
    );
};

const QrPopup = (props) => {
    const qrcodeCanvasRef = useRef();

    useEffect(() => {
     QRCode.toCanvas(qrcodeCanvasRef.current, props.url); //async
    }, [props.url]);

    return (
        <div className="canv">
         <canvas ref={qrcodeCanvasRef}/>
        </div>
    );
}

export function isURI(val) {
    return /^https?:(\/\/)/.test(val);
}

export const Author = (props) => {

    return (
        <div className="book">
            <h2>{props.name}</h2>
            <div className="bookBlock">
                <div>
                    <p><b>Дата рождения:</b> {props.bday}</p>
                    <p><b>Биография:</b> {isURI(props.bio) ? <a className="Uri" onClick={() => {props.setUri(props.bio); props.popupQrActive(true)}}>{props.bio}</a> : props.bio }</p>
                    <p><b>Языки:</b> {props.langs.map(l => <span key={l.name}>{l.full_name} </span>)}</p>
                </div>
                <div className="bookBtnBlock">
                    <Button onClick={()=> {props.popupEditActive(true); props.setAuthorName(props.name); props.setAuthorId(props.id);}}><img src={pencil} alt="Изменить"/></Button>
                    <Button onClick={()=> {props.popupDeleteActive(true); props.setAuthorName(props.name); props.setAuthorId(props.id);}}><img src={trashCan} alt="Удалить"/></Button>
                </div>
            </div>
        </div>
    );
};