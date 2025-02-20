import React, { useState, useCallback } from 'react';
import { Button, CircularProgress, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Cropper from 'react-easy-crop';
import Navbar from '../LandingPage/Parts/Navbar';

const DropArea = styled('div')(({ isDragging }) => ({
  border: `2px dashed ${isDragging ? '#FAA41F' : '#ccc'}`,
  borderRadius: '8px',
  padding: '40px',
  textAlign: 'center',
  backgroundColor: isDragging ? '#FFF7E6' : '#FAFAFA',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
}));

const ImageUploadPage = ({ bookTitle }) => {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [cropping, setCropping] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      setImage(file);
      setImageURL(URL.createObjectURL(file));
      setCropping(true);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setImageURL(URL.createObjectURL(file));
      setCropping(true);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const getCroppedImage = async () => {
    setLoading(true);
    try {
      const imageElement = new Image();
      imageElement.src = imageURL;
      await new Promise((resolve) => (imageElement.onload = resolve));

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx.drawImage(
        imageElement,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      canvas.toBlob((blob) => {
        const croppedImage = new File([blob], image.name, { type: 'image/jpeg' });
        setImage(croppedImage);
        setImageURL(URL.createObjectURL(croppedImage));
        setCropping(false);
        setLoading(false);
      }, 'image/jpeg');
    } catch (error) {
      console.error('Crop failed', error);
      setLoading(false);
    }
  };

  const handleSave = () => {
    const bookData = {
      title: bookTitle,
      coverImage: image,
    };
    console.log('Book saved:', bookData);
    // Submit bookData to API or state management
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-1 flex flex-col justify-center items-center text-center px-6">
        <Typography variant="h4" className="mb-4 font-semibold">Add Cover Photo</Typography>
        <Typography variant="body1" className="mb-6 text-gray-600">
          Upload a <strong>landscape</strong> cover photo. The right side will appear on the front of your book cover.
        </Typography>

        {!cropping && !previewMode && (
          <DropArea
            isDragging={isDragging}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => document.getElementById('fileInput').click()}
          >
            {image ? (
              <img src={imageURL} alt="Uploaded" className="max-h-48 mx-auto" />
            ) : (
              <Typography variant="body1" className="text-gray-500">
                <span className="text-orange-500 font-medium">Select</span> or drag and drop an image here
              </Typography>
            )}
            <input id="fileInput" type="file" accept="image/*" hidden onChange={handleFileChange} />
          </DropArea>
        )}

        {cropping && (
          <div className="relative w-80 h-80 bg-black">
            <Cropper
              image={imageURL}
              crop={crop}
              zoom={zoom}
              aspect={16 / 9}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
        )}

        {previewMode && (
          <div className="relative w-60 h-96 bg-gray-300 flex items-center justify-start overflow-hidden border rounded-2xl border-gray-400 shadow-lg" style={{ perspective: '1000px' }}>
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${imageURL})`, backgroundPosition: 'right' }} />
            <div className="absolute left-0 w-1 bg-gray-700 h-full" />
          </div>
        )}
      </div>

      <div className="bg-white py-4 border-t flex items-center justify-between px-4">
        <Button variant="outlined" onClick={() => setPreviewMode(false)}>Back</Button>
        <div className="flex gap-2">
          {cropping ? (
            <Button variant="contained" onClick={getCroppedImage} disabled={loading} sx={{ backgroundColor: '#FAA41F' }}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Save Crop'}
            </Button>
          ) : previewMode ? (
            <Button variant="contained" onClick={handleSave} sx={{ backgroundColor: '#FAA41F' }}>Save Book</Button>
          ) : (
            <Button variant="contained" onClick={() => setPreviewMode(true)} disabled={!image} sx={{ backgroundColor: '#FAA41F' }}>Next</Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUploadPage;