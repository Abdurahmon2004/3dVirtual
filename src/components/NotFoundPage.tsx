import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        bgcolor: "#f9fafb",
        color: "#333",
        p: 2,
      }}
    >
      {/* Floating 404 animation */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <Typography
          variant="h1"
          fontWeight="bold"
          sx={{
            fontSize: { xs: "6rem", md: "10rem" },
            lineHeight: 1,
            color: "#1976d2",
            textShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
          }}
        >
          404
        </Typography>
      </motion.div>

      <Typography variant="h5" sx={{ mt: 2, fontWeight: 500 }}>
        Sahifa topilmadi 😢
      </Typography>

      <Typography
        variant="body1"
        sx={{ mt: 1, mb: 4, maxWidth: 400, color: "text.secondary" }}
      >
        Siz qidirayotgan sahifa mavjud emas yoki o‘chirib tashlangan bo‘lishi
        mumkin.
      </Typography>

      <Button
        variant="contained"
        color="primary"
        size="large"
        component={motion.button}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => navigate("/")}
      >
        Bosh sahifaga qaytish
      </Button>
    </Box>
  );
}
