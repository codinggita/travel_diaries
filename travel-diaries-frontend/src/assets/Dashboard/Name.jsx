// src/components/CreateDiary.jsx
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { Button, TextField, Typography } from '@mui/material';
import { FaImage } from 'react-icons/fa';

function CreateDiary({ onDiaryCreated }) {
  const [journalTitle, setJournalTitle] = useState('');
  const [chapterName, setChapterName] = useState('');
  const [date, setDate] = useState('');
  const [story, setStory] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [error, setError] = useState('');

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      setCoverImage(acceptedFiles[0]);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!journalTitle) {
      setError('Journal title is required');
      return;
    }

    const formData = new FormData();
    formData.append('journalTitle', journalTitle);
    formData.append('chapterName', chapterName);
    formData.append('date', date);
    formData.append('content', story);
    if (coverImage) {
      formData.append('coverImage', coverImage);
    }

    try {
      const response = await axios.post('http://your-backend-url/api/journals', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onDiaryCreated(response.data.data); // Callback to refresh parent component
      setJournalTitle('');
      setChapterName('');
      setDate('');
      setStory('');
      setCoverImage(null);
      setError('');
    } catch (error) {
      setError('Failed to create diary. Please try again.');
      console.error('Error creating diary:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <Typography variant="h5" className="mb-4">Create a New Diary</Typography>
      {error && <Typography color="error" className="mb-4">{error}</Typography>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField
          fullWidth
          label="Diary Title"
          value={journalTitle}
          onChange={(e) => setJournalTitle(e.target.value)}
          required
        />
        <TextField
          fullWidth
          label="Chapter Name"
          value={chapterName}
          onChange={(e) => setChapterName(e.target.value)}
        />
        <TextField
          fullWidth
          type="date"
          label="Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          fullWidth
          label="Story"
          multiline
          rows={4}
          value={story}
          onChange={(e) => setStory(e.target.value)}
        />
        <div {...getRootProps()} className="border-2 border-dashed border-gray-300 p-4 rounded-lg cursor-pointer">
          <input {...getInputProps()} />
          <Typography className="text-gray-500 text-center">
            {coverImage ? `Selected: ${coverImage.name}` : 'Drag and drop an image here, or click to select'}
            <FaImage className="inline ml-2 text-orange-500" />
          </Typography>
        </div>
        <Button type="submit" variant="contained" color="primary" className="w-full">
          Create Diary
        </Button>
      </form>
      {!coverImage && (
        <Typography className="mt-4 text-gray-500 text-center">
          No image uploaded? A default cover will be used.
        </Typography>
      )}
    </div>
  );
}

export default CreateDiary;