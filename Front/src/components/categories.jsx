import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";

import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableContainer,
  Box,
  Button
} from "@mui/material";

import CategoryIcon from '@mui/icons-material/Category';


const Category = () => {
  const [url, setUrl] = useState('');
  const [data, setData] = useState([]);
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
      setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('http://127.0.0.1:8000/encrypt/', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error:', error);
    }
  }

  const handleDecrypt = async (event) => {
    await fetch('http://127.0.0.1:8000/decrypt/');
  }
  const navigate = useNavigate();

  useEffect(() => {
    if(localStorage.getItem('user_id')){
      getData();
    } else {
      navigate('/')
    }
  }, [])

  const getData = async() => {
    let response = await fetch('http://127.0.0.1:8000/api/customers/socials/' + localStorage.getItem('user_id') + '/')
    if(response.status === 200){
      let items = await response.json()
      setData(items)
    }
  }

  const AddLog = async(soc_id) => {
    let response = await fetch('http://127.0.0.1:8000/api/customers/log/add/' + soc_id + '/')
  }

  function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  return(
    <Box sx={{width: '100%'}}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                Account
              </TableCell>
              <TableCell>
                Username
              </TableCell>
              <TableCell>
                Password
              </TableCell>
              <TableCell>
                Go to
              </TableCell>
              <TableCell>
                logs
              </TableCell>
              <TableCell>
                New Password
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((val) => (
              <TableRow key={val.id}>
                <TableCell>
                  {val.account}
                </TableCell>
                <TableCell>
                  {val.username}
                </TableCell>
                <TableCell>
                  {val.newpass}
                </TableCell>
                <TableCell>
                  <Button onClick={()=>{
                    setUrl(val.url)
                    AddLog(val.id)
                    getData()
                  }}>Link</Button>
                </TableCell>
                <TableCell>
                  <Table>
                    <TableBody>
                      {val.logs.map(val => (
                        <TableRow key={val.id}>
                          <TableCell>{val.created_at}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableCell>
                <TableCell>
                  {makeid(8)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* <iframe src={url}
        style={{
          margin: "30px",
          width: '90vw',
          height: '100vh'
        }}
      >

      </iframe> */}

      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <Button type="submit" variant="contained">Upload</Button>
      </form>
      <Button variant="contained"
        onClick={handleDecrypt}
      >Decryption</Button>

    </Box>
  )
}

export default Category;