const express = require('express');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const db = require('./db/db.json');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to read the database.' });
    }

    res.json(JSON.parse(data))
});
})

// Endpoint to handle POST requests to create a new note
app.post('/api/notes', (req, res) => {
    // Read the existing notes from db.json
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to read the database.' });
        }

        // Parse the existing notes data
        const notes = JSON.parse(data);

        // Generate a unique ID for the new note
        const newNoteId = uuidv4();

        // Create a new note object with the received data and the generated ID
        const newNote = {
            id: newNoteId,
            title: req.body.title,
            text: req.body.text
        };

        // Add the new note to the notes array
        notes.push(newNote);

        // Write the updated notes back to db.json
        fs.writeFile('./db/db.json', JSON.stringify(notes), 'utf8', (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Failed to write to the database.' });
            }

            // Return the newly created note to the client
            res.json(newNote);
        });
    });
});

// Endpoint to handle DELETE requests for deleting a note by its ID
app.delete('/api/notes/:id', (req, res) => {
    // Read the existing notes from db.json
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to read the database.' });
      }
  
      // Parse the existing notes data
      const notes = JSON.parse(data);
      console.log(notes)
      const filteredNotes = notes.filter(note => note.id != req.params.id);
      console.log(filteredNotes)
  
      // // Find the index of the note with the provided ID
      // const noteIndex = notes.findIndex(note => note.id === req.params.id);
  
      // // If note not found, return an error
      // if (noteIndex === -1) {
      //   return res.status(404).json({ error: 'Note not found.' });
      // }
  
      // // Remove the note from the notes array
      // const deletedNote = notes.splice(noteIndex, 1)[0];
  
      // Write the updated notes back to db.json
      fs.writeFile('./db/db.json', JSON.stringify(filteredNotes), 'utf8', (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Failed to write to the database.' });
        }
  
        // Return the deleted note to the client
        res.json(filteredNotes);
      });
    });
  });

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'))
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
});

app.listen(PORT, () =>
    console.log(`Serving static asset routes on port ${PORT}!`)
);

