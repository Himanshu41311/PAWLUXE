# 🐾 Pawluxe – Pet Adoption & Listing Platform

Pawluxe is a full-stack web application built to connect pet lovers across India. It allows users to list, adopt, or ethically purchase pets — including rescued animals and purebred pets — through a transparent and secure platform.

> ⚠️ This is a solo-built, work-in-progress project using Java Spring Boot, PostgreSQL, and plain HTML/CSS/JavaScript.  
> Designed with a microservices architecture and modular REST APIs.

---

## 🌟 Key Features (Planned & In Progress)

- 🐶 **Pet Listings**: Add/view pets with breed, age, price, location, and image
- 🆓 **Free Adoption**: List rescued or stray pets for community rehoming
- 💸 **Paid Listings**: Owners can list pets (e.g., ₹45,000 for GSD) for ethical sales
- 📦 **Infinite Scroll**: Pet cards load as user scrolls (like Instagram)
- 🔐 **User Auth**: OTP-based signup/login using email or phone *(in progress)*
- 🖼️ **Image Upload**: Separate microservice for pet image uploads *(planned)*
- 💳 **Payments**: Razorpay integration for secure buyer-seller transactions *(planned)*
- 🏷️ **Trust Markers**: Indicate if pet is insured *(planned)*

---

## 🛠️ Tech Stack

**Backend**
- Java 17
- Spring Boot (Microservices)
- Spring Data JPA
- REST APIs
- PostgreSQL

**Frontend**
- HTML, CSS, JavaScript (Vanilla)

**Other Tools**
- Razorpay (planned)
- Cloudinary or AWS S3 (for image storage - planned)

---

## 🧱 Architecture (Modular Services)

```text
|-- Auth Service           -> OTP-based authentication
|-- Pet Service            -> Manages listings and filtering
|-- Image Upload Service   -> Stores and serves pet images
|-- Payment Service        -> Razorpay payment flow (planned)
|-- PostgreSQL Database    -> Stores user and pet data
|-- Frontend (Vanilla JS)  -> UI with infinite scroll & adoption form
