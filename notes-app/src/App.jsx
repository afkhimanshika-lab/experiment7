
import { useState } from "react";
import "./App.css";

function App() {
  const [notes, setNotes] = useState(() => {
    return JSON.parse(localStorage.getItem("myNotes")) || [];
  });

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState(null);

  function saveNotes(updatedNotes) {
    setNotes(updatedNotes);
    localStorage.setItem("myNotes", JSON.stringify(updatedNotes));
  }

  function addNote(e) {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("Please fill in both fields.");
      return;
    }

    if (editId !== null) {
      const updatedNotes = notes.map((note) =>
        note.id === editId
          ? { ...note, title, content }
          : note
      );

      saveNotes(updatedNotes);
      setEditId(null);
    } else {
      const newNote = {
        id: Date.now(),
        title: title,
        content: content,
      };

      saveNotes([...notes, newNote]);
    }

    setTitle("");
    setContent("");
  }

  function editNote(note) {
    setTitle(note.title);
    setContent(note.content);
    setEditId(note.id);
  }

  function deleteNote(id) {
    saveNotes(notes.filter((note) => note.id !== id));

    if (editId === id) {
      setEditId(null);
      setTitle("");
      setContent("");
    }
  }

  return (
    <div className="app">
      <header>
        <h1>My Notes</h1>
        <p>A little space for all the things I need to remember.</p>
      </header>

      <form onSubmit={addNote} className="note-form">
        <input
          type="text"
          placeholder="Note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Write something..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="4"
        />

        <button type="submit">
          {editId !== null ? "Update Note" : "Add Note"}
        </button>

        {editId !== null && (
          <button
            type="button"
            className="cancel"
            onClick={() => {
              setEditId(null);
              setTitle("");
              setContent("");
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <h2>Your Notes ({notes.length})</h2>

      <div className="notes-list">
        {notes.length === 0 ? (
          <p className="empty">No notes yet. Add your first one!</p>
        ) : (
          notes.map((note) => (
            <div className="note" key={note.id}>
              <h3>{note.title}</h3>
              <p>{note.content}</p>

              <div className="actions">
                <button onClick={() => editNote(note)}>
                  Edit
                </button>

                <button
                  className="delete"
                  onClick={() => deleteNote(note.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
