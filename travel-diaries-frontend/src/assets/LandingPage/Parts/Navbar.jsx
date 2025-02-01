import React, { useState, useEffect } from "react";
import LOGO from "../Images/travel-diaries-logo.png";
import { Button, Menu, MenuItem, IconButton } from "@mui/material";
import { ImportContacts, FavoriteBorder, Diamond, ArrowDropDown, Menu as MenuIcon } from "@mui/icons-material";
import MapIcon from "@mui/icons-material/Map";

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

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

  return (
    <nav className="flex flex-row justify-between items-center px-6 py-4 bg-white shadow-md">
      <img src={LOGO} alt="Travel Diaries" className="h-16" />

      <div className="flex flex-row gap-6">
        <Button sx={{ color: "black", "&:hover": { color: "#FAA41F" } }}>
          <MapIcon sx={{ color: "#FAA41F", mr: 1 }} />
          Explore
        </Button>
        <Button sx={{ color: "black", "&:hover": { color: "#FAA41F" } }}>
          <ImportContacts sx={{ color: "#FAA41F", mr: 1 }} />
          Create
        </Button>
        <Button sx={{ color: "black", "&:hover": { color: "#FAA41F" } }}>
          <FavoriteBorder sx={{ color: "#FAA41F", mr: 1 }} />
          Inspire
        </Button>
        <Button sx={{ color: "black", "&:hover": { color: "#FAA41F" } }}>
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
            <MenuItem onClick={handleClose} sx={{ fontWeight: "bold", color: "black" }}>
              Login
            </MenuItem>
            <MenuItem onClick={handleClose} sx={{ fontWeight: "bold", color: "black" }}>
              Start your Travel Diary
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
            Start your Travel Diary
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
