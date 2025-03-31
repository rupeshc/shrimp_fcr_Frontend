import React, { useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const WelcomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyPress = () => navigate("/menu");
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [navigate]);

  // Function to determine random starting side and trajectory for bubbles
  const getRandomBubbleProps = () => {
    const sides = ["left", "right", "top", "bottom"];
    const side = sides[Math.floor(Math.random() * 4)];
    const size = Math.random() * 30 + 10; // Size between 10-40px for water drops
    let startPos = {};
    let endPos = {};

    switch (side) {
      case "left":
        startPos = { left: "0", top: `${Math.random() * 100}vh` };
        endPos = { transform: `translate(${Math.random() * 100}vw, ${Math.random() * 50 - 25}vh)` };
        break;
      case "right":
        startPos = { right: "0", top: `${Math.random() * 100}vh` };
        endPos = { transform: `translate(-${Math.random() * 100}vw, ${Math.random() * 50 - 25}vh)` };
        break;
      case "top":
        startPos = { top: "0", left: `${Math.random() * 100}vw` };
        endPos = { transform: `translate(${Math.random() * 50 - 25}vw, ${Math.random() * 100}vh)` };
        break;
      case "bottom":
        startPos = { bottom: "0", left: `${Math.random() * 100}vw` };
        endPos = { transform: `translate(${Math.random() * 50 - 25}vw, -${Math.random() * 100}vh)` };
        break;
      default:
        break;
    }

    return {
      startPos,
      endPos,
      size,
      duration: Math.random() * 10 + 5, // Random duration 5-15s
    };
  };

  // Function to determine positions for wave-end bubbles
  const getWaveBubbleProps = (index) => {
    return {
      bottom: "0",
      left: `${(index * 5) + 5}%`,
      size: Math.random() * 15 + 5, // Size between 5-20px
      duration: Math.random() * 8 + 4,
    };
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `
          url('/shrimp.jpg'),
          linear-gradient(to bottom, rgba(55, 93, 109, 0.4), rgba(0, 33, 71, 0.6))
        `,
        backgroundSize: "cover, auto",
        backgroundPosition: "center, center",
        backgroundRepeat: "no-repeat, no-repeat",
        backgroundAttachment: "fixed",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.05)",
          zIndex: 1,
        },
      }}
    >
      {/* Wave Pattern Container at the Bottom */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "200px", // Fixed height at the bottom
          zIndex: 2,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: "-100%",
            width: "300%",
            height: "100%",
            background: "linear-gradient(to top, rgba(0, 191, 255, 0.5), transparent)",
            clipPath: "polygon(0% 85%, 5% 75%, 10% 85%, 15% 70%, 20% 80%, 25% 65%, 30% 75%, 35% 60%, 40% 70%, 45% 55%, 50% 65%, 55% 50%, 60% 60%, 65% 45%, 70% 55%, 75% 40%, 80% 50%, 85% 35%, 90% 45%, 95% 30%, 100% 40%, 100% 100%, 0% 100%)",
            animation: "waveHorizontal 15s linear infinite",
            zIndex: 2,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: "-100%",
            width: "300%",
            height: "100%",
            background: "linear-gradient(to top, rgba(0, 191, 255, 0.4), transparent)",
            clipPath: "polygon(0% 75%, 5% 65%, 10% 75%, 15% 60%, 20% 70%, 25% 55%, 30% 65%, 35% 50%, 40% 60%, 45% 45%, 50% 55%, 55% 40%, 60% 50%, 65% 35%, 70% 45%, 75% 30%, 80% 40%, 85% 25%, 90% 35%, 95% 20%, 100% 30%, 100% 100%, 0% 100%)",
            animation: "waveHorizontal 15s linear infinite -7.5s",
            zIndex: 2,
          }}
        />
        {/* Wave-end Bubbles */}
        {[...Array(20)].map((_, index) => {
          const { bottom, left, size, duration } = getWaveBubbleProps(index);
          return (
            <Box
              key={index}
              sx={{
                position: "absolute",
                width: `${size}px`,
                height: `${size}px`,
                background: "radial-gradient(circle, rgba(0, 191, 255, 0.8) 20%, rgba(0, 191, 255, 0.3) 60%, transparent 100%)", // Transparent water drop effect
                border: "1px solid rgba(0, 191, 255, 0.5)",
                borderRadius: "50%",
                boxShadow: "0 0 10px rgba(0, 191, 255, 0.3)",
                animation: `float ${duration}s infinite linear`,
                bottom: bottom,
                left: left,
                zIndex: 3,
              }}
              style={{ transform: `translate(${Math.random() * 50 - 25}vw, ${Math.random() * 20}vh)` }}
            />
          );
        })}
      </Box>

      {/* Bubble Containers (Random Across Page) */}
      {[...Array(50)].map((_, index) => {
        const { startPos, endPos, size, duration } = getRandomBubbleProps();
        return (
          <Box
            key={index}
            sx={{
              position: "absolute",
              width: `${size}px`,
              height: `${size * 1.2}px`,
              background: "radial-gradient(circle, rgba(0, 191, 255, 0.8) 20%, rgba(0, 191, 255, 0.3) 60%, transparent 100%)", // Transparent water drop effect
              border: "1px solid rgba(0, 191, 255, 0.5)",
              borderRadius: "50%",
              boxShadow: "0 0 10px rgba(0, 191, 255, 0.3)",
              animation: `float ${duration}s infinite linear`,
              ...startPos,
              zIndex: 3,
            }}
            style={endPos}
          />
        );
      })}

      {/* Content with Wave Mingling Effect */}
      <Box
        sx={{
          position: "relative",
          zIndex: 4,
          textAlign: "center",
          padding: 4,
          animation: "contentWave 15s linear infinite",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <Typography
            variant="h1"
            sx={{
              fontWeight: "bold",
              color: "#E0F7FA",
              textShadow: "4px 4px 15px rgba(0, 0, 0, 0.8)",
              fontSize: { xs: "3rem", sm: "4.5rem", md: "6rem" },
              letterSpacing: "0.1em",
              fontFamily: "'Poppins', sans-serif", // Updated font family
            }}
          >
            SHRIMP FARMING HUB~~
          </Typography>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <Typography
            variant="h5"
            sx={{
              mt: 2,
              color: "#B2EBF2",
              fontSize: { xs: "1.2rem", md: "1.8rem" },
              textShadow: "1px 1px 5px rgba(0, 0, 0, 0.5)",
              fontFamily: "'Roboto', sans-serif", // Updated font family
            }}
          >
            LETS EXPLORE AND DIVE IN__!
          </Typography>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <Button
            variant="contained"
            onClick={() => navigate("/menu")}
            sx={{
              mt: 4,
              px: 4,
              py: 1.5,
              backgroundColor: "#4CAF50",
              color: "#fff",
              fontSize: "1.2rem",
              fontWeight: "bold",
              borderRadius: "30px",
              boxShadow: "0 5px 20px rgba(0, 0, 0, 0.4)",
              "&:hover": {
                backgroundColor: "#388E3C",
                transform: "scale(1.05)",
                boxShadow: "0 8px 25px rgba(0, 0, 0, 0.5)",
              },
              transition: "all 0.3s ease",
              fontFamily: "'Montserrat', sans-serif", // Updated font family
            }}
          >
            Get Started
          </Button>
        </motion.div>
      </Box>

      <style jsx global>{`
        @keyframes waveHorizontal {
          0% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }
        @keyframes float {
          0% { opacity: 0.4; }
          20% { opacity: 0.8; }
          80% { opacity: 0.8; }
          100% { opacity: 0; }
        }
        @keyframes contentWave {
          0% { transform: translateY(0); }
          25% { transform: translateY(-10px); }
          50% { transform: translateY(0); }
          75% { transform: translateY(10px); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </Box>
  );
};

export default WelcomePage;
