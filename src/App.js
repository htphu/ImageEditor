import React, { useRef, useState, useEffect } from 'react';
import './App.css';
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import CropIcon from '@mui/icons-material/Crop';

import { Container, Button, Slider, Grid, Typography, Stack, Card, useMediaQuery } from '@mui/material';
import { display } from '@mui/system';


function App() {
  const inputImage = useRef();
  const imageRef = useRef();
  const [srcImage, setSrcImage] = useState();

  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast] = useState(100);
  const [saturate, setSaturate] = useState(1);
  const [grayscale, setGrayscale] = useState(0);
  const [sepia, setSepia] = useState(0);
  const [rotate, setRotate] = useState(0);
  const [flipHorizontal, setFlipHorizontal] = useState(1);
  const [flipVertical, setFlipVertical] = useState(1);

  const [crop, setCrop] = useState('')

  useEffect(() => {
    if (srcImage) {
      imageRef.current.style.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}) grayscale(${grayscale}%) sepia(${sepia}%)`;
      imageRef.current.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal},${flipVertical})`;

    }

  }, [brightness, contrast, saturate, grayscale, sepia, rotate, flipHorizontal, flipVertical, srcImage])

  function handleDisable() {
    return !srcImage ? true : false;
  }

  function handleChangeImage(e) {
    setSrcImage(URL.createObjectURL(e.target.files[0]));
    resetOptions();
  }

  function handleRotate(type) {
    if (type === 'right') {
      setRotate(rotate + 90)
    } else if (type === 'left') {
      setRotate(rotate - 90)
    }
  }

  function handleFlip(type) {
    if (type === 'h') {
      //Horizontal
      setFlipHorizontal(flipHorizontal * -1) //1 <=> -1 
    } else if (type === 'v') {
      //Vertical
      setFlipVertical(flipVertical * -1) //1 <=> -1 
    }
  }
  function resetOptions() {
    setBrightness(100);
    setContrast(100);
    setSaturate(1);
    setGrayscale(0);
    setSepia(0);
    setFlipHorizontal(1);
    setFlipVertical(1);
    setRotate(0);
    setCrop('');
  }
  function imageCrop() {
    const canvas = document.createElement('canvas')
    const scaleX = imageRef.current.naturalWidth / imageRef.current.width
    const scaleY = imageRef.current.naturalHeight / imageRef.current.height
    canvas.width = crop.width;
    canvas.height = crop.height;

    const ctx = canvas.getContext('2d')

    ctx.drawImage(
      imageRef.current,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    )

    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      setSrcImage(url)
      setCrop('')
    })
  }
  function saveImage() {
    const canvas = document.createElement("canvas");
    canvas.width = imageRef.current.naturalWidth;
    canvas.height = imageRef.current.naturalHeight;

    const ctx = canvas.getContext("2d");
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}) grayscale(${grayscale}%) sepia(${sepia}%)`;
    ctx.rotate(rotate * Math.PI / 180);
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(flipHorizontal, flipVertical);
    ctx.drawImage(imageRef.current, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

    const link = document.createElement("a");
    link.download = "image.jpg";
    link.href = canvas.toDataURL();
    link.click();
  }

  return (
    <div className="App" style={{ backgroundColor: "#E7E9EB" }}>
      <Container maxWidth="lg" sx={{ display: "flex",alignItems: 'center', justifyContent: "center", alignItems: "center", minHeight: "100vh"}} >
        <Grid container sx={{ flexDirection: { xs: 'column', md: 'row' } }} spacing={2} alignItems="center" justifyContent='center'>
          {/* Image */}
          <Grid item xs={12} md={8}>
            {srcImage ?
              <ReactCrop crop={crop} ruleOfThirds={true} onChange={c => setCrop(c)}>
                <img ref={imageRef} style={{ maxWidth: '100%', maxHeight: '100%' }} src={srcImage} alt='previewImage'></img>
              </ReactCrop>
              : 'Choose image'}
          </Grid>

          {/* Control */}
          <Grid item xs={10} md={3} sx={{ backgroundColor: 'while', width: '100%', display: 'flex', justifyContent:"center"}} >
            <Card sx={{ 
                      width: '100%',
                      padding: "30px 20px", 
                      borderRadius: "10px",      
                      display: 'flex', 
                      flexDirection:{xs: "row", md:"column"}
                    }} 
                    >
              <Grid container rowSpacing={2} direction="column">
                {/* filters */}
                <Grid item>
                  <Typography align='left' sx={{ fontSize: 14, textTransform: 'capitalize' }}>brightness:</Typography>
                  <Slider
                    disabled={handleDisable()}
                    onChange={(e) => setBrightness(e.target.value)}
                    value={brightness}
                    defaultValue={100}
                    min={0}
                    max={300}
                    size='small'
                    valueLabelDisplay="auto"></Slider>
                </Grid>

                <Grid item>
                  <Typography align='left' sx={{ fontSize: 14, textTransform: 'capitalize' }}>contrast:</Typography>
                  <Slider
                    disabled={handleDisable()}
                    onChange={(e) => setContrast(e.target.value)}
                    value={contrast}
                    defaultValue={100}
                    min={0}
                    max={300}
                    size='small'
                    valueLabelDisplay="auto"></Slider>
                </Grid>

                <Grid item>
                  <Typography align='left' sx={{ fontSize: 14, textTransform: 'capitalize' }}>saturate:</Typography>
                  <Slider
                    disabled={handleDisable()}
                    onChange={(e) => setSaturate(e.target.value)}
                    value={saturate}
                    defaultValue={1}
                    min={0}
                    max={10}
                    step={0.5}
                    size='small'
                    valueLabelDisplay="auto"></Slider>
                </Grid>

                <Grid item>
                  <Typography align='left' sx={{ fontSize: 14, textTransform: 'capitalize' }}>grayscale:</Typography>
                  <Slider
                    disabled={handleDisable()}
                    onChange={(e) => setGrayscale(e.target.value)}
                    value={grayscale}
                    defaultValue={0}
                    min={0}
                    max={100}
                    size='small'
                    valueLabelDisplay="auto"></Slider>
                </Grid>

                <Grid item>
                  <Typography align='left' sx={{ fontSize: 14, textTransform: 'capitalize' }}>sepia:</Typography>
                  <Slider
                    disabled={handleDisable()}
                    onChange={(e) => setSepia(e.target.value)}
                    value={sepia}
                    defaultValue={0}
                    min={0}
                    max={100}
                    size='small'
                    valueLabelDisplay="auto"></Slider>
                </Grid>
              </Grid>
              <Grid container rowSpacing={2} direction="column">
                <Grid item columnGap={2} >
                  <Typography align='left' sx={{ fontSize: 14 }}>Xoay ảnh:</Typography>

                  <Stack direction="row" gap={2} justifyContent='center'  flexWrap="wrap">
                    <Button
                      onClick={() => { handleRotate('right') }}
                      disabled
                      variant="outlined"
                    >
                      <RotateRightIcon />
                    </Button>
                    <Button
                      onClick={() => { handleRotate('left') }}
                      disabled
                      variant="outlined">
                      <RotateLeftIcon />
                    </Button>
                  </Stack>
                </Grid>

                <Grid item>
                  <Typography align='left' sx={{ fontSize: 14 }}>Lật ảnh:</Typography>

                  <Stack direction="row" gap={2} justifyContent='center'  flexWrap="wrap">
                    <Button
                      onClick={() => { handleFlip('h') }}
                      disabled={handleDisable()}
                      variant="outlined">
                      <SwapHorizIcon />
                    </Button>
                    <Button
                      onClick={() => { handleFlip('v') }}
                      disabled={handleDisable()}
                      variant="outlined">
                      <SwapVertIcon />
                    </Button>
                  </Stack>
                </Grid>

                <Grid item>
                  <Typography align='left' sx={{ fontSize: 14 }}>Cắt ảnh:</Typography>
                  <Button
                    variant='outlined'
                    disabled={!crop ? true : false}
                    onClick={() => imageCrop()}
                    className='crop'
                  > <CropIcon /> Crop</Button>

                </Grid>

                <Grid item >
                  {/* up and download img */}
                  <Stack direction="row" gap={2} justifyContent="center" flexWrap="wrap">
                    <Button
                      variant="contained"
                      onClick={() => { inputImage.current.click() }}
                    >
                      <FileUploadIcon /> Chọn ảnh
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => saveImage()}
                      disabled={handleDisable()}
                      color="success">
                      <FileDownloadIcon /> Tải ảnh
                    </Button>
                  </Stack>
                </Grid>
                <input ref={inputImage} onChange={(e) => handleChangeImage(e)} type="file" accept="image/png, image/jpeg" hidden />
              </Grid>
            </Card>
          </Grid>

        </Grid>
      </Container>
    </div>
  );
}

export default App;
