import React, { useEffect, useState } from "react";

import axios from "axios";
import Button from '@mui/material/Button';

function Note(curpost) {
  const [curID, setID] = React.useState(curpost.data.id);
  const [isEditing, setIsEditing] = useState(false)
  const [isRemoved, setisRemoved] = useState(false)
  const [currenttitle, currentsetTitle] = React.useState(curpost.data.title);
  const [currentDesc, currentSetDesc] = React.useState(curpost.data.description);


  const editNote = (id) => {
    if ((currentDesc.length + currentsetTitle) > 140) {
      window.alert("Note must be less than 140 characters!");
      return null;
    }
    axios.put(`/api/notes/${id}`, {
      title: currenttitle, description: currentDesc
    }).then(res => {
      setIsEditing(false);
    });
  };

  // useEffect(() => {
  //   setID(curpost.data.id);
  //   currentsetTitle(curpost.data.title);
  //   currentSetDesc(curpost.data.description);
  // }, []);

  const deleteNote = id => {

    axios.delete(`/api/notes/${curID}`).then(res => {
      curpost.met(curID);
    });
    // setisRemoved(true)

  }
  // if (isRemoved) { return null; }

  return (
    <div>
      {

        isEditing ?
          <div className="card">
            <form onSubmit={() => editNote(curID)}>
              <input type="title" onChange={event => currentsetTitle(event.target.value)} value={currenttitle} />
              <textarea onChange={event => currentSetDesc(event.target.value)} value={currentDesc} />
            </form>
            <Button variant="outlined" onClick={() => editNote(curID)}> Save </Button>
          </div>
          :
          <div className="card">
            <h2 onDoubleClick={() => setIsEditing(true)}>{currenttitle}</h2>
            <p onDoubleClick={() => setIsEditing(true)}>{currentDesc}</p>
            <Button variant="outlined" onClick={() => deleteNote(curID)}> Delete </Button>
          </div>

      }
    </div>);



}

export default Note;