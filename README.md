# Laravel Rental Management System

A full-featured role-based Laravel application designed to manage rental properties efficiently. It supports **Admin**, **Owner**, and **Tenant** roles with distinct capabilities and user experiences.

---

## 🚀 Features

- **Role-Based Access Control**: Admin, Owner, and Tenant roles
- **Property Management**: CRUD operations for properties
- **Tenant Management**: Assignment, status tracking, and communication
- **Rent Collection**: Record, view, and generate receipts for rent
- **Chat System**: Direct communication between tenants and owners
- **Notifications**: In-app alerts for reminders and updates
- **Analytics Dashboard** (Admin)
- **Expense Tracking** (Owner)
- **PDF Rent Receipts**

---

## 🧑‍💻 Tech Stack

| Layer        | Technology             |
|--------------|------------------------|
| Backend      | Laravel 12             |
| Auth         | Laravel laravel/breeze |
| Roles & Permissions | Spatie Laravel Permission |
| Database     | MySQL                  |
| Frontend     | Inertia React + Tailwind CSS |
| PDF Generator| barryvdh/laravel-dompdf |

---

## 🔐 User Roles & Responsibilities

### 👑 Admin
- Manage Owners and Tenants
- Full access to all properties and payments
- View analytics and reports
- Send system-wide notifications

### 🏠 Owner
- Manage their own properties
- Assign tenants to properties
- Track and manage rent and property expenses
- Communicate with tenants

### 🧍 Tenant
- View assigned property details
- Pay rent online
- View payment history
- Download rent receipts
- Communicate with the property owner

---

## 🗃️ Database Schema (Overview)

The app uses the following tables:

- `users`: Core user data and role
- `properties`: Property info linked to owners
- `tenants`: Tenant assignments to properties
- `payments`: Rent payment records
- `messages`: User-to-user messages
- `notifications`: Alerts and updates
- `property_expenses`: Expenses logged by owners

> SQL for all tables is available in `/database/schema.sql`.

---

## 📦 Installation Guide

### 1. Clone the Repository

```bash
git clone https://github.com/ArunSelvan25/system.git
cd system
