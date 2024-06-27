import React, { useState } from 'react';
import './App.css'; // Import your CSS styles

function App() {
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [heightUnit, setHeightUnit] = useState('meters'); // Default unit is meters
    const [bmi, setBmi] = useState(null);
    const [category, setCategory] = useState('');
    const [idealWeight, setIdealWeight] = useState('');
    const [exerciseRecommendations, setExerciseRecommendations] = useState('');
    const [calorieIntake, setCalorieIntake] = useState('');
    const [error, setError] = useState('');

    const calculateBMI = async () => {
        if (!weight || !height) {
            setError('Please enter both weight and height.');
            return;
        }

        if (heightUnit === 'cm' || heightUnit === 'inches') {
            alert('Currently, there are functionality issues with the selected height unit. This will be fixed soon.');
            return;
        }

        let heightInMeters = parseFloat(height);
        if (heightUnit === 'cm') {
            heightInMeters = heightInMeters / 100; // Convert cm to meters
        } else if (heightUnit === 'inches') {
            heightInMeters = heightInMeters * 0.0254; // Convert inches to meters
        }

        try {
            // Add loading indicator
            document.querySelector('.calculate-btn').classList.add('loading');

            const response = await fetch('http://localhost:5000/calculate_bmi', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ weight: parseFloat(weight), height: heightInMeters, height_unit: heightUnit }),
            });

            const data = await response.json();
            setBmi(data.bmi);
            setCategory(data.category);
            setIdealWeight(data.ideal_weight);
            setExerciseRecommendations(data.exercise_recommendations);
            setCalorieIntake(data.calorie_intake);
            setError('');
        } catch (error) {
            setError('Failed to calculate BMI. Please try again.');
        } finally {
            // Remove loading indicator after response
            document.querySelector('.calculate-btn').classList.remove('loading');

            // Example: Add shake animation to the entire App component
            document.querySelector('.App').classList.add('shake-animation');
            setTimeout(() => {
                document.querySelector('.App').classList.remove('shake-animation');
            }, 500); // Reset shake animation after 500ms
        }
    };

    return (
        <div className="App">
            <h1>BMI CALCULATOR</h1>
            <div className="input-group">
                <input
                    type="number"
                    placeholder="Weight (kg)"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                />
                <input
                    type="number"
                    placeholder={`Height (${heightUnit})`}
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                />
                <select
                    value={heightUnit}
                    onChange={(e) => setHeightUnit(e.target.value)}
                >
                    <option value="meters">meters</option>
                    <option value="cm">cm</option>
                    <option value="inches">inches</option>
                </select>
            </div>
            <button className="calculate-btn" onClick={calculateBMI}>
                {bmi ? 'Recalculate' : 'Calculate'}
            </button>
            {error && <p className="error-message">{error}</p>}
            {bmi && (
                <div className="result">
                    <h2>Your BMI: {bmi.toFixed(2)}</h2>
                    <h3>Category: {category}</h3>
                    {idealWeight !== '' && (
                        <p>Ideal Weight: {typeof idealWeight === 'number' ? idealWeight.toFixed(2) + ' kg' : 'N/A'}</p>
                    )}
                    <p>Exercise Recommendations: {exerciseRecommendations}</p>
                    <p>Recommended Calorie Intake: {calorieIntake} calories/day</p>
                </div>
            )}
        </div>
    );
}

export default App;
