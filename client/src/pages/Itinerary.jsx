import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// 1. Register Chart Components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export default function Itinerary() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const response = await axios.get(
          `https://ai-itinerary-planner-henna.vercel.app/api/itinerary/${id}`,
        );
        setTrip(response.data);
      } catch (error) {
        console.error("Error fetching trip:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
  }, [id]);

  const handleSuggestion = () => {
    const suggestion = prompt(
      "We'd love your feedback! What feature should we add next?",
    );
    if (suggestion) {
      alert("Thanks! We've noted your suggestion: " + suggestion);
      // In a real app, you would send this to your backend here
    }
  };

  const handleBookClick = (link) => {
    window.open(link, "_blank");
  };

  if (loading)
    return <div className='loading'>✈️ Loading your dream trip...</div>;
  if (!trip) return <div className='error'>❌ Trip not found!</div>;

  const { generatedPlan } = trip;

  // 2. Prepare Graph Data
  const chartData = {
    labels: ["Food", "Travel", "Stay", "Activities"],
    datasets: [
      {
        label: "Cost Breakdown (INR)",
        data: [
          generatedPlan.budget_breakdown?.food || 0,
          generatedPlan.budget_breakdown?.travel || 0,
          generatedPlan.budget_breakdown?.stay || 0,
          generatedPlan.budget_breakdown?.activities || 0,
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Estimated Expense Split" },
    },
  };

  return (
    <div className='itinerary-container'>
      <div className='nav-header'>
        <Link to='/' className='back-btn'>
          ← Back to Home
        </Link>
        <button onClick={handleSuggestion} className='suggestion-btn'>
          💡 Suggest Feature
        </button>
      </div>

      <header className='trip-header'>
        <h1>
          Trip from {trip.startPoint} to {trip.destination}
        </h1>
        <p>
          📅 {new Date(trip.startDate).toDateString()} -{" "}
          {new Date(trip.endDate).toDateString()}
        </p>
        <span className='budget-tag'>💰 Total Budget: ₹{trip.budget}</span>
      </header>

      <div className='dashboard-grid'>
        {/* Graph Section */}
        <section className='chart-section'>
          <Bar options={chartOptions} data={chartData} />
        </section>

        {/* Text Breakdown */}
        <section className='budget-grid-mini'>
          <div className='budget-card'>
            🍔 Food: ₹{generatedPlan.budget_breakdown?.food}
          </div>
          <div className='budget-card'>
            🚕 Travel: ₹{generatedPlan.budget_breakdown?.travel}
          </div>
          <div className='budget-card'>
            🏨 Stay: ₹{generatedPlan.budget_breakdown?.stay}
          </div>
          <div className='budget-card'>
            🎭 Activities: ₹{generatedPlan.budget_breakdown?.activities}
          </div>
        </section>
      </div>

      {/* Transport & Stays */}
      <section className='info-section'>
        <h2>🚆 Recommended Travel</h2>
        <div className='options-grid'>
          {generatedPlan.transport_options?.map((item, index) => (
            <div key={index} className='option-card'>
              <div className='card-icon'>🚀</div>
              <div className='card-info'>
                <h3>
                  {item.type}: {item.name}
                </h3>
                <p>⏰ {item.time}</p>
                <p className='price'>💰 {item.price}</p>
              </div>
              <button
                className='book-btn'
                onClick={() => handleBookClick(item.link)}
              >
                Check
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className='info-section'>
        <h2>🏨 Where to Stay</h2>
        <div className='options-grid'>
          {generatedPlan.stay_options?.map((item, index) => (
            <div key={index} className='option-card'>
              <div className='card-icon'>🛏️</div>
              <div className='card-info'>
                <h3>{item.name}</h3>
                <p>📍 {item.location}</p>
                <p className='price'>💰 {item.price}</p>
              </div>
              <button
                className='book-btn'
                onClick={() => handleBookClick(item.link)}
              >
                View
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Daily Plan */}
      <section className='timeline-section'>
        <h2>Your Day-by-Day Plan</h2>
        <div className='timeline'>
          {generatedPlan.daily_plan?.map((day, index) => (
            <div key={index} className='day-card'>
              <div className='day-header'>
                <h3>Day {day.day}</h3>
                <span className='day-theme'>{day.theme}</span>
              </div>
              <ul className='activity-list'>
                {day.activities.map((activity, i) => (
                  <li key={i} className='activity-item'>
                    <span className='time'>{activity.time}</span>
                    <div className='details'>
                      <strong>{activity.description}</strong>
                      {activity.cost > 0 && (
                        <span className='cost-badge'>₹{activity.cost}</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
