require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Groq = require("groq-sdk");
const Itinerary = require("./models/Itinerary"); // Import Schema

const app = express();
app.use(cors({
  origin: ["https://ai-itinerary-web-omega.vercel.app/", "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));
app.options('*', cors()); 

app.use(express.json());

// 1. Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// 2. Initialize GROQ
const groq = new Groq({ apikey: process.env.GROQ_API_KEY });

// 3. The API Route
app.post("/api/generate-itinerary", async (req, res) => {
  const {
    startPoint,
    destination,
    startDate,
    endDate,
    budget,
    noOfPeople,
    preferences,
    transportation,
  } = req.body;

  try {
    // Construct the prompt for the AI
    const prompt = `
    Act as a professional travel agent. Create a trip FROM ${startPoint} TO ${destination}.
  Dates: ${startDate} to ${endDate}.
  Travelers: ${noOfPeople}.
  Budget: ₹${budget}.
  Preferences: ${preferences.join(", ")}.
  Preferred Transport: ${transportation ? transportation.join(", ") : "Any"}.

  CRITICAL:
  1. If "Self Drive" is selected, recommend route details and car rentals.
  2. If "Train/Flight" is selected, recommend specific train/flight numbers.

  RETURN ONLY VALID JSON...
      
      JSON Structure:
      {
        "trip_name": "String (e.g., 'Relaxing Goa Getaway')",
        "budget_breakdown": {"food": Number, "travel": Number, "stay": Number, "activities": Number},
        
        "transport_options": [
           { 
             "type": "String (e.g., Train, Flight, Bus, or Car Rental)",
             "name": "String (e.g., '12903 Golden Temple Mail' or 'IndiGo 6E-554' or 'ZoomCar')",
             "time": "String (e.g., '14:30 - 18:00' or 'Pickup 10am')",
             "price": "String (e.g., '₹1,500/person')",
             "link": "String (Use a generic search link like 'https://www.google.com/search?q=flight+Delhi+to+Goa')"
           }
        ],

        "stay_options": [
           {
             "name": "String (e.g., 'Sunshine Resort')",
             "location": "String (e.g., 'Calangute Beach')",
             "rating": "String (e.g., '4.5 Stars')",
             "price": "String (e.g., '₹3,000/night')",
             "link": "String (Generic google search link)"
           }
        ],

        "daily_plan": [
          {
            "day": 1,
            "theme": "String",
            "activities": [
              {"time": "String", "description": "String", "cost": Number}
            ]
          }
        ]
      }
    `;

    // 4. GET Route to fetch a specific itinerary
    app.get("/api/itinerary/:id", async (req, res) => {
      try {
        const trip = await Itinerary.findById(req.params.id);
        if (!trip) {
          return res.status(404).json({ error: "Trip not found" });
        }
        res.json(trip);
      } catch (error) {
        res.status(500).json({ error: "Server error" });
      }
    });

    // Call GROQ
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a helpful travel assistant that outputs ONLY valid JSON.",
        },
        { role: "user", content: prompt },
      ],
      model: "llama-3.3-70b-versatile", // Fast and Free
      temperature: 0.5,
    });

    const text = completion.choices[0]?.message?.content || "";

    console.log("--- AI RESPONSE ---");
    // console.log(text); // Uncomment to debug

    // Clean up if the AI adds markdown ticks
    const cleanedText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    const jsonResponse = JSON.parse(cleanedText);

    // C. Save to Database
    const newItinerary = new Itinerary({
      startPoint,
      destination,
      startDate,
      endDate,
      budget,
      noOfPeople,
      preferences,
      generatedPlan: jsonResponse,
    });

    await newItinerary.save();

    // D. Send back to Frontend
    res.json(newItinerary);
  } catch (error) {
    console.error("❌ AI Error:", error);
    res
      .status(500)
      .json({ error: "Failed to generate itinerary", details: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
