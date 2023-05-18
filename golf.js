// Import the necessary libraries
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import mongoose from 'mongoose';

// Define the schema for the golf course data
const GolfCourseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  holes: [{
    id: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  }],
});

// Define the schema for the hole data
const HoleSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  strokeCount: {
    type: Number,
    required: true,
  },
});

// Create a new instance of the MongoDB client
const client = mongoose.connect('mongodb://localhost/golf');

// Create a new instance of the GolfCourse model
const GolfCourseModel = mongoose.model('GolfCourse', GolfCourseSchema);

// Create a new instance of the Hole model
const HoleModel = mongoose.model('Hole', HoleSchema);

// Get the current golf course and hole from the Golf API
useEffect(() => {
  axios.get('https://opengolfapi.com/courses')
    .then((response) => {
      const golfCourse = response.data[0];
      const hole = golfCourse.holes[0];

      // Set the state with the current golf course and hole
      setGolfCourse(golfCourse);
      setHole(hole);
    })
    .catch((error) => {
      console.log(error);
    });
}, []);

// Count the strokes for the current hole
useEffect(() => {
  const { strokeCount } = hole;
  setStrokeCount(strokeCount + 1);
}, [hole]);

// Update the stroke count in MongoDB
useEffect(() => {
  const { strokeCount } = hole;

  // Update the stroke count in MongoDB
  HoleModel.updateOne({
    id: hole.id,
  }, {
    $set: {
      strokeCount,
    },
  }, (err, doc) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Stroke count updated successfully');
    }
  });
}, [strokeCount]);

// Render the app
const App = () => {
  const { golfCourse, hole, strokeCount } = useState(null);

  return (
    <div>
      <h1>Golf Stroke Counter</h1>
      <h2>Golf Course: {golfCourse.name}</h2>
      <h3>Hole: {hole.name}</h3>
      <h4>Stroke Count: {strokeCount}</h4>
    </div>
  );
};

// Render the app on the page
ReactDOM.render(<App />, document.getElementById('root'));
