import { useState } from "react"
import AddIcon from '@mui/icons-material/Add';
import { Fab, Zoom  } from '@mui/material';

export default function InputArea(props){

    const [isExpanded, setExpanded] = useState(false);

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

    function expand() {
        setExpanded((prevValue) => !prevValue)
    }

    return(
        <form className="create-note" onSubmit={(event) => event.preventDefault()}>
            {isExpanded && <input onChange={handleChange} type="text" name="title" value={inputNote.title} placeholder="Title"/>}            
            <textarea onClick={expand} onChange={handleChange} name="content" value={inputNote.content} placeholder="Take a note..." rows={isExpanded ? 3 : 1}/>
            <Zoom in={isExpanded}>
                <Fab 
                    onClick={() => {
                        props.onClick(inputNote)
                        setNote({title: "", content:""})
                    }} 
                    type="submit"><AddIcon />
                </Fab>
            </Zoom>
        </form>
    )
}