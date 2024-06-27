from flask import Blueprint, request, jsonify
from flask_cors import CORS, cross_origin

api_bp = Blueprint('api', __name__)
CORS(api_bp)  # Enable CORS for the blueprint

@api_bp.route('/calculate_bmi', methods=['POST'])
@cross_origin()  # Allow CORS for this specific route
def calculate_bmi():
    data = request.get_json()
    weight = data.get('weight')
    height = data.get('height')
    height_unit = data.get('height_unit', 'meters')  # Default unit is meters

    if weight is None or height is None or height_unit not in ['meters', 'cm', 'inches']:
        return jsonify({'error': 'Invalid input'}), 400

    bmi = calculate_bmi_logic(weight, height, height_unit)

    # Check for very high BMI values before calculations
    if bmi > 100:
        return jsonify({'error': 'Calculated BMI is very high. Please check your input values.'}), 400

    category = classify_bmi(bmi)
    ideal_weight = calculate_ideal_weight(height, height_unit)
    exercise_recommendations = recommend_exercises(category)
    calorie_intake = calculate_calorie_intake(ideal_weight)

    return jsonify({
        'bmi': bmi,
        'category': category,
        'ideal_weight': ideal_weight,
        'exercise_recommendations': exercise_recommendations,
        'calorie_intake': calorie_intake
    })

def calculate_bmi_logic(weight, height, height_unit):
    height_meters = convert_height_to_meters(height, height_unit)
    bmi = weight / (height_meters ** 2)
    return bmi

def convert_height_to_meters(height, height_unit):
    if height_unit == 'cm':
        return height / 100.0  # Convert cm to meters (divide by 100.0)
    elif height_unit == 'inches':
        if not (1 <= height <= 120):  # Example check for reasonable height range in inches
            raise ValueError("Invalid height value. Please enter a height between 1 and 120 inches.")
        return height * 0.0254  # Convert inches to meters
    else:
        return height  # Assume height is already in meters if unit is 'meters'

def classify_bmi(bmi):
    if bmi < 18.5:
        return 'Underweight'
    elif 18.5 <= bmi < 24.9:
        return 'Normal weight'
    elif 25 <= bmi < 29.9:
        return 'Overweight'
    else:
        return 'Obesity'

def calculate_ideal_weight(height, height_unit):
    height_meters = convert_height_to_meters(height, height_unit)
    ideal_weight_kg = 22.5 * (height_meters ** 2)
    return ideal_weight_kg

def recommend_exercises(category):
    # Function to provide exercise recommendations based on BMI category
    # Implement your logic here (replace with your recommendations)
    if category == 'Underweight':
        return 'Recommendations for underweight exercises (consult a healthcare professional)'
    elif category == 'Normal weight':
        return 'Recommendations for maintaining normal weight (consider low-impact exercises)'
    elif category == 'Overweight':
        return 'Recommendations for overweight exercises (consult a healthcare professional)'
    elif category == 'Obesity':
        return 'Recommendations for obesity exercises (consult a healthcare professional)'
    else:
        return ''

def calculate_calorie_intake(ideal_weight):
    # Function to calculate recommended daily calorie intake based on ideal weight
    # Implement your logic here (replace with a more appropriate formula)
    return ideal_weight * 30  # Example calculation, adjust as needed
