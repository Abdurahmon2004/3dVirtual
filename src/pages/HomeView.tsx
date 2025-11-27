import { useState } from "react";
import Building from "../components/Building";
import { House } from "../types/House";
import HouseModal from "../components/HouseModal";
import { Link } from "react-router-dom";
import { Dialog, DialogContent } from "@mui/material";

export default function HomeView() {
  const [selectedHouse, setSelectedHouse] = useState<House | null>(null);
  const [selectOpen, setSelectOpen] = useState(false);
  const handleHouseClick = (house: House) => {
    setOpen(true);
    setSelectOpen(false);
    setSelectedHouse(house);
  };
  const handleCloseSheet = () => {
    setSelectedHouse(null);
  };
  const handleStartVirtualTour = (house: House) => {
    const currentUrl = window.location.href;
    const tourUrl = `${currentUrl}vizual?tour=true&house=${house.id}&room=${house.virtualTourRoomId}`;
    window.open(tourUrl, "_blank");
    setSelectedHouse(null);
  };
  const [open, setOpen] = useState(false);
  const handleDialog = () => {
    setSelectOpen(true);
    setOpen(false);
  }
  return (
    <>
      <div className="min-h-screen">
        <div className="w-full">
          <div className="flex flex-wrap justify-center">
            <Building  />
          </div>
        </div>
      </div>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
      >
        <DialogContent>
          <div className="flex justify-center gap-4 p-4">
            <Link to="/add-images" className="bg-blue-600 text-white rounded-md py-2 px-3">Vizual qo'shish</Link>
            <button className="bg-green-600 text-white rounded-md py-2 px-3" onClick={() => handleDialog()} >Vizualni ko'rish</button>
          </div>
        </DialogContent>
      </Dialog>
      {selectOpen && (
        <HouseModal
          house={selectedHouse}
          onClose={handleCloseSheet}
          onStartVirtualTour={handleStartVirtualTour}
        />
      )}
    </>
  )
}
