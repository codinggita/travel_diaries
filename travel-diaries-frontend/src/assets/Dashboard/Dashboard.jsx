import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, IconButton, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';
import { FaPlus, FaEdit, FaShare, FaTrash } from 'react-icons/fa'; // Import action icons

function App() {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openEdit, setOpenEdit] = useState(false);
  const [editJournal, setEditJournal] = useState(null);
  const [newTitle, setNewTitle] = useState('');

  // Fetch journals from the backend when the component mounts or after mutations
  useEffect(() => {
    const fetchJournals = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://travel-diaries-t6c5.onrender.com/api/journals'); // Replace with your actual backend URL
        setJournals(response.data);
      } catch (error) {
        console.error('Error fetching journals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJournals();
  }, []);

  // Handle Delete Journal
  const handleDelete = async (journalId) => {
    if (window.confirm('Are you sure you want to delete this journal?')) {
      try {
        await axios.delete(`https://travel-diaries-t6c5.onrender.com/api/journals/${journalId}`);
        // Refresh the journal list from the backend to ensure sync
        const response = await axios.get('https://travel-diaries-t6c5.onrender.com/api/journals');
        setJournals(response.data);
      } catch (error) {
        console.error('Error deleting journal:', error);
      }
    }
  };

  // Handle Edit Journal (open dialog for editing)
  const handleEdit = (journal) => {
    setEditJournal(journal);
    setNewTitle(journal.journalTitle);
    setOpenEdit(true);
  };

  // Handle Save Edit (update journal in backend and refresh)
  const handleSaveEdit = async () => {
    if (editJournal && newTitle) {
      try {
        await axios.put(`https://travel-diaries-t6c5.onrender.com/api/journals/${editJournal.journalId}`, { journalTitle: newTitle });
        // Refresh the journal list from the backend to ensure sync
        const response = await axios.get('https://travel-diaries-t6c5.onrender.com/api/journals');
        setJournals(response.data);
        setOpenEdit(false);
      } catch (error) {
        console.error('Error updating journal:', error);
      }
    }
  };

  // Handle Share Journal (for now, just an alert; you can expand this)
  const handleShare = (journal) => {
    alert(`Share this journal: ${journal.journalTitle} (ID: ${journal.journalId})`);
    // If sharing involves backend updates (e.g., tracking shares), add an API call here
    // Example: await axios.post(`http://your-backend-url/api/journals/${journal.journalId}/share`);
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8">
        {/* Left Card (Start a New Diary) - Static */}
        <Card className="w-full md:w-64 h-80 bg-white shadow-lg rounded-lg flex flex-col items-center justify-center cursor-pointer hover:shadow-xl transition-shadow">
          <FaPlus className="text-4xl text-orange-500 mb-4" />
          <Typography variant="h6" className="text-gray-700">
            Start a new diary
          </Typography>
        </Card>

        {/* Dynamically Render Journals from Backend with Actions */}
        {journals.map((journal) => (
          <Card
            key={journal.journalId}
            className="w-full md:w-64 h-80 bg-black text-white rounded-lg flex flex-col items-center justify-between p-4 relative"
          >
            <div className="w-full flex justify-between items-start">
              <Typography variant="caption" className="text-gray-400">
                {journal.journalTitle || 'Untitled'}
              </Typography>
              <div className="flex space-x-2">
                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
              </div>
            </div>
            <div className="flex-grow flex items-center">
              <Typography variant="h5" className="text-white font-bold">
                {journal.journalTitle || 'No Title'}
              </Typography>
            </div>
            {journal.images && journal.images.length > 0 ? (
              <img
                src={journal.images[0]}
                alt={`${journal.journalTitle} Logo`}
                className="w-36 h-auto"
                onError={(e) => (e.target.style.display = 'none')}
              />
            ) : (
              <div className="w-36 h-12 bg-gray-600 rounded"></div>
            )}
            {/* Action Buttons/Icons */}
            <div className="absolute top-2 right-2 flex space-x-2">
              <IconButton
                onClick={() => handleEdit(journal)}
                className="text-white hover:text-gray-300"
                aria-label="Edit"
              >
                <FaEdit />
              </IconButton>
              <IconButton
                onClick={() => handleShare(journal)}
                className="text-white hover:text-gray-300"
                aria-label="Share"
              >
                <FaShare />
              </IconButton>
              <IconButton
                onClick={() => handleDelete(journal.journalId)}
                className="text-white hover:text-gray-300"
                aria-label="Delete"
              >
                <FaTrash />
              </IconButton>
            </div>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle>Edit Journal</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Journal Title"
            fullWidth
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button onClick={handleSaveEdit}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default App;