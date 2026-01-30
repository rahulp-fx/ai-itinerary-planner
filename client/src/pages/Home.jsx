import { useState } from "react";
// import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  // const [loading, setLoading] = useState(false);

  // 1. Form State
  const [formData, setFormData] = useState({
    startPoint: "",
    destination: "",
    // startDate: "",
    // endDate: "",
    // budget: "",
    // noOfPeople: 1,
    // preferences: [], // We will just use text for now to keep it simple
    // transportation: [],
  });

  // const transportOptions = [
  //   "Train",
  //   "Flight",
  //   "Bus",
  //   "Bike",
  //   "Walk",
  //   "Car",
  //   "Self Drive",
  // ];

  // 2. Handle Text Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Special handler for Checkboxes
  // const handleTransportChange = (option) => {
  //   const current = formData.transportation;
  //   if (current.includes(option)) {
  //     // Remove if already selected
  //     setFormData({
  //       ...formData,
  //       transportation: current.filter((item) => item !== option),
  //     });
  //   } else {
  //     // Add if not selected
  //     setFormData({ ...formData, transportation: [...current, option] });
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setLoading(true);

      navigate("/calendar", {
        state: {
          startPoint: formData.startPoint,
          destination: formData.destination
        }
      });
  };

  return (
    <div className='form-container'>
      <h1>Plan Your Journey</h1>

      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label>From</label>
          <input
            name='startPoint'
            placeholder='e.g., Mumbai'
            onChange={handleChange}
            required
          />
        </div>

        <div className='form-group'>
          <label>To</label>
          <input
            name='destination'
            placeholder='e.g., Goa'
            onChange={handleChange}
            required
          />
        </div>

        <button type='submit' className='submit-btn'>
          Next
        </button>
      </form>
    </div>
  );
}
