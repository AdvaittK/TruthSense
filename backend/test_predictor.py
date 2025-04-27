import numpy as np
from predictor import Predictor

def test_predictions():
    p = Predictor()
    print("Testing random predictions:")
    
    truth_count = 0
    fake_count = 0
    
    for i in range(10):
        result = p._generate_dummy_prediction()
        prediction = result["prediction"]
        confidence = result["confidence"]
        
        if prediction == "Truth":
            truth_count += 1
        else:
            fake_count += 1
            
        print(f"Test {i+1}: {prediction} with {confidence:.1f}% confidence")
        print(f"  Features: Facial:{result['features']['facialExpressions']:.1f}%, " +
              f"Voice:{result['features']['voiceAnalysis']:.1f}%, " +
              f"Gestures:{result['features']['microGestures']:.1f}%")
    
    print(f"\nResults: Truth: {truth_count}, Fake: {fake_count}")
    
if __name__ == "__main__":
    test_predictions()
