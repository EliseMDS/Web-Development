import DeleteIcon from '@mui/icons-material/Delete';

export default function Note(props){
    return(
        <div className="note">
            <h1>{props.title}</h1>
            <p>{props.content}</p>
            <button onClick={props.onClick}><DeleteIcon /> </button>
        </div>
    )
}