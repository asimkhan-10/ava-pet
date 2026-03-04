# Frontend to Backend Integration Guide

This document outlines the state requirements for each frontend component that has been prepped for backend integration. It details the exact data shapes each component expects.

## 1. Components & Required Data Structures

### `Home.jsx`
- **Component Path:** `src/features/home/Home.jsx`
- **State Variable:** `feedData`
- **Data Type:** `Array of Objects`
- **Expected Object Structure:**
  ```json
  [
    {
      "id": 1,
      "title": "AB Workout",
      "time": "Yesterday",
      "author": "Sarah J.",
      "description": "A pet is a domesticated animal that lives with people...",
      "image": "https://url.to/image.jpg"
    }
  ]
  ```

### `Event.jsx`
- **Component Path:** `src/features/event/Event.jsx`
- **State Variable:** `events`
- **Data Type:** `Array of Objects`
- **Expected Object Structure:**
  ```json
  [
    {
      "id": 1,
      "title": "Summer Meetup",
      "time": "4:00 PM",
      "description": "Description of the event...",
      "interested": 50,
      "coming": 50,
      "location": "10th Avenue, Philadelphia"
    }
  ]
  ```

### `Nearby.jsx`
- **Component Path:** `src/features/nearby/Nearby.jsx`
- **State Variable:** `nearbyDogs`
- **Data Type:** `Array of Objects`
- **Expected Object Structure:**
  ```json
  [
    {
      "id": 1,
      "name": "Trevor",
      "time": "10:00 PM, Yesterday",
      "distance": "200",
      "address": "10th Avenue, Family Park, Philadelphia, America",
      "image": "https://url.to/image.jpg"
    }
  ]
  ```

### `Notification.jsx`
- **Component Path:** `src/features/notification/Notification.jsx`
- **State Variable:** `notifications`
- **Data Type:** `Array of Objects`
- **Expected Object Structure:**
  ```json
  [
    {
      "id": 1,
      "type": "event", // or 'missing'
      "title": "New Event",
      "message": "Special promotion only valid today",
      "date": "Today"
    }
  ]
  ```

### `AddDog.jsx`
- **Component Path:** `src/features/profile/AddDog.jsx`
- **State Variable:** `myDogs`
- **Data Type:** `Array of Objects`
- **Expected Object Structure:**
  ```json
  [
    {
      "id": 1,
      "name": "Trevor",
      "img": "https://url.to/image.jpg",
      "dist": "200 MI Away",
      "address": "10th Avenue, Family Park..." // Optional, mapped to dist dynamically
    }
  ]
  ```

### `Profile.jsx`
- **Component Path:** `src/features/profile/Profile.jsx`
- **State Variable:** `userProfile`
- **Data Type:** `Object`
- **Expected Object Structure:**
  ```json
  {
    "firstName": "Owen",
    "lastName": "Hunt",
    "email": "johndoe12@support.com",
    "location": "Philadelphia, America"
  }
  ```

### `Missingdog.jsx`
- **Component Path:** `src/features/missingDog/Missingdog.jsx`
- **State Variable:** `missingDog`
- **Data Type:** `Object` (or null when loading)
- **Expected Object Structure:**
  ```json
  {
    "name": "Travis",
    "image": "https://url.to/image.jpg",
    "location": "10th Avenue, Family Park, Philadelphia",
    "description": "My dog Yoshi has severe separation anxiety..."
  }
  ```

### `EventDetail.jsx`
- **Component Path:** `src/features/event/Eventdetal.jsx`
- **State Variable:** `eventDetail`
- **Data Type:** `Object` (or null when loading)
- **Expected Object Structure:**
  ```json
  {
    "title": "Lorem Ipsum event",
    "location": "10th Avenue, Philadelphia",
    "interested": 50,
    "coming": 50,
    "notComing": 10,
    "description": "My dog Yoshi has severe separation anxiety..."
  }
  ```

### `CalendarWidget.jsx`
- **Component Path:** `src/components/CalendarWidget.jsx`
- **State Variable:** `upcomingEvents`
- **Data Type:** `Array of Objects`
- **Expected Object Structure:**
  ```json
  [
    {
      "month": "Feb",
      "day": "24",
      "title": "Dog Park Meetup",
      "timeRange": "9:00 AM - 11:00 AM"
    }
  ]
  ```

### `DiscoverNearbyCard.jsx`
- **Component Path:** `src/components/DiscoverNearbyCard.jsx`
- **State Variable:** `nearbyCount`
- **Data Type:** `Integer`
- **Expected Format:** `12`

---

## 2. Integration Instructions

To connect these components to the backend API:

1. **Import `useEffect` and an HTTP client (like `axios`):**
   ```javascript
   import React, { useState, useEffect } from 'react';
   import axios from 'axios';
   ```

2. **Create a `useEffect` hook to fetch data on component mount:**
   Inside the component, use `useEffect` to make the API call and update the state using the setter function.
   
   *Example:*
   ```javascript
   const Home = () => {
       const [feedData, setFeedData] = useState([]);

       useEffect(() => {
           const fetchFeed = async () => {
               try {
                   const response = await axios.get('/api/feed');
                   // Ensure the API response matches the structure listed above
                   setFeedData(response.data); 
               } catch (error) {
                   console.error("Error fetching feed data:", error);
               }
           };

           fetchFeed();
       }, []);
       
       // ...rest of the component
   }
   ```

3. **Handling Loading States:**
   For singular objects like `eventDetail` and `missingDog`, the component checks if the object is truthful (`if (missingDog)`). While waiting for the API to resolve, it dynamically renders a loading `<p>` tag. Make sure your initial state for these is `null`.

4. **Handling Empty Arrays:**
   For lists like `events` or `feedData`, the component checks if the array length is greater than 0 (`events.length > 0`). If the array is empty, it will automatically show a fallback "No events found" message. Keep the initial array state as `[]`.
