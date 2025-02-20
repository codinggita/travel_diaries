import React, { useState } from 'react';
import { Button, TextField, Typography, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Paper } from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';

const BookEditorPage = () => {
  const [chapters, setChapters] = useState([]);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [chapterTitle, setChapterTitle] = useState('');
  const [chapterContent, setChapterContent] = useState('');

  const addChapter = () => {
    const newChapter = { id: Date.now(), title: chapterTitle || 'Untitled Chapter', content: chapterContent };
    setChapters([...chapters, newChapter]);
    setChapterTitle('');
    setChapterContent('');
  };

  const editChapter = (chapter) => {
    setCurrentChapter(chapter);
    setChapterTitle(chapter.title);
    setChapterContent(chapter.content);
  };

  const updateChapter = () => {
    setChapters(chapters.map(chap => chap.id === currentChapter.id ? { ...chap, title: chapterTitle, content: chapterContent } : chap));
    setCurrentChapter(null);
    setChapterTitle('');
    setChapterContent('');
  };

  const deleteChapter = (id) => {
    setChapters(chapters.filter(chap => chap.id !== id));
    if (currentChapter && currentChapter.id === id) {
      setCurrentChapter(null);
      setChapterTitle('');
      setChapterContent('');
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <Typography variant="h3" className="mb-6">Book Editor</Typography>

      <div className="flex gap-6">
        <Paper className="w-1/3 p-4">
          <Typography variant="h6">Chapter List</Typography>
          <List>
            {chapters.map((chapter) => (
              <ListItem key={chapter.id} button onClick={() => editChapter(chapter)}>
                <ListItemText primary={chapter.title} />
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={() => deleteChapter(chapter.id)}>
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => { setCurrentChapter(null); setChapterTitle(''); setChapterContent(''); }}
          >
            New Chapter
          </Button>
        </Paper>

        <Paper className="flex-1 p-4">
          <Typography variant="h6">{currentChapter ? 'Edit Chapter' : 'New Chapter'}</Typography>
          <TextField
            label="Chapter Title"
            variant="outlined"
            fullWidth
            value={chapterTitle}
            onChange={(e) => setChapterTitle(e.target.value)}
            className="mb-4"
          />
          <TextField
            label="Chapter Content"
            variant="outlined"
            multiline
            rows={10}
            fullWidth
            value={chapterContent}
            onChange={(e) => setChapterContent(e.target.value)}
          />

          <div className="mt-4">
            {currentChapter ? (
              <Button variant="contained" color="primary" onClick={updateChapter}>Update Chapter</Button>
            ) : (
              <Button variant="contained" color="secondary" onClick={addChapter}>Add Chapter</Button>
            )}
          </div>
        </Paper>
      </div>
    </div>
  );
};

export default BookEditorPage;