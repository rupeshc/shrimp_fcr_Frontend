import React, { useRef, useEffect } from "react";
import { Box, Button, Typography, Divider, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Icons from @mui/icons-material
import WaterIcon from "@mui/icons-material/Water";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import BarChartIcon from "@mui/icons-material/BarChart";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import PsychologyIcon from "@mui/icons-material/Psychology";

// Custom hook for window dimensions
const useWindowDimensions = () => {
  const [dimensions, setDimensions] = React.useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  React.useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return dimensions;
};

// Live Pattern Component using Canvas
const LivePattern = ({ width, height }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    // Array to store bubbles
    const bubbles = [];
    const bubbleCount = 50;

    // Initialize bubbles
    for (let i = 0; i < bubbleCount; i++) {
      bubbles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 20 + 10,
        speed: Math.random() * 0.5 + 0.1,
        alpha: Math.random() * 0.6 + 0.2,
      });
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
      ctx.fillRect(0, 0, width, height);

      bubbles.forEach((bubble) => {
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(178, 235, 242, ${bubble.alpha})`; // Matching B2EBF2 color
        ctx.fill();
        ctx.closePath();

        bubble.y -= bubble.speed;
        if (bubble.y + bubble.radius < 0) bubble.y = height + bubble.radius;
        bubble.x += Math.sin(bubble.y * 0.01) * 0.5; // Slight horizontal drift
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [width, height]);

  return <canvas ref={canvasRef} width={width} height={height} style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }} />;
};

const MenuPage = () => {
  const navigate = useNavigate();
  const { width, height } = useWindowDimensions();

  const patternsItems = [
    { label: "Water Quality", path: "/water-quality", icon: <WaterIcon fontSize="large" />, color: "#4FC3F7" },
    { label: "Shrimp Growth", path: "/shrimp-growth", icon: <TrendingUpIcon fontSize="large" />, color: "#81C784" },
    { label: "Feed FCR", path: "/feed-fcr", icon: <RestaurantIcon fontSize="large" />, color: "#FFD54F" },
    { label: "Feed Meals", path: "/feed-meals", icon: <FastfoodIcon fontSize="large" />, color: "#FF8A65" },
    { label: "Overall Visualizations", path: "/overall-visualizations", icon: <BarChartIcon fontSize="large" />, color: "#A1887F" },
    { label: "Pond Health Analysis", path: "/pond-health", icon: <HealthAndSafetyIcon fontSize="large" />, color: "#F06292" },
  ];

  const predictionsItems = [
    { label: "Shrimp Survival Prediction", path: "/shrimp-survival", icon: <PsychologyIcon fontSize="large" />, color: "#AB47BC" },
    { label: "Feed Prediction", path: "/feed-prediction", icon: <PsychologyIcon fontSize="large" />, color: "#26A69A" },
  ];

  const addDataItems = [
    { label: "Add Data", path: "/add-data", icon: <AddCircleOutlineIcon fontSize="large" />, color: "#D4E157" },
  ];

  const sectionVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.6, -0.05, 0.01, 0.99] } },
    exit: { opacity: 0, y: -60, transition: { duration: 0.6 } },
  };

  const buttonVariants = {
    hidden: { opacity: 0, x: -120 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.18, duration: 0.9, type: "spring", stiffness: 100, damping: 15 },
    }),
    hover: { scale: 1.12, rotate: 4, boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5)" },
    tap: { scale: 0.94 },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        background: `radial-gradient(circle at 40% 20%, rgba(0, 105, 92, 0.98), rgba(2, 136, 209, 0.92)), url('https://www.transparenttextures.com/patterns/subtle-waves.png')`,
        backgroundSize: "cover, 400px",
        backgroundPosition: "center",
        backgroundBlendMode: "overlay, normal",
      }}
    >
      {/* Live Pattern Layer */}
      <LivePattern width={width} height={height} />

      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          px: { xs: 3, sm: 6, md: 10 },
          py: { xs: 5, sm: 7, md: 9 },
          minHeight: height - 80, // Adjusted to fit window with some padding
          width: "100%",
          maxWidth: "1300px",
          borderRadius: "35px",
          backdropFilter: "blur(15px)",
          background: "rgba(255, 255, 255, 0.18)",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.45), inset 0 0 10px rgba(255, 255, 255, 0.2)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          margin: { xs: "20px 0", sm: "30px 0", md: "50px 0" },
        }}
      >
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.8, ease: [0.43, 0.13, 0.23, 0.96], delay: 0.4 }}
        >
          <Typography
            variant="h1"
            sx={{
              mb: { xs: 6, sm: 8, md: 10 },
              color: "#00BCD4", // Bright cyan-blue solid color
              textShadow: "2px 2px 10px rgba(0, 0, 0, 0.5)", // Reduced shadow for clarity
              fontSize: { xs: "3rem", sm: "4.5rem", md: "6rem" },
              fontWeight: 900,
              letterSpacing: "4px",
              textTransform: "uppercase",
              fontFamily: "'Montserrat', sans-serif",
              lineHeight: 1.1,
            }}
          >
            Shrimp Farming Hub
          </Typography>
        </motion.div>

        {/* Patterns Section */}
        <AnimatePresence>
          <motion.div variants={sectionVariants} initial="hidden" animate="visible" exit="exit">
            <Typography
              variant="h2"
              sx={{
                mb: { xs: 5, sm: 6, md: 7 },
                color: "#B2EBF2",
                fontWeight: 800,
                textShadow: "4px 4px 15px rgba(0, 0, 0, 0.6), 0 0 8px #B2EBF2",
                fontSize: { xs: "2rem", sm: "2.5rem", md: "3.5rem" },
                fontFamily: "'Poppins', sans-serif",
                letterSpacing: "1.5px",
              }}
            >
              Patterns & Insights
            </Typography>
            <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} sx={{ mb: { xs: 6, sm: 7, md: 8 } }}>
              {patternsItems.map((item, index) => (
                <Grid item xs={12} sm={6} md={4} key={item.path}>
                  <motion.div
                    custom={index}
                    variants={buttonVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Button
                      variant="contained"
                      onClick={() => navigate(item.path)}
                      startIcon={item.icon}
                      sx={{
                        width: "100%",
                        height: { xs: "90px", sm: "110px", md: "130px" },
                        py: { xs: 2, sm: 2.5, md: 3 },
                        background: `linear-gradient(135deg, ${item.color}30, ${item.color}10, rgba(255, 255, 255, 0.95))`,
                        color: "#00332A",
                        borderRadius: "25px",
                        border: `3px solid ${item.color}60`,
                        boxShadow: `0 12px 30px rgba(0, 0, 0, 0.35), 0 0 20px ${item.color}40`,
                        fontSize: { xs: "1.1rem", sm: "1.3rem", md: "1.5rem" },
                        fontWeight: 800,
                        textTransform: "capitalize",
                        justifyContent: "flex-start",
                        px: { xs: 3, sm: 4, md: 5 },
                        "&:hover": {
                          background: `linear-gradient(135deg, ${item.color}50, #E0F7FA)`,
                          boxShadow: `0 18px 45px rgba(0, 0, 0, 0.5), 0 0 30px ${item.color}60`,
                          color: "#001A15",
                        },
                        transition: "all 0.6s cubic-bezier(0.34, 0.02, 0.19, 1.02)",
                      }}
                    >
                      {item.label}
                    </Button>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </AnimatePresence>

        <Divider sx={{ my: { xs: 4, sm: 5, md: 6 }, background: "linear-gradient(90deg, #B2EBF2, #80DEEA)", height: "4px", borderRadius: "3px" }} />

        {/* Predictions Section */}
        <AnimatePresence>
          <motion.div variants={sectionVariants} initial="hidden" animate="visible" exit="exit">
            <Typography
              variant="h2"
              sx={{
                mb: { xs: 5, sm: 6, md: 7 },
                color: "#B2EBF2",
                fontWeight: 800,
                textShadow: "4px 4px 15px rgba(0, 0, 0, 0.6), 0 0 8px #B2EBF2",
                fontSize: { xs: "2rem", sm: "2.5rem", md: "3.5rem" },
                fontFamily: "'Poppins', sans-serif",
                letterSpacing: "1.5px",
              }}
            >
              Predictive Analytics
            </Typography>
            <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} sx={{ mb: { xs: 6, sm: 7, md: 8 } }}>
              {predictionsItems.map((item, index) => (
                <Grid item xs={12} md={6} key={item.path}>
                  <motion.div
                    custom={index}
                    variants={buttonVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Button
                      variant="contained"
                      onClick={() => navigate(item.path)}
                      startIcon={item.icon}
                      sx={{
                        width: "100%",
                        height: { xs: "90px", sm: "110px", md: "130px" },
                        py: { xs: 2, sm: 2.5, md: 3 },
                        background: `linear-gradient(135deg, ${item.color}30, ${item.color}10, rgba(255, 255, 255, 0.95))`,
                        color: "#00332A",
                        borderRadius: "25px",
                        border: `3px solid ${item.color}60`,
                        boxShadow: `0 12px 30px rgba(0, 0, 0, 0.35), 0 0 20px ${item.color}40`,
                        fontSize: { xs: "1.1rem", sm: "1.3rem", md: "1.5rem" },
                        fontWeight: 800,
                        textTransform: "capitalize",
                        justifyContent: "flex-start",
                        px: { xs: 3, sm: 4, md: 5 },
                        "&:hover": {
                          background: `linear-gradient(135deg, ${item.color}50, #E0F7FA)`,
                          boxShadow: `0 18px 45px rgba(0, 0, 0, 0.5), 0 0 30px ${item.color}60`,
                          color: "#001A15",
                        },
                        transition: "all 0.6s cubic-bezier(0.34, 0.02, 0.19, 1.02)",
                      }}
                    >
                      {item.label}
                    </Button>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </AnimatePresence>

        <Divider sx={{ my: { xs: 4, sm: 5, md: 6 }, background: "linear-gradient(90deg, #B2EBF2, #80DEEA)", height: "4px", borderRadius: "3px" }} />

        {/* Add Data Section */}
        <AnimatePresence>
          <motion.div variants={sectionVariants} initial="hidden" animate="visible" exit="exit">
            <Typography
              variant="h2"
              sx={{
                mb: { xs: 5, sm: 6, md: 7 },
                color: "#B2EBF2",
                fontWeight: 800,
                textShadow: "4px 4px 15px rgba(0, 0, 0, 0.6), 0 0 8px #B2EBF2",
                fontSize: { xs: "2rem", sm: "2.5rem", md: "3.5rem" },
                fontFamily: "'Poppins', sans-serif",
                letterSpacing: "1.5px",
              }}
            >
              Data Management
            </Typography>
            <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
              {addDataItems.map((item, index) => (
                <Grid item xs={12} key={item.path}>
                  <motion.div
                    custom={index}
                    variants={buttonVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Button
                      variant="contained"
                      onClick={() => navigate(item.path)}
                      startIcon={item.icon}
                      sx={{
                        width: "100%",
                        height: { xs: "90px", sm: "110px", md: "130px" },
                        py: { xs: 2, sm: 2.5, md: 3 },
                        background: `linear-gradient(135deg, ${item.color}30, ${item.color}10, rgba(255, 255, 255, 0.95))`,
                        color: "#00332A",
                        borderRadius: "25px",
                        border: `3px solid ${item.color}60`,
                        boxShadow: `0 12px 30px rgba(0, 0, 0, 0.35), 0 0 20px ${item.color}40`,
                        fontSize: { xs: "1.1rem", sm: "1.3rem", md: "1.5rem" },
                        fontWeight: 800,
                        textTransform: "capitalize",
                        justifyContent: "flex-start",
                        px: { xs: 3, sm: 4, md: 5 },
                        "&:hover": {
                          background: `linear-gradient(135deg, ${item.color}50, #E0F7FA)`,
                          boxShadow: `0 18px 45px rgba(0, 0, 0, 0.5), 0 0 30px ${item.color}60`,
                          color: "#001A15",
                        },
                        transition: "all 0.6s cubic-bezier(0.34, 0.02, 0.19, 1.02)",
                      }}
                    >
                      {item.label}
                    </Button>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </AnimatePresence>
      </Box>

      <style jsx global>{`
        @keyframes bubbleFloat {
          0% {
            transform: translateY(0) scale(0.8);
            opacity: 0.15;
          }
          50% {
            opacity: 0.25;
            transform: translateY(-50vh) scale(1.2);
          }
          100% {
            transform: translateY(-150vh) scale(0.8) rotate(1080deg);
            opacity: 0.1;
          }
        }
        @media (max-width: 600px) {
          .MuiTypography-h1 {
            font-size: 2.8rem !important;
          }
          .MuiTypography-h2 {
            font-size: 2rem !important;
          }
          .MuiButton-root {
            height: 90px !important;
            font-size: 1.1rem !important;
          }
        }
      `}</style>
    </Box>
  );
};

export default MenuPage;