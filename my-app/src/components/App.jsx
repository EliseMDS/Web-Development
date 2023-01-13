import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import notes from "../notes";
import InputArea from "./InputArea";
import { useState } from "react";

export default function App(){

    const [noteList, setList] = useState([]);

    function addNote(inputNote){
        setList((prevValue) => [...prevValue, inputNote]);
    }

    function deleteNote(id){
        setList((prevValue) => {
            return prevValue.filter((note, index) => index !== id);
        });
    }

    return(
        <div>
            <Header />
            <InputArea onClick={addNote}/>
            {noteList.map((note, i) => (
                <Note key={i} id={i} onClick={() => deleteNote(i)} {...note}/>
            ))}
            <Footer />
        </div>
    )
}