import React, { useState } from 'react';
import { Button, TextField, CircularProgress, Checkbox, FormControlLabel, Chip } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { FaFacebookF, FaPinterestP, FaTwitter, FaInstagram } from 'react-icons/fa';
import Navbar from '../LandingPage/Parts/Navbar';

const CreateJournalPage = () => {
  const [journalTitle, setJournalTitle] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [countryInput, setCountryInput] = useState('');
  const [countries, setCountries] = useState([]);
  const [notTravelRelated, setNotTravelRelated] = useState(false);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  const handleNext = () => {
    setLoading(true);
    setTimeout(() => {
      setStep(step + 1);
      setLoading(false);
    }, 500);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleAddCountry = () => {
    if (countryInput.trim() && !countries.includes(countryInput.trim())) {
      setCountries([...countries, countryInput.trim()]);
      setCountryInput('');
    }
  };

  const handleDeleteCountry = (countryToDelete) => {
    setCountries(countries.filter((country) => country !== countryToDelete));
  };

  const handleConfirmDates = () => {
    setConfirmed(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <Navbar />

      {/* Body */}
      <div className="flex-1 flex flex-col justify-center items-center text-center px-6">
        {loading ? (
          <CircularProgress />
        ) : step === 1 ? (
          <>
            <h3 className="text-lg mb-4">Give a title to your journal</h3>
            <TextField
              variant="standard"
              placeholder="Enter journal title"
              InputProps={{
                disableUnderline: true,
                style: {
                  fontSize: '3rem',
                  textAlign: 'center',
                  fontWeight: 300,
                  color: journalTitle ? 'black' : '#9ca3af',
                },
              }}
              value={journalTitle}
              onChange={(e) => setJournalTitle(e.target.value)}
              fullWidth
              sx={{ maxWidth: '600px', '& input': { textAlign: 'center' } }}
            />
          </>
        ) : step === 2 ? (
          <>
            <h3 className="text-lg mb-4">Which countries is it about?</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {countries.map((country) => (
                <Chip
                  key={country}
                  label={country}
                  onDelete={() => handleDeleteCountry(country)}
                  sx={{ fontSize: '1.25rem', padding: '8px 12px', borderColor: '#FAA41F' }}
                />
              ))}
            </div>
            <TextField
              variant="standard"
              placeholder="Add more..."
              InputProps={{
                disableUnderline: true,
                style: {
                  fontSize: '3rem',
                  textAlign: 'center',
                  fontWeight: 300,
                  color: countryInput ? 'black' : '#9ca3af',
                },
              }}
              value={countryInput}
              onChange={(e) => setCountryInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCountry()}
              fullWidth
              sx={{ maxWidth: '600px', '& input': { textAlign: 'center' } }}
            />
            <FormControlLabel
              control={<Checkbox checked={notTravelRelated} onChange={(e) => setNotTravelRelated(e.target.checked)} />}
              label="This diary is not related to travelling"
              className="mt-4"
            />
          </>
        ) : (
          <>
            <h3 className="text-lg mb-4">Add your travel dates</h3>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div className="flex flex-col gap-4 items-center">
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  slotProps={{ textField: { variant: 'outlined', sx: { '& .MuiOutlinedInput-root': { borderColor: '#FAA41F' } } } }}
                />
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  slotProps={{ textField: { variant: 'outlined', sx: { '& .MuiOutlinedInput-root': { borderColor: '#FAA41F' } } } }}
                />
              </div>
            </LocalizationProvider>

            <Button
              variant="contained"
              className="mt-6"
              onClick={handleConfirmDates}
              disabled={!startDate || !endDate}
              sx={{ backgroundColor: '#FAA41F', '&:hover': { backgroundColor: '#e6951c' } }}
            >
              Confirm Dates
            </Button>

            {confirmed && startDate && endDate && (
              <div className="mt-4 text-lg font-semibold text-green-600">
                Your journey is from {startDate.format('MMMM D, YYYY')} to {endDate.format('MMMM D, YYYY')}
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="bg-white py-4 border-t flex items-center justify-between px-4">
        <div>{step} of 3</div>
        <div className="flex gap-2">
          <Button variant="outlined" onClick={handleBack} disabled={step === 1} sx={{ borderColor: '#FAA41F', color: '#FAA41F' }}>
            Back
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={
              (step === 1 && !journalTitle.trim()) ||
              (step === 2 && countries.length === 0 && !notTravelRelated) ||
              (step === 3 && (!startDate || !endDate))
            }
            sx={{ backgroundColor: '#FAA41F', '&:hover': { backgroundColor: '#e6951c' } }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : step === 3 ? 'Finish' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateJournalPage;
