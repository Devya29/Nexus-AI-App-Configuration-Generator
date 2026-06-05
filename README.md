# Nexus – AI App Configuration Generator

## Overview

Nexus is a compiler-inspired AI system that converts natural language application requirements into validated application configurations.

Instead of relying on a single LLM prompt, Nexus uses a multi-stage generation pipeline with validation and repair mechanisms to improve reliability, consistency, and execution awareness.

The system generates:

* UI Schemas
* API Schemas
* Database Schemas
* Authentication Rules
* Business Logic Configurations

---

## Features

* Multi-stage AI generation pipeline
* Intent extraction from natural language
* System design generation
* UI, API, and Database schema generation
* Validation and repair engine
* Execution simulation
* Metrics tracking
* Multiple domain support

---

## Architecture
![System Architecture](architecture-diagram.png)
```text
User Prompt
      │
Intent Extraction
      │
Validation
      │
System Design
      │
Validation
      │
Schema Generation
      │
Validation
      │
Refinement
      │
Execution Validation
```

---

## Pipeline Stages

### 1. Intent Extraction

Converts natural language requirements into structured information:

* Application Name
* Features
* Roles
* Entities
* Assumptions
* Missing Information

### 2. System Design

Generates application architecture:

* Entities
* Entity Fields
* Relationships
* Roles
* Business Rules
* User Flows

### 3. Schema Generation

Produces:

#### UI Schema

Pages, Components, Layouts

#### API Schema

REST Endpoints and Request/Response Structures

#### Database Schema

Tables, Columns, Constraints

#### Authentication Schema

Roles and Permissions

### 4. Refinement

Performs consistency improvements and cleanup across generated outputs.

---

## Validation & Repair Engine

Validation is executed after every generation stage.

Checks include:

* Missing required fields
* Invalid structures
* Schema inconsistencies
* Malformed outputs

When validation fails:

1. Errors are detected
2. Repair is attempted
3. Corrected output is returned
4. Retry metrics are recorded

---

## Execution Validation

Generated configurations are evaluated using an execution simulation layer.

Validation checks:

* UI Pages Generated
* API Endpoints Generated
* Database Tables Generated
* Structural Completeness

Example:

```json
{
  "uiPages": 12,
  "apiEndpoints": 30,
  "dbTables": 6,
  "validationPassed": true,
  "executionReady": true
}
```

---

## Example Prompt

```text
Create a student attendance management system with students,
teachers, classes, attendance tracking and subjects.
```

Generated outputs include:

* Student Entity
* Teacher Entity
* Class Entity
* Attendance Entity
* Database Tables
* API Endpoints
* UI Pages
* Validation Results

---

## Testing

The system was tested across multiple domains:

### CRM

* Contacts
* Subscriptions
* Authentication

### Hospital Management

* Doctors
* Patients
* Appointments

### E-Commerce

* Products
* Orders
* Customers

### Student Attendance System

* Students
* Teachers
* Classes
* Attendance

Metrics tracked:

* Pipeline Success
* Retry Count
* Stage Duration
* Total Execution Time

---

## Cost vs Quality Tradeoffs

### Why Groq + Llama

Advantages:

* Fast inference
* Low latency
* Cost-effective

Tradeoff:

* Less reasoning depth than larger premium models

### Why Multi-Stage Generation

Advantages:

* Better control
* Easier debugging
* Improved reliability

Tradeoff:

* Slightly higher latency than a single prompt

### Why Validation After Every Stage

Advantages:

* Better consistency
* Reduced failures

Tradeoff:

* Additional processing overhead

---

## Tech Stack

### Frontend

* HTML
* CSS
* JavaScript

### Backend

* Node.js

### AI Layer

* Groq API
* Llama 3

### Validation Layer

* Custom Schema Validation
* Repair Mechanism

---

## Running Locally

Install dependencies:

```bash
npm install
```

Run the application:

```bash
npm start
```

Open:

```text
http://localhost:3000
```

---

## Future Improvements

* Advanced relationship inference
* Runtime application generation
* Clarification loop for ambiguous prompts
* Enhanced business-rule generation
* Cross-layer consistency validation

---

## Author

**Devya Saigal**
