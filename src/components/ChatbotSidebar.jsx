import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Paper,
  MenuItem,
} from "@mui/material";
import { motion } from "framer-motion";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const ChatbotSidebar = ({ open, onClose, currentPage }) => {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! I'm ShrimpBot, your AI assistant for the Shrimp FCR Prediction Dashboard. Start typing or click 'View All Questions' to explore!",
    },
  ]);
  const [input, setInput] = useState("");
  const [questions, setQuestions] = useState({}); // Store categorized questions
  const [showQuestions, setShowQuestions] = useState(false); // Toggle question list visibility
  const [suggestions, setSuggestions] = useState([]); // Store autocomplete suggestions
  const [expanded, setExpanded] = useState(false); // Toggle sidebar width
  const [width, setWidth] = useState(350); // Default width
  const messagesEndRef = useRef(null);
  const dragRef = useRef(null);

  // Fetch questions from the backend when the component mounts
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/chatbot/questions");
        if (!response.ok) {
          throw new Error("Failed to fetch questions");
        }
        const data = await response.json();
        setQuestions(data);
        const allQuestions = Object.values(data).flat();
        setSuggestions(allQuestions);
      } catch (err) {
        console.error("Error fetching questions:", err);
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "Sorry, I couldn't fetch the list of questions. Please try again later." },
        ]);
      }
    };
    fetchQuestions();
  }, []);

  // Scroll to the bottom of the chat whenever messages update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Update suggestions as the user types
  useEffect(() => {
    if (input.trim()) {
      const filtered = Object.values(questions)
        .flat()
        .filter((q) => q.toLowerCase().includes(input.toLowerCase()))
        .slice(0, 5); // Limit to top 5 suggestions
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [input, questions]);

  // Handle sending a message to the chatbot
  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setSuggestions([]); // Clear suggestions after sending

    try {
      const response = await fetch("http://127.0.0.1:5000/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, currentPage }),
      });
      const result = await response.json();
      if (response.ok) {
        const botMessage = { sender: "bot", text: result.response };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        const botMessage = { sender: "bot", text: "Sorry, I couldn't process your request." };
        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (err) {
      const botMessage = { sender: "bot", text: "Error connecting to the backend." };
      setMessages((prev) => [...prev, botMessage]);
      console.error(err);
    }
  };

  // Handle Enter key press to send a message
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  // Handle user selecting a suggestion
  const handleSuggestionSelect = (question) => {
    setInput(question);
    setSuggestions([]);
    handleSendMessage();
  };

  // Handle clicking the "View All Questions" button
  const handleViewQuestions = () => {
    setShowQuestions(true);
    const botMessage = { sender: "bot", text: "Here are the questions I can answer:" };
    setMessages((prev) => [...prev, botMessage]);
    setSuggestions([]);
  };

  // Toggle sidebar width
  const toggleExpand = () => {
    setExpanded(!expanded);
    setWidth(expanded ? 350 : 500); // Toggle between default (350px) and expanded (500px)
  };

  // Handle resizing by dragging
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (dragRef.current) {
        const newWidth = window.innerWidth - e.clientX;
        if (newWidth >= 300 && newWidth <= 600) {
          setWidth(newWidth);
        }
      }
    };

    const handleMouseUp = () => {
      dragRef.current = null;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    const handleMouseDown = () => {
      dragRef.current = true;
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };

    const resizeBar = document.getElementById("resize-bar");
    if (resizeBar) {
      resizeBar.addEventListener("mousedown", handleMouseDown);
    }

    return () => {
      if (resizeBar) {
        resizeBar.removeEventListener("mousedown", handleMouseDown);
      }
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: { xs: "80%", sm: width },
          background: "linear-gradient(to bottom, rgba(0, 51, 102, 0.9), rgba(0, 128, 128, 0.9))",
          color: "#E0F7FA",
          borderLeft: "1px solid rgba(0, 191, 255, 0.5)",
          boxShadow: "0 0 20px rgba(0, 191, 255, 0.3)",
          position: "relative",
        },
      }}
    >
      {/* Resize bar */}
      <Box
        id="resize-bar"
        sx={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 5,
          backgroundColor: "rgba(0, 191, 255, 0.5)",
          cursor: "ew-resize",
          "&:hover": { backgroundColor: "#00BFFF" },
        }}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          backgroundColor: "rgba(0, 51, 102, 0.8)",
        }}
      >
        <Typography variant="h6">ShrimpBot</Typography>
        <Box>
          <IconButton onClick={toggleExpand} sx={{ color: "#E0F7FA", mr: 1 }}>
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
          <IconButton onClick={onClose} sx={{ color: "#E0F7FA" }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>
      <Divider sx={{ backgroundColor: "rgba(0, 191, 255, 0.5)" }} />
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          p: 2,
          background: "rgba(0, 0, 0, 0.2)",
          maxHeight: "calc(100vh - 150px)", // Adjusted for input and header
        }}
      >
        <List>
          {messages.map((msg, index) => (
            <ListItem
              key={index}
              sx={{
                justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ListItemText
                  primary={msg.text}
                  sx={{
                    backgroundColor:
                      msg.sender === "user" ? "#0288D1" : "#4CAF50",
                    borderRadius: 2,
                    p: 1,
                    maxWidth: "90%", // Increased to ensure text fits
                    color: "#E0F7FA",
                    wordBreak: "break-word", // Prevent text overflow
                  }}
                />
              </motion.div>
            </ListItem>
          ))}
          {showQuestions && (
            <Box
              sx={{
                p: 1,
                backgroundColor: "rgba(0, 51, 102, 0.7)",
                borderRadius: 2,
                maxHeight: 300,
                overflowY: "auto", // Scrollable question list
              }}
            >
              {Object.entries(questions).map(([category, questionsList]) => (
                <Box key={category} sx={{ mb: 2 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ color: "#00BFFF", fontWeight: "bold", mb: 1, pl: 1 }}
                  >
                    {category}
                  </Typography>
                  {questionsList.map((question, idx) => (
                    <ListItem
                      key={idx}
                      button
                      onClick={() => {
                        setInput(question);
                        handleSendMessage();
                        setShowQuestions(false);
                      }}
                      sx={{
                        p: 1,
                        "&:hover": { backgroundColor: "rgba(0, 191, 255, 0.2)" },
                      }}
                    >
                      <ListItemText
                        primary={question}
                        sx={{
                          color: "#E0F7FA",
                          wordBreak: "break-word", // Ensure long questions wrap
                        }}
                      />
                    </ListItem>
                  ))}
                </Box>
              ))}
            </Box>
          )}
          <div ref={messagesEndRef} />
        </List>
      </Box>
      <Box sx={{ p: 2, backgroundColor: "rgba(0, 51, 102, 0.8)", position: "relative" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <TextField
            fullWidth
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything..."
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#2A4066",
                color: "#E0F7FA",
                borderRadius: 2,
                "& fieldset": { borderColor: "rgba(0, 191, 255, 0.5)" },
                "&:hover fieldset": { borderColor: "#00BFFF" },
                "&.Mui-focused fieldset": { borderColor: "#00BFFF" },
              },
              "& .MuiInputBase-input": { color: "#E0F7FA" },
            }}
          />
          <IconButton
            onClick={handleSendMessage}
            sx={{ color: "#E0F7FA", "&:hover": { color: "#00BFFF" } }}
          >
            <SendIcon />
          </IconButton>
          <Button
            variant="contained"
            onClick={handleViewQuestions}
            sx={{
              backgroundColor: "#4CAF50",
              color: "#E0F7FA",
              "&:hover": { backgroundColor: "#45a049" },
              whiteSpace: "nowrap",
            }}
          >
            View All Questions
          </Button>
        </Box>
        {suggestions.length > 0 && input.trim() && (
          <Paper
            sx={{
              position: "absolute",
              bottom: 70,
              left: 20,
              right: 20,
              maxHeight: 150,
              overflowY: "auto",
              backgroundColor: "#2A4066",
              borderRadius: 2,
              zIndex: 1000,
            }}
          >
            {suggestions.map((suggestion, index) => (
              <MenuItem
                key={index}
                onClick={() => handleSuggestionSelect(suggestion)}
                sx={{
                  color: "#E0F7FA",
                  "&:hover": { backgroundColor: "rgba(0, 191, 255, 0.2)" },
                  wordBreak: "break-word",
                }}
              >
                {suggestion}
              </MenuItem>
            ))}
          </Paper>
        )}
      </Box>
    </Drawer>
  );
};

export default ChatbotSidebar;