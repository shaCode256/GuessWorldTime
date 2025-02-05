import pytest
from fastapi.testclient import TestClient
from backend import app, guesses_collection
from unittest.mock import patch

client = TestClient(app)

# Sample test data
VALID_LOCATIONS = ["Tel Aviv", "Jerusalem", "Haifa", "New York", "London"]
TEST_GUESS = {"location": "Tel Aviv", "guessed_time": "10:30 AM"}
WINNING_TIME = "10:30 AM"
LOSING_TIME = "11:00 AM"

@pytest.fixture(autouse=True)
def clear_db():
    """Ensure the database is cleared before each test."""
    guesses_collection.delete_many({})  # Delete all previous guesses

def test_get_locations():
    """Test if the locations API returns the correct locations."""
    response = client.get("/locations")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert set(response.json()) == set(VALID_LOCATIONS)

@patch("backend.get_real_time_for_location", return_value=WINNING_TIME)
def test_submit_winning_guess(mock_time):
    """Test submitting a winning guess (mocked to be correct)."""
    response = client.post("/guess", json=TEST_GUESS)
    assert response.status_code == 200
    assert response.json()["message"] == "Winning guess! submitted and stored"

    # Check if the guess was stored
    results = client.get("/results")
    assert len(results.json()) == 1  # Only one guess should be stored
    assert results.json()[0] == TEST_GUESS

@patch("backend.get_real_time_for_location", return_value=LOSING_TIME)
def test_submit_losing_guess(mock_time):
    """Test submitting a losing guess (mocked to be incorrect)."""
    response = client.post("/guess", json=TEST_GUESS)
    assert response.status_code == 200
    assert response.json()["message"] == "Non-winning guess ignored"

    # Losing guess should NOT be stored
    results = client.get("/results")
    assert results.status_code == 200
    assert len(results.json()) == 0  # No winning guesses stored

def test_get_results_empty():
    """Test retrieving results when there are no stored guesses."""
    response = client.get("/results")
    assert response.status_code == 200
    assert response.json() == []  # Should return an empty list
