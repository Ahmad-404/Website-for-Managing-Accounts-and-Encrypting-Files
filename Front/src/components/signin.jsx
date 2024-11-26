import React, {useState} from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { useNavigate } from 'react-router-dom';

const defaultTheme = createTheme();

export default function SignIn() {
  const [user, setUser] = useState({
    username: '',
    password: ''
  });

  const navigate = useNavigate();
  
  const handleSubmit = async() => {
    let response = await fetch("http://127.0.0.1:8000/api/customers/check-user/", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    })
    if(response.status === 200){
      let data = await response.json();
      localStorage.setItem('user_id', data.id)
      navigate('/dashboard')
    }else {
      localStorage.setItem('user_id', null)
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="div" sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="username"
              name="email"
              autoComplete="email"
              autoFocus
              value={user.username}
              onChange={e => {
                setUser(data => ({
                  ...data,
                  username: e.target.value
                }))
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={user.password}
              onChange={e => {
                setUser(data => ({
                  ...data,
                  password: e.target.value
                }))
              }}
            />
            <Button
              onClick={handleSubmit}
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>

            <Button
              onClick={()=>{
                navigate('/signup')
              }}
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign up
            </Button>
            
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}