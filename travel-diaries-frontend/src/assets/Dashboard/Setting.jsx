// src/components/Settings.js
import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Switch
} from '@mui/material';
// import { UilToggleOn, UilToggleOff } from '@iconscout/react-unicons';

const Settings = () => {
  const [language, setLanguage] = useState('english');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [newsletter, setNewsletter] = useState(true);

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleDateFormatChange = (event) => {
    setDateFormat(event.target.value);
  };

  const handleNewsletterToggle = (event) => {
    setNewsletter(event.target.checked);
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <Typography variant="h4" className="mb-6 font-bold text-gray-900">Settings</Typography>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-1/4 bg-white p-4 rounded-lg shadow-md">
          <button className="w-full text-left p-2 bg-orange-100 text-orange-600 rounded mb-2 hover:bg-orange-200 transition-colors">Account settings</button>
          <button className="w-full text-left p-2 hover:bg-gray-100 rounded transition-colors">Change password</button>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-3/4 bg-white p-6 rounded-lg shadow-md">
          <Typography variant="h5" className="mb-4 text-gray-800">Account settings</Typography>
          
          <Box component="form" noValidate autoComplete="off" className="space-y-4">
            <TextField
              fullWidth
              label="Email"
              value="dev.patel.codinggita@gmail.com"
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
              InputLabelProps={{ className: 'text-gray-700' }}
              className="mb-4"
            />

            <FormControl fullWidth variant="outlined" className="mb-4">
              <InputLabel className="text-gray-700">Language</InputLabel>
              <Select
                value={language}
                onChange={handleLanguageChange}
                label="Language"
                className="bg-white"
              >
                <MenuItem value="english" className="hover:bg-gray-100">English</MenuItem>
                <MenuItem value="spanish" className="hover:bg-gray-100">Spanish</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth variant="outlined" className="mb-4">
              <InputLabel className="text-gray-700">Date format</InputLabel>
              <Select
                value={dateFormat}
                onChange={handleDateFormatChange}
                label="Date format"
                className="bg-white"
              >
                <MenuItem value="MM/DD/YYYY" className="hover:bg-gray-100">MM/DD/YYYY</MenuItem>
                <MenuItem value="DD/MM/YYYY" className="hover:bg-gray-100">DD/MM/YYYY</MenuItem>
              </Select>
            </FormControl>

            <div className="flex items-center justify-between">
              <Typography className="text-gray-800">Newsletter</Typography>
              
            </div>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default Settings;