import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { TextField, IconButton, Card, CardContent, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button, Slider } from "@mui/material";
import { MdDelete, MdAdd, MdEdit } from "react-icons/md";
import axios from 'axios';

export default function DiaryPage() {
  const [chapters, setChapters] = useState([
    { id: 1, title: "New chapter", date: "2025-02-20", content: "Write your thoughts here...", images: [] }
  ]);
  const [selectedChapter, setSelectedChapter] = useState(chapters[0]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imageSlots, setImageSlots] = useState([null, null, null, null]);
  const [isCropping, setIsCropping] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedImage, setCroppedImage] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [editTitle, setEditTitle] = useState(selectedChapter.title);
  const [editDate, setEditDate] = useState(selectedChapter.date);

  const handleEdit = async (field, value) => {
    setSelectedChapter((prev) => ({ ...prev, [field]: value }));
    setChapters(
      chapters.map((chapter) =>
        chapter.id === selectedChapter.id ? { ...chapter, [field]: value } : chapter
      )
    );

    // Save to backend after editing title/date
    const updatedChapter = { ...selectedChapter, [field]: value };
    await updateChapterInBackend(updatedChapter);
  };

  const handleAdd = async () => {
    const newChapter = { id: Date.now(), title: "New Chapter", date: new Date().toISOString().split('T')[0], content: "Write your thoughts here...", images: imageSlots };

    try {
      const response = await axios.post('/api/journals', newChapter);
      setChapters([...chapters, response.data.journal]);
      setSelectedChapter(response.data.journal);
    } catch (error) {
      console.error("Error adding chapter:", error);
    }
  };

  const handleImageUpload = async (event, slotIndex) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        setCroppedImage(e.target.result);
        setIsCropping(true);
        setSelectedSlot(slotIndex);

        // Once cropping is done, save the image
        await saveCroppedImage();
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    console.log(croppedArea, croppedAreaPixels);
  }, []);

  const saveCroppedImage = async () => {
    const updatedImageSlots = [...imageSlots];
    updatedImageSlots[selectedSlot] = croppedImage;

    setImageSlots(updatedImageSlots);
    setIsCropping(false);

    const updatedChapter = { ...selectedChapter, images: updatedImageSlots };

    // Save the updated chapter to backend
    await updateChapterInBackend(updatedChapter);
  };

  const updateChapterInBackend = async (updatedChapter) => {
    try {
      const response = await axios.put(`/api/journals/${selectedChapter.id}`, updatedChapter);
      setSelectedChapter(response.data.updatedJournal);
    } catch (error) {
      console.error("Error saving chapter:", error);
    }
  };

  const handleTitleDateChange = () => {
    handleEdit("title", editTitle);
    handleEdit("date", editDate);
    setIsDialogOpen(false);
  };

  return (
    <div className="flex h-screen bg-[#FAA41F]">
      <div className="w-1/4 bg-white p-4 shadow-md flex flex-col">
        <h2 className="text-xl font-bold mb-4">Chapter list</h2>
        <div className="space-y-2">
          {chapters.map((chapter) => (
            <Card 
              key={chapter.id} 
              className={`p-2 cursor-pointer ${selectedChapter?.id === chapter.id ? "bg-gray-200" : ""}`}
              onClick={() => setSelectedChapter(chapter)}
            >
              <CardContent className="flex justify-between items-center">
                <div>
                  <Typography variant="body1" className="font-medium">{chapter.title}</Typography>
                  <Typography variant="body2" className="text-gray-500">{chapter.date}</Typography>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <IconButton onClick={handleAdd} className="bg-[#FAA41F] text-white rounded-full mt-4 mx-auto p-3">
          <MdAdd />
        </IconButton>
      </div>

      <div className="flex-1 flex justify-center items-center p-8">
        {selectedChapter ? (
          <div className="bg-white w-3/4 h-5/6 p-6 shadow-lg rounded-lg relative">
            <h2 className="text-2xl font-bold text-[#FAA41F] cursor-pointer" onClick={() => setIsDialogOpen(true)}>
              {selectedChapter.title}
            </h2>
            <p className="text-gray-500 italic">{selectedChapter.date}</p>
            <textarea
              className="w-full h-40 mt-4 p-2 text-lg bg-transparent outline-none"
              placeholder="Write your thoughts here..."
              value={selectedChapter.content}
              onChange={(e) => handleEdit("content", e.target.value)}
            ></textarea>
            <div className="grid grid-cols-2 gap-4 mt-6">
              {imageSlots.map((img, index) => (
                <div key={index} className="w-full h-24 bg-gray-300 relative flex items-center justify-center">
                  {img ? (
                    <img src={img} alt="Uploaded" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <input type="file" onChange={(e) => handleImageUpload(e, index)} className="hidden" id={`file-upload-${index}`} />
                      <label htmlFor={`file-upload-${index}`} className="cursor-pointer">
                        <MdEdit className="text-[#FAA41F] text-2xl" />
                      </label>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Select a chapter to view</p>
        )}
      </div>

      {/* Title and Date Edit Dialog */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>Edit Chapter Title and Date</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            variant="outlined"
            fullWidth
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Date"
            variant="outlined"
            fullWidth
            type="date"
            value={editDate}
            onChange={(e) => setEditDate(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleTitleDateChange}>Save</Button>
        </DialogActions>
      </Dialog>

      {isCropping && (
        <Dialog open={isCropping} onClose={() => setIsCropping(false)}>
          <DialogTitle>Crop Image</DialogTitle>
          <DialogContent>
            <div className="relative w-full h-64">
              <Cropper
                image={croppedImage}
                crop={crop}
                zoom={zoom}
                aspect={4 / 3}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <Slider value={zoom} min={1} max={3} step={0.1} onChange={(e, value) => setZoom(value)} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsCropping(false)}>Cancel</Button>
            <Button onClick={saveCroppedImage}>Save</Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
}
