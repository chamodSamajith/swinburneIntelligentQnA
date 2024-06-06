import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';

import useAuth from '../../hooks/useAuth';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Razor Chat Bot
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const defaultTheme = createTheme();

const Buttons = ({ onClick }) => {
  const topics = ['ERN-Enrol and applying', 'T FFA - Fee and Financial Assistance', 'Studying Online', 'MBA', 'TAFE', 'Technology', 'Level of Education', 'STARS', 'Short course'];
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 0 }}>
      {topics.map((topic, index) => (
        <Button key={index} variant="outlined" size="small"onClick={() => onClick(topic,index)}  sx={{
          borderColor: '#c94c4c',
          color: '#c94c4c',
          padding: '2px 8px', // Adjust padding to make the button smaller
          fontSize: '0.75rem', // Adjust font size to make the text smaller
          '&:hover': {
            borderColor: '#c94c4c',
            backgroundColor: 'rgba(201, 76, 76, 0.04)',
          },
        }}>
          {topic}
        </Button>
      ))}
    </Box>
  );
};

const Home = () => {
  const [question, setQuestion] = useState('');
  const [buttonsVisible, setButtonsVisible] = useState(true); // State to control button visibility
  const [selectedTopic, setTopic] = useState(0);

  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    return `${hours}:${minutes}:${seconds}`;
  };

  const [chats, setChats] = useState([
    {
      primary: 'Razor',
      secondary: "Hello! I am Razor, Swinburne University's virtual assistant. I can assist you with your queries with regard to our university and courses.",
      avatarSrc:
        'https://media2.giphy.com/media/6a0mBtXHlkE3uFh2Sb/giphy_s.gif?cid=6c09b952tltg0delr0ghw23drc61n5d8jt4xsebjd2wk7n4g&ep=v1_internal_gif_by_id&rid=giphy_s.gif&ct=s',
      time: getCurrentTime(),
    },
  ]);

  const navigate = useNavigate();

  const updateQuestion = (event) => {
    event.preventDefault();
    const val = event.target.value;
    setQuestion(val);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const newQuestion = question;

    // Clear the input field after submitting
    setQuestion('');

    // Create a new chat object with the user's question
    const newChat = {
      primary: 'You',
      secondary: newQuestion,
      avatarSrc: '',
      time: getCurrentTime(),
    };

    setChats((prevChats) => [...prevChats, newChat]);

    const queryBody = JSON.stringify({
      question: newQuestion,
      // topic: selectedTopic
    });

    axios({
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      method: 'POST',
      url: 'http://127.0.0.1:5000/ask',
      data: queryBody,
    })
      .then((response) => {
        if (response.status === 200) {
          const newChat2 = {
            primary: 'Razor',
            secondary: response.data.answer,
            avatarSrc:
              'https://media2.giphy.com/media/6a0mBtXHlkE3uFh2Sb/giphy_s.gif?cid=6c09b952tltg0delr0ghw23drc61n5d8jt4xsebjd2wk7n4g&ep=v1_internal_gif_by_id&rid=giphy_s.gif&ct=s',
            time: getCurrentTime(),
          };
          setChats((prevChats) => [...prevChats, newChat2]);
        } else {
          const newChat2 = {
            primary: 'Razor',
            secondary: 'I have no information over that',
            avatarSrc:
              'https://media2.giphy.com/media/6a0mBtXHlkE3uFh2Sb/giphy_s.gif?cid=6c09b952tltg0delr0ghw23drc61n5d8jt4xsebjd2wk7n4g&ep=v1_internal_gif_by_id&rid=giphy_s.gif&ct=s',
            time: getCurrentTime(),
          };
          setChats((prevChats) => [...prevChats, newChat2]);
        }
      })
      .catch(() => setMsg());
  };

  const setMsg = () => {
    const newChat2 = {
      primary: 'Razor',
      secondary: 'Sorry! There is a technical difficulty, I am unable to answer your question.',
      avatarSrc:
        'https://media2.giphy.com/media/6a0mBtXHlkE3uFh2Sb/giphy_s.gif?cid=6c09b952tltg0delr0ghw23drc61n5d8jt4xsebjd2wk7n4g&ep=v1_internal_gif_by_id&rid=giphy_s.gif&ct=s',
      time: getCurrentTime(),
    };
    setChats((prevChats) => [...prevChats, newChat2]);
  };

  const handleButtonClick = (topic,index) => {
    setButtonsVisible(false); // Hide buttons after a topic is selected
    setTopic(index);


      // Replace Razor's first chat with the selected topic name
  setChats((prevChats) => [
    {
      primary: 'Razor',
      secondary: "Ask your question about " + topic,
      avatarSrc:
        'https://media2.giphy.com/media/6a0mBtXHlkE3uFh2Sb/giphy_s.gif?cid=6c09b952tltg0delr0ghw23drc61n5d8jt4xsebjd2wk7n4g&ep=v1_internal_gif_by_id&rid=giphy_s.gif&ct=s',
      time: getCurrentTime(),
    },
    ...prevChats.slice(1) // Keep the rest of the chats unchanged
  ]);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage:
              'url(https://media2.giphy.com/media/6a0mBtXHlkE3uFh2Sb/giphy_s.gif?cid=6c09b952tltg0delr0ghw23drc61n5d8jt4xsebjd2wk7n4g&ep=v1_internal_gif_by_id&rid=giphy_s.gif&ct=s)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'fit',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 4,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: '',
            }}
          >
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <Paper style={{ maxHeight: 450, overflow: 'auto' }}>
                <List
                  sx={{
                    width: '100%',
                    maxWidth: 500,
                    bgcolor: 'background.paper',
                    position: 'relative',
                    overflow: 'auto',
                    height: 450,
                    '& ul': { padding: 0 },
                  }}
                >
                  {/* Map over items array to render ListItems */}
                  {chats.map((item, index) => (
                    <React.Fragment key={index}>
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar alt={item.primary} src={item.avatarSrc} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={item.primary}
                          secondary={item.secondary + '  ' + item.time}
                        />
                      </ListItem>
                
                      {index !== chats.length - 1 && <Divider variant="inset" component="li" />}
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
              <TextField
                margin="normal"
                required
                fullWidth
                name="question"
                label="Ask your question"
                type="text"
                id="question"
                onChange={updateQuestion}
                autoComplete="current-question"
                InputLabelProps={{
                  sx: {
                    '&.Mui-focused': {
                      color: '#c94c4c', // focused label color
                    },
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#c94c4c', // focused border color
                    },
                  },
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, backgroundColor: '#c94c4c', color: 'white' }}
              >
                Ask
              </Button>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default Home;
