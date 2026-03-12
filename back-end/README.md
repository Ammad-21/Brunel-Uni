EcoMove CO₂ Tracker Backend
Overview

This project implements a backend REST API for tracking transportation trips and calculating carbon dioxide (CO₂) emissions based on the transport method and distance travelled.

The system allows users to create, retrieve, update, and delete trip records while automatically calculating estimated CO₂ emissions.

The backend follows a layered architecture and was developed using Spring Boot with Spring Data JPA for database access and H2 Database Engine for persistence during development.

Technologies Used

Java

Spring Boot

Spring Data JPA

Apache Maven

H2 Database Engine

Thunder Client

System Architecture

The backend follows a standard layered architecture:

controller → handles REST API requests
service → contains application business logic
repository → communicates with the database
model → represents database entities
Controller Layer

Handles incoming HTTP requests and exposes REST endpoints.

Example file:

TripController.java

Responsible for implementing CRUD operations.

Service Layer

Contains the business logic of the application.

Example file:

TripService.java

Responsibilities include:

Processing trip data

Calculating CO₂ emissions

Communicating with the repository layer

Repository Layer

Handles interaction with the database using Spring Data JPA.

Example file:

TripRepository.java

Extends JpaRepository to provide built-in database operations.

Model Layer

Defines the structure of database entities.

Example file:

Trip.java

Represents the Trips table in the database.

Database Design

The application uses an in-memory H2 database.

Trips Table
Column	Description
trip_id	Primary key for trip
user_id	ID of the user who made the trip
transport_mode	Mode of transport (car, bus, etc.)
distance_km	Distance travelled
co2_emission	Calculated CO₂ emissions
created_at	Timestamp of when the trip was recorded

Tables are automatically created using JPA when the application starts.

API Endpoints

The backend exposes the following REST endpoints:

Get all trips
GET /api/trips

Returns all trip records stored in the database.

Get trip by ID
GET /api/trips/{id}

Retrieves a specific trip by its ID.

Create a trip
POST /api/trips

Example request body:

{
 "userId": 1,
 "transportMode": "car",
 "distanceKm": 10
}

The system automatically calculates the CO₂ emission value.

Update a trip
PUT /api/trips/{id}

Updates an existing trip.

Delete a trip
DELETE /api/trips/{id}

Removes the trip from the database.

API Testing

All REST endpoints were tested using Thunder Client inside Visual Studio Code.

The following operations were verified:

GET request retrieving stored trips

POST request creating new trip records

PUT request updating trip data

DELETE request removing trips

The tests confirmed successful interaction between:

Controller

Service

Repository

Database

Running the Application

To run the backend server:

mvn spring-boot:run

The application will start on:

http://localhost:8080
Accessing the Database Console

The H2 database console can be accessed at:

http://localhost:8080/h2-console

Use the configured database URL from application.properties to connect and inspect the Trips table.

Example Query

After connecting to the H2 console:

SELECT * FROM TRIPS;

This displays all stored trip records.

Future Improvements

Potential improvements for the system include:

User authentication and registration

Persistent database such as MySQL or PostgreSQL

Integration with a frontend application

Additional transport modes and emission calculations

Data visualisation for carbon footprint tracking

Author

Backend developed as part of a university software development project demonstrating REST API design, database integration, and layered backend architecture using Spring Boot.
