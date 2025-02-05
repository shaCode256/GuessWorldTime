import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Container, Typography, TextField, MenuItem, Select, FormControl, InputLabel, Box, Paper, Grid, Dialog, DialogActions, DialogTitle } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import backgroundImage from './assets/images/bg.jpg';
import SendIcon from '@mui/icons-material/Send';
import Flag from 'react-world-flags';
import confetti from "canvas-confetti";
// import './App.css';

const theme = createTheme({
  palette: {
    primary: { main: '#3f51b5' },
    secondary: { main: '#f50057' },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h4: { fontSize: '2rem', fontWeight: 700 },
    h6: { fontSize: '1.25rem' },
  },
  shape: { borderRadius: 12 },
});

export const launchConfetti = () => {
  // Configuring the confetti effect
  confetti({
    particleCount: 100, // Number of particles
    angle: 90, // Angle at which the confetti will shoot
    spread: 45, // Spread of the particles
    origin: { x: 0.5, y: 0.5 }, // Origin point of the confetti
    colors: ['#ff0', '#0f0', '#00f', '#f00', '#0ff'], // Colors for the confetti
  });
};

const App = () => {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [guessedTime, setGuessedTime] = useState('');
  const [results, setResults] = useState([]);
  const [language, setLanguage] = useState('en');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const resultsPerPage = 5;

  useEffect(() => {
    axios.get('http://localhost:8000/locations')
      .then(response => setLocations(response.data))
      .catch(error => console.error(error));
  }, []);

  const handleSubmitGuess = () => {
    if (!selectedLocation || !guessedTime) return;
    axios.post('http://localhost:8000/guess', {
      location: selectedLocation,
      guessed_time: guessedTime,
    }, {
      headers: {
        'Accept-Language': language,  // Send language in headers
      }
    })
      .then(response => {
        let isWin = response.data.isWin === 1;
        if (isWin) {
          launchConfetti();
        }
        setDialogMessage(response.data.message);
        setOpenDialog(true);
        axios.get('http://localhost:8000/results')
          .then(response => setResults(response.data))
          .catch(error => console.error(error));
      })
      .catch(error => console.error(error));
  };

  const text = {
    en: {
      title: 'The clock is ticking',
      locationLabel: 'Select a Location',
      guessLabel: 'Guess the Time',
      submitButton: 'Submit Guess',
      resultsTitle: 'Winning guesses',
    },
    he: {
      title: 'השעון מתקתק',
      locationLabel: 'בחר מיקום',
      guessLabel: 'נחש את הזמן',
      submitButton: 'שלח ניחוש',
      resultsTitle: 'ניחושים מנצחים',
    },
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm" sx={{
        textAlign: language === 'he' ? 'right' : 'left',
        direction: language === 'he' ? 'rtl' : 'ltr',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <Box sx={{ textAlign: 'center', marginBottom: '20px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: '10px', direction: 'ltr' }}>
            {['en', 'he'].map(lang => (
              <Button
                startIcon={<Flag code={lang === 'en' ? 'US' : 'IL'} />}  // Use country flags
                key={lang}
                variant="contained"
                onClick={() => setLanguage(lang)}
                sx={{
                  padding: '10px',
                  width: '100px',
                  backgroundColor: language === lang ? '#B0BEC5' : '#607D8B',
                  '&:hover': {
                    transform: 'scale(1.1)',  // Increase size when hover
                    transition: 'transform 0.3s ease'
                  }
                }}
              >
                {lang === 'en' ? 'English' : 'עברית'}
              </Button>
            ))}
          </Box>
        </Box>

        <Paper elevation={3} sx={{
          padding: '10px', backgroundColor: 'rgba(255, 255, 255, 0.6)', // Adjust alpha for transparency
        }}>

          <Typography
            variant="h4"
            gutterBottom
            sx={{
              textAlign: 'center',
              fontWeight: '500', // A lighter, more professional weight
              color: '#212121', // Dark gray (more sophisticated than black)
              fontFamily: "'Roboto', sans-serif", // A clean, professional font
              fontSize: { xs: '1rem', sm: '1.5rem', md: '2rem' }, // Slightly smaller font on small screens
              lineHeight: '1.2', // Tighter line height for a more compact look
              position: 'relative', // Needed to position the glowing border correctly
              padding: '10px', // Padding around the text to make the border visible
              '&::before': {
                content: '""', // This creates an empty pseudo-element
                position: 'absolute',
                top: '0',
                left: '0',
                right: '0',
                bottom: '0',
                border: '2px solid transparent', // Optional: defines border width
                background: 'linear-gradient(45deg, rgba(255, 255, 255, 0) 0%, rgba(0, 191, 255, 0.3) 70%, rgba(255, 255, 255, 0) 100%)', // Change to blue gradient
                backgroundSize: '400% 400%',
                borderRadius: '8px', // Rounded corners (optional)
                animation: 'glow 1.5s infinite', // Animation for glowing effect
              },
              '@keyframes glow': {
                '0%': { backgroundPosition: '0% 50%' },
                '50%': { backgroundPosition: '100% 50%' },
                '100%': { backgroundPosition: '0% 50%' },
              },
            }}
          >
            {text[language].title}
          </Typography>



          {/* Location selection */}
          <FormControl fullWidth sx={{ marginBottom: '20px', direction: language === 'he' ? 'rtl' : 'ltr' }}>
            <InputLabel
              sx={{
                left: language === 'he' ? 'auto' : 0,
                right: language === 'he' ? 32 : 'auto',
                textAlign: language === 'he' ? 'right' : 'left',
                transformOrigin: language === 'he' ? 'right center' : 'left center', // Added for smooth transition
              }}
            >
              {text[language].locationLabel}
            </InputLabel>

            <Select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              label={text[language].locationLabel}
              sx={{
                textAlign: language === 'he' ? 'right' : 'left', // Aligns text inside the Select box
                '& .MuiOutlinedInput-notchedOutline': {
                  textAlign: language === 'he' ? 'right' : 'left', // Outline alignment
                },
              }}
            >
              <MenuItem value="">-- {text[language].locationLabel} --</MenuItem>
              {locations.map((location, index) => (
                <MenuItem key={index} value={location}>
                  {location}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Guessed time input */}
          <TextField
            fullWidth
            label={text[language].guessLabel}
            type="time"
            value={guessedTime}
            onChange={(e) => setGuessedTime(e.target.value)}
            InputLabelProps={{
              shrink: true,
              sx: {
                left: language === 'he' ? 'auto' : 0,
                right: language === 'he' ? 30 : 'auto',
                textAlign: language === 'he' ? 'right' : 'left',
                transformOrigin: language === 'he' ? 'right center' : 'left center', // Added for smooth transition
              }, // הזזת התווית
            }}
            inputProps={{
              style: { textAlign: language === 'he' ? 'right' : 'left' }, // הזזת הטקסט בתוך השדה
            }}
            sx={{
              marginBottom: '20px',
              direction: language === 'he' ? 'rtl' : 'ltr',
              '& .MuiOutlinedInput-notchedOutline': {
                textAlign: language === 'he' ? 'right' : 'left', // Outline alignment
              },
            }}
          />



          <Button
            startIcon={<SendIcon />}
            variant="contained"
            color="primary"
            onClick={handleSubmitGuess}
            sx={{
              width: '100%', padding: '10px',
              backgroundColor: '#607D8B',
              '&:hover': {
                transform: 'scale(1.1)',  // Increase size when hover
                transition: 'transform 0.3s ease',
                backgroundColor: '#B0BEC5'
              }
            }}
            disabled={!selectedLocation || !guessedTime}
          >
            {text[language].submitButton}
          </Button>

          <Typography variant="h6" sx={{ marginTop: '30px', marginBottom: '10px', textAlign: 'center' }}>
            {text[language].resultsTitle}
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Button onClick={() => setCurrentIndex(prev => Math.max(prev - resultsPerPage, 0))} sx={{ marginRight: '10px', padding: '10px' }} disabled={currentIndex === 0}>
              &#8592;
            </Button>
            <Grid container spacing={4}>
              {results.slice(currentIndex, currentIndex + resultsPerPage).map((result, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}> {/* Increase xs and sm values */}
                  <Paper elevation={2} sx={{ padding: '10px', display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                    <Typography>{result.location}</Typography>
                    <Typography>{result.guessed_time}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
            <Button onClick={() => setCurrentIndex(prev => Math.min(prev + resultsPerPage, results.length - resultsPerPage))} sx={{ marginLeft: '10px', padding: '10px' }} disabled={currentIndex + resultsPerPage >= results.length}>
              &#8594;
            </Button>
          </Box>
        </Paper>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>{dialogMessage}</DialogTitle>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color="primary">Close</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ThemeProvider >
  );
};

export default App;
