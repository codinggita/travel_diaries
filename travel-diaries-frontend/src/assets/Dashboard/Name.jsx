import React, { useState } from 'react';
import { Button, TextField, CircularProgress, Checkbox, FormControlLabel, Chip } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import Navbar from '../LandingPage/Parts/Navbar';
import Fontselect from './Fontselect';
import axios from 'axios';

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
  const [isFinished, setIsFinished] = useState(false);
  const [error, setError] = useState(null);

  const handleNext = async () => {
    setLoading(true);
    setError(null);

    try {
      if (step === 2 && notTravelRelated) {
        await submitData();
        setIsFinished(true);
      } else {
        setStep(step + 1);
      }
    } catch (err) {
      setError('Failed to save journal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => setStep(step - 1);

  const handleAddCountry = () => {
    if (countryInput.trim() && !countries.includes(countryInput.trim())) {
      setCountries([...countries, countryInput.trim()]);
      setCountryInput('');
    }
  };

  const handleDeleteCountry = (countryToDelete) => {
    setCountries(countries.filter((country) => country !== countryToDelete));
  };

  const handleFinish = async () => {
    setLoading(true);
    setError(null);

    try {
      await submitData();
      setIsFinished(true);
    } catch (err) {
      setError('Failed to save journal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const submitData = async () => {
    const data = {
      journalTitle,
      countries,
      notTravelRelated,
      startDate: startDate ? startDate.toISOString() : null,
      endDate: endDate ? endDate.toISOString() : null,
    };

    await axios.post('http://localhost:5000/api/journals', data);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="flex-1 flex flex-col justify-center items-center text-center px-6">
        {isFinished ? (
          <Fontselect />
        ) : loading ? (
          <CircularProgress />
        ) : (
          <>
            {error && <div className="text-red-500 mb-4">{error}</div>}

            {step === 1 && (
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
            )}

            {step === 2 && (
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
            )}

            {step === 3 && (
              <>
                <h3 className="text-lg mb-4">Add your travel dates</h3>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <div className="flex flex-col gap-4 items-center">
                    <DatePicker label="Start Date" value={startDate} onChange={(newValue) => setStartDate(newValue)} />
                    <DatePicker label="End Date" value={endDate} onChange={(newValue) => setEndDate(newValue)} />
                  </div>
                </LocalizationProvider>
              </>
            )}
          </>
        )}
      </div>

      {!isFinished && (
        <div className="bg-white py-4 border-t flex items-center justify-between px-4">
          <div>{notTravelRelated && step === 2 ? '2 of 2' : `${step} of 3`}</div>
          <div className="flex gap-2">
            <Button variant="outlined" onClick={handleBack} disabled={step === 1}>Back</Button>
            {step === 3 ? (
              <Button variant="contained" onClick={handleFinish} disabled={!startDate || !endDate}>Finish</Button>
            ) : (
              <Button variant="contained" onClick={handleNext} disabled={step === 1 && !journalTitle.trim()}>Next</Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateJournalPage;