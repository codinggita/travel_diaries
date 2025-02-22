import React, { useState, useEffect } from "react";
import LOGO from "./travel-diaries-logo.png";
import { Button, Menu, MenuItem, IconButton, CircularProgress } from "@mui/material";
import { ImportContacts, FavoriteBorder, Diamond, ArrowDropDown, ShoppingCart } from "@mui/icons-material";
import { FaCog } from "react-icons/fa"; // React icon for settings
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

  const handleLogoutClick = () => {
    // Implement logout logic here
    console.log("Logging out...");
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
            <MenuItem onClick={handleLogoutClick} sx={{ fontWeight: "bold", color: "black" }}>
              Logout
            </MenuItem>
            <MenuItem onClick={() => handleNavigate("/cart")} sx={{ fontWeight: "bold", color: "black" }}>
              <ShoppingCart sx={{ color: "#FAA41F", mr: 1 }} />
              Cart
            </MenuItem>
            <MenuItem onClick={() => handleNavigate("/settings")} sx={{ fontWeight: "bold", color: "black" }}>
              <FaCog style={{ color: "#FAA41F", marginRight: "8px" }} />
              Settings
            </MenuItem>
          </Menu>
        </div>
      ) : (
        <div className="flex flex-row gap-1">
          <Button
            onClick={handleLogoutClick}
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
            Logout
          </Button>

          <Button
            onClick={() => handleNavigate("/cart")}
            sx={{
              color: "black",
              backgroundColor: "#FAA41F",
              borderRadius: "20px",
              fontWeight: "bold",
              px: 3,
              transition: "0.3s",
            }}
          >
            <ShoppingCart sx={{ color: "white", mr: 1 }} />
            Cart
          </Button>

          <Button
            onClick={() => handleNavigate("/settings")}
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
            <FaCog style={{ color: "#FAA41F", marginRight: "8px" }} />
            Settings
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
