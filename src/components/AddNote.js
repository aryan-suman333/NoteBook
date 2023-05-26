import React, { useContext, useState } from 'react';
import NoteContext from "../context/notes/NoteContext";

const AddNote = (props) => {
  const context = useContext(NoteContext);
  const { addNote } = context;

  const [note, setNote] = useState({ title: "", description: "", tag: "" });

  const handleClick = (e) => {
    e.preventDefault();
    addNote(note.title, note.description, note.tag);
    setNote({ title: "", description: "", tag: "" });
    props.showAlert("Added Successfully", "success");
  }

  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  }

  return (
    <div className="mt-2">
      <form>
        <h2>Add Note</h2>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title</label>
          <input type="text" onChange={onChange} minLength={5} required className="form-control" id="title" name="title" value={note.title} />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <input type="text" onChange={onChange} minLength={5} required className="form-control" id="description" name="description" value={note.description} />
        </div>

        <div className="mb-3">
          <label htmlFor="tag" className="form-label">Tag</label>
          <input type="text" onChange={onChange} className="form-control" id="tag" name="tag" value={note.tag} />
        </div>

        <button disabled={note.title.length < 5 || note.description.length < 5} type="submit" onClick={handleClick} className="btn btn-primary">Add</button>
      </form>
    </div>
  )
}

export default AddNote;