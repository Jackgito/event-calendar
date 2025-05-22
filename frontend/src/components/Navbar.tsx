// Navbar.tsx
import { useState } from "react"
import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import MenuIcon from "@mui/icons-material/Menu"
import Drawer from "@mui/material/Drawer"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"
import useMediaQuery from "@mui/material/useMediaQuery"
import { useTheme } from "@mui/material/styles"
import LoginModal from "./Authentication/LoginModal"
import RegisterModal from "./Authentication/RegisterModal"
import { useAuthentication } from '@/context/AuthenticationContext';
import { logout } from '@/API/authService';
import { useSnackbar } from '@context/SnackbarContext';

// const navItems = [];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [registerOpen, setRegisterOpen] = useState(false)

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const { user, setUser } = useAuthentication()

  const { showSnackbar } = useSnackbar();

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState)
  }

  const handleLoginOpen = () => {
    setLoginOpen(true)
  }

  const handleLoginClose = () => {
    setLoginOpen(false)
  }

  const handleRegisterOpen = () => {
    setRegisterOpen(true)
  }

  const handleRegisterClose = () => {
    setRegisterOpen(false)
  }

  const handleLogout = async () => {
    logout();
    showSnackbar("Logged out succesfully", "success")
    setUser(null);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      {/* <Typography variant="h6" sx={{ my: 2 }}>
        logo
      </Typography> */}
      <List>
        {/* {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton sx={{ textAlign: "center" }}>
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))} */}
        {(!user) ? (
          <>
            <ListItem disablePadding>
              <ListItemButton sx={{ textAlign: "center" }} onClick={handleLoginOpen}>
                <ListItemText primary="Login" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton sx={{ textAlign: "center" }} onClick={handleRegisterOpen}>
                <ListItemText primary="Register" />
              </ListItemButton>
            </ListItem>
          </>
        ) : (
          <ListItem disablePadding>
            <ListItemButton sx={{ textAlign: "center" }} onClick={handleLogout}>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  )

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: "block" }}>
            {/* logo */}
          </Typography>
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1, ml: 2 }}>
            {(!user) ? (
              <>
                <Button color="inherit" variant="outlined" onClick={handleLoginOpen}>
                  Login
                </Button>
                <Button color="secondary" variant="contained" onClick={handleRegisterOpen}>
                  Register
                </Button>
              </>
            ) : (
              <Button color="inherit" variant="outlined" onClick={handleLogout}>
                Logout
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
        }}
      >
        {drawer}
      </Drawer>

      <LoginModal open={loginOpen} onClose={handleLoginClose} />
      <RegisterModal open={registerOpen} onClose={handleRegisterClose} />
    </Box>
  )
}
