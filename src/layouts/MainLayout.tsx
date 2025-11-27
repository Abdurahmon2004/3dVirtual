import React, { useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  createTheme,
  ThemeProvider,
  Button,
  Popover,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Settings as SettingsIcon,
  People as PeopleOutlineIcon,
  MonetizationOn as MonetizationOnIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  AccountBalance,
  ViewQuilt,
  Public,
  HomeWork,
  ArrowBack,
} from "@mui/icons-material";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
const drawerWidth = 240;
export default function MainLayout() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [darkMode, setDarkMode] = React.useState(true);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const toggleDarkMode = () => setDarkMode((prev) => !prev);
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '') : null;
  const theme = React.useMemo(
    () =>
      createTheme({
        typography: {
          fontFamily: '"Montserrat", "Roboto", "Helvetica", "Arial", sans-serif',
          h1: {
            fontFamily: '"Montserrat", sans-serif',
            fontWeight: 700,
          },
          h2: {
            fontFamily: '"Montserrat", sans-serif',
            fontWeight: 700,
          },
          h3: {
            fontFamily: '"Montserrat", sans-serif',
            fontWeight: 600,
          },
          h4: {
            fontFamily: '"Montserrat", sans-serif',
            fontWeight: 600,
          },
          h5: {
            fontFamily: '"Montserrat", sans-serif',
            fontWeight: 600,
          },
          h6: {
            fontFamily: '"Montserrat", sans-serif',
            fontWeight: 600,
          },
          body1: {
            fontFamily: '"Montserrat", sans-serif',
            fontWeight: 400,
          },
          body2: {
            fontFamily: '"Montserrat", sans-serif',
            fontWeight: 400,
          },
          button: {
            fontFamily: '"Montserrat", sans-serif',
            fontWeight: 500,
            textTransform: 'none',
          },
        },
        palette: {
          mode: darkMode ? "dark" : "light",
          primary: { main: "#6366f1" },
          background: {
            default: darkMode ? "#0f172a" : "#ffffff",
            paper: darkMode ? "#1e293b" : "#f8fafc",
          },
          text: {
            primary: darkMode ? "#f1f5f9" : "#111827",
            secondary: darkMode ? "#cbd5e1" : "#475569",
          },
          divider: darkMode ? "#334155" : "#e2e8f0",
        },
        components: {
          MuiTypography: {
            styleOverrides: {
              root: {
                fontFamily: '"Montserrat", sans-serif',
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                fontFamily: '"Montserrat", sans-serif',
                fontWeight: 500,
                textTransform: 'none',
              },
            },
          },
          MuiListItemText: {
            styleOverrides: {
              primary: {
                fontFamily: '"Montserrat", sans-serif',
                fontWeight: 500,
              },
            },
          },
        },
      }),
    [darkMode]
  );

  const menuItems = [
    { text: "Bosh sahifa", icon: <HomeIcon />, path: "/" },
    // { text: "Foydalanuvchilar", icon: <PeopleOutlineIcon />, path: "/users" },
    // { text: "Obyektlar", icon: <AccountBalance />, path: "/objects" },
    // { text: "Bloklar", icon: <ViewQuilt />, path: "/blocks" },
    // { text: "Rejalar", icon: <Public />, path: "/plans" },
    // { text: "Honadonlar", icon: <HomeWork />, path: "/homes" },
    { text: "Sozlamalar", icon: <SettingsIcon />, path: "/settings" },
  ];

  const drawer = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
      }}
    >
      {/* 🔹 Logo qismi */}
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{
            background: "linear-gradient(90deg, #6366f1, #3b82f6)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          3D 
        </Typography>
      </Toolbar>

     
      <List sx={{ flex: 1, mt: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={NavLink}
              to={item.path}
              sx={{
                mx: 1,
                borderRadius: 2,
                "&.active": {
                  bgcolor: darkMode
                    ? "rgba(99,102,241,0.25)"
                    : "rgba(99,102,241,0.1)",
                  borderLeft: `4px solid ${theme.palette.primary.main}`,
                },
                "&:hover": {
                  bgcolor: darkMode
                    ? "rgba(99,102,241,0.15)"
                    : "rgba(99,102,241,0.08)",
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />
      {/* 🔹 Footer */}
      {/* <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          © 2025 3D TUR
        </Typography>
      </Box> */}
    </Box>
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const location = useLocation();
  const hideBackButton = location.pathname.startsWith("/settings");


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
        {/* 🔹 AppBar */}
        <AppBar
          position="fixed"
          elevation={1}
          sx={{
            zIndex: 1,
            bgcolor: "background.paper",
            borderBottom: "1px solid",
            borderColor: "divider",
            color: "text.primary",
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: "none" } }}
            >
              <MenuIcon />
            </IconButton>

            <Typography variant="h6" noWrap sx={{ flexGrow: 1, fontWeight: 600, ml: { md: 10 } }} >
              Admin Panel
            </Typography>

            {!hideBackButton && (
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<ArrowBack />}
                onClick={() => navigate(-1)}
                sx={{
                  textTransform: "none",
                  borderColor: "divider",
                  color: "text.primary",
                  bgcolor: "transparent",
                  mr: 2,
                  "&:hover": {
                    borderColor: "primary.main",
                    bgcolor: darkMode ? "rgba(99,102,241,0.12)" : "rgba(99,102,241,0.08)",
                  },
                }}
              >
                Ortga
              </Button>
            )}

            <IconButton onClick={toggleDarkMode} color="inherit">
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>

            <Avatar
              onClick={handleOpen}
              sx={{
                bgcolor: "#6366f1",
                width: 36,
                height: 36,
                fontSize: 14,
                cursor: "pointer",
                ml: 1,
              }}
            >
              {user?.user?.name?.slice(0, 1).toUpperCase()}
            </Avatar>
            <Popover
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              <Box p={2} minWidth={200}>
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{ mt: 2 }}
                  onClick={() => navigate('/sign-in')}
                >
                  Chiqish
                </Button>
              </Box>
            </Popover>
          </Toolbar>
        </AppBar>

        {/* 🔹 Sidebar */}
        <Box
          component="nav"
          sx={{ width: { md: 70 }, flexShrink: { md: 0 } }}
          aria-label="sidebar"
        >
          {/* Mobil */}
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: "block", md: "none" },
              "& .MuiDrawer-paper": {
                width: 90,
                bgcolor: "background.paper",
                boxSizing: "border-box",
              },
            }}
          >
            {drawer}
          </Drawer>

          {/* Desktop */}
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", md: "block" },
              "& .MuiDrawer-paper": {
                width: 90,
                bgcolor: "background.paper",
                boxSizing: "border-box",
                borderRight: "1px solid",
                borderColor: "divider",
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>

        {/* 🔹 Kontent joyi */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 1, md: 3 },
            width: { md: `calc(100% - ${drawerWidth}px)` },
            mt: { xs: 1, md: 5},
            color: "text.primary",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
