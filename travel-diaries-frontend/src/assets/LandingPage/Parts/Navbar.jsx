import React, { useState, useEffect } from "react";
import LOGO from "../Images/travel-diaries-logo.png";
import { Button, Menu, MenuItem, IconButton, CircularProgress } from "@mui/material";
import { ImportContacts, FavoriteBorder, Diamond, ArrowDropDown, Menu as MenuIcon } from "@mui/icons-material";
import MapIcon from "@mui/icons-material/Map";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMenuOpen(null);
  };

  const handleDropdownOpen = (event) => {
    setMenuOpen(event.currentTarget);
  };

  const handleStartDiaryClick = () => {
    setLoading(true);  
    setTimeout(() => {
      setLoading(false);  
      navigate("/auth/register");  
    }, 1500);  
  };

  const handleLoginClick = () => {
    navigate("/auth/login");  
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex flex-row justify-between items-center px-6 py-4 bg-white shadow-md">
      <img src={LOGO} alt="Travel Diaries" className="h-8" />

      <div className="flex flex-row gap-6">
        <Button
          sx={{ color: "black", "&:hover": { color: "#FAA41F" } }}
          onClick={() => handleNavigate("/explore")}
        >
          <MapIcon sx={{ color: "#FAA41F", mr: 1 }} />
          Explore
        </Button>
        <Button
          sx={{ color: "black", "&:hover": { color: "#FAA41F" } }}
          onClick={() => handleNavigate("/create")}
        >
          <ImportContacts sx={{ color: "#FAA41F", mr: 1 }} />
          Create
        </Button>
        <Button
          sx={{ color: "black", "&:hover": { color: "#FAA41F" } }}
          onClick={() => handleNavigate("/inspire")}
        >
          <FavoriteBorder sx={{ color: "#FAA41F", mr: 1 }} />
          Inspire
        </Button>
        <Button
          sx={{ color: "black", "&:hover": { color: "#FAA41F" } }}
          onClick={() => handleNavigate("/membership")}
        >
          <Diamond sx={{ color: "#FAA41F", mr: 1 }} />
          Become a Member
        </Button>
      </div>

      {isMobile ? (
        <div>
          <IconButton onClick={handleDropdownOpen}>
            <ArrowDropDown fontSize="large" />
          </IconButton>
          <Menu anchorEl={menuOpen} open={Boolean(menuOpen)} onClose={handleClose}>
            <MenuItem onClick={handleLoginClick} sx={{ fontWeight: "bold", color: "black" }}>
              Login
            </MenuItem>
            <MenuItem onClick={handleStartDiaryClick} sx={{ fontWeight: "bold", color: "black" }}>
              {loading ? (
                <CircularProgress size={24} sx={{ color: "#FAA41F" }} />
              ) : (
                "Start your Travel Diary"
              )}
            </MenuItem>
            <MenuItem onClick={handleMenuOpen} sx={{ fontWeight: "bold", color: "black" }}>
              Language
            </MenuItem>
          </Menu>

          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
            <MenuItem onClick={handleClose} sx={{ color: "#FAA41F" }}>
              English
            </MenuItem>
            <MenuItem onClick={handleClose} sx={{ color: "#FAA41F" }}>
              Spanish
            </MenuItem>
            <MenuItem onClick={handleClose} sx={{ color: "#FAA41F" }}>
              French
            </MenuItem>
          </Menu>
        </div>
      ) : (
        <div className="flex flex-row gap-1">
          <Button
            onClick={handleLoginClick}
            sx={{
              color: "black",
              border: "3px solid black",
              borderRadius: "20px",
              fontWeight: "bold",
              px: 3,
              transition: "0.3s",
              "&:hover": { color: "#FAA41F" },
            }}
          >
            Login
          </Button>

          <Button
            onClick={handleStartDiaryClick}
            sx={{
              color: "black",
              backgroundColor: "#FAA41F",
              borderRadius: "20px",
              fontWeight: "bold",
              px: 3,
              transition: "0.3s",
            }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              "Start your Travel Diary"
            )}
          </Button>

          <Button
            onClick={handleMenuOpen}
            sx={{
              color: "black",
              border: "3px solid black",
              borderRadius: "20px",
              fontWeight: "bold",
              px: 3,
              transition: "0.3s",
              "&:hover": { color: "#FAA41F" },
            }}
          >
            EN
          </Button>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem onClick={handleClose} sx={{ color: "#FAA41F" }}>
              English
            </MenuItem>
            <MenuItem onClick={handleClose} sx={{ color: "#FAA41F" }}>
              Spanish
            </MenuItem>
            <MenuItem onClick={handleClose} sx={{ color: "#FAA41F" }}>
              French
            </MenuItem>
          </Menu>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
