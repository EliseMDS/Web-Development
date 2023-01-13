import { useState } from "react"

export default function InputArea(props){

    const [inputNote, setNote] = useState({
        title: "",
        content: ""
    });

    function handleChange(event){
        const {name, value} = event.target;

        setNote((prevValue) => ({
            ...prevValue, 
            [name]: value
        }))
    }

    return(
        <form onSubmit={(event) => event.preventDefault()}>
            <input onChange={handleChange} type="text" name="title" value={inputNote.title} placeholder="Title"/>
            <textarea onChange={handleChange} name="content" value={inputNote.content} placeholder="Take a note..."/>
            <button 
                onClick={() => {
                    props.onClick(inputNote)
                    setNote({title: "", content:""})
                }} 
                type="submit">Add
            </button>
        </form>
    )
}