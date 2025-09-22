import React, { useState, MouseEvent } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
// import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

interface DropdownProps {
  mainButtonText: string;
  arrDropdown: string[];
  onSelect?: (item: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({
  mainButtonText,
  arrDropdown,
  onSelect,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => setAnchorEl(null);

  const handleSelect = (item: string) => {
    if (onSelect) onSelect(item);
    handleClose();
  };

  const ArrowDropDownSVG = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M7 10l5 5 5-5H7z" fill="currentColor" />
    </svg>
  );

  return (
    <div>
      <Button
        id="mui-tailwind-dropdown-btn"
        aria-controls={anchorEl ? "mui-tailwind-dropdown-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={!!anchorEl}
        onClick={handleClick}
        variant="contained"
        color="primary"
        className="!bg-materialUI-LightOnPrimaryContainer dark:!bg-materialUI-DarkPrimaryContainer !text-materialUI-LightPrimaryContainer dark:!text-materialUI-DarkPrimaryContainer font-semibold rounded shadow flex items-center gap-1"
        endIcon={<ArrowDropDownSVG />}
      >
        {mainButtonText}
      </Button>
      <Menu
        id="mui-tailwind-dropdown-menu"
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={handleClose}
        MenuListProps={{
          className: "bg-white dark:bg-gray-100", // Tailwind style here
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        {arrDropdown.map((item) => (
          <MenuItem
            key={item}
            onClick={() => handleSelect(item)}
            className="hover:bg-sky-100 dark:hover:bg-sky-900 transition-colors"
          >
            {item}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default Dropdown;
