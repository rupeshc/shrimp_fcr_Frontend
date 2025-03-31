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
} from "@mui/material";
import { motion } from "framer-motion";
import SendIcon from "@mui/icons-material/Send";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";

const ChatbotSidebar = ({ open, onClose, currentPage }) => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! I'm ShrimpBot, your AI assistant for the Shrimp FCR Prediction Dashboard. I can help you understand graphs, fetch real-time data, or answer questions about the project. What would you like to know?" },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Scroll to the bottom of the chat when new messages are added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user's message to the chat
    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      // Send the message to the backend, including the current page
      const response = await fetch("http://127.0.0.1:5000/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, currentPage: currentPage }),
      });

      const result = await response.json();
      if (response.ok) {
        // Add bot's response to the chat
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

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: { xs: "80%", sm: 350 },
          background: "linear-gradient(to bottom, rgba(0, 51, 102, 0.9), rgba(0, 128, 128, 0.9))",
          color: "#E0F7FA",
          borderLeft: "1px solid rgba(0, 191, 255, 0.5)",
          boxShadow: "0 0 20px rgba(0, 191, 255, 0.3)",
        },
      }}
    >
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
        <IconButton onClick={onClose} sx={{ color: "#E0F7FA" }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider sx={{ backgroundColor: "rgba(0, 191, 255, 0.5)" }} />
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          p: 2,
          background: "rgba(0, 0, 0, 0.2)",
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
                    maxWidth: "80%",
                    color: "#E0F7FA",
                  }}
                />
              </motion.div>
            </ListItem>
          ))}
          <div ref={messagesEndRef} />
        </List>
      </Box>
      <Box sx={{ p: 2, backgroundColor: "rgba(0, 51, 102, 0.8)" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
        </Box>
      </Box>
    </Drawer>
  );
};

export default ChatbotSidebar;