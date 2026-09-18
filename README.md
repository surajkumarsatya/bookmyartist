# BookMyArtist

A responsive artist discovery and booking web application built as a frontend hiring assignment.

BookMyArtist allows users to discover artists, search and filter the catalog, view detailed artist profiles, check availability, estimate booking prices, and complete a validated multi-step booking request.

The project is built from scratch with Next.js, TypeScript, Tailwind CSS, and Zustand, using local mock data and API-like asynchronous services instead of a real backend.

## Live Project

- GitHub: [github.com/surajkumarsatya/bookmyartist](https://github.com/surajkumarsatya/bookmyartist)
- Live Deployment: *Add deployed URL here*
- Demo Video: *Add Loom/YouTube/Google Drive link here*

## Features

### Artist Listing

- 36 mock artists stored in a local JSON data source.
- Responsive artist card grid.
- Artist cards display photo, name, category, city, starting price, and rating.
- Search by artist name or category.
- Combinable filters for category, city, price range, and rating.
- Sorting by recommended order, price low-to-high, price high-to-low, and rating high-to-low.
- Pagination with 12 artists per page.
- Empty state when no artists match the selected criteria.

### Artist Profile

Each artist has a dedicated dynamic profile page containing:

- Hero section
  - Artist photo
  - Category and city
  - Rating
  - Starting/base price
- Bio
- Image gallery/carousel
- Sample video links/placeholders
- Reviews and ratings
- Availability calendar
- Event type selector
- Dynamic price estimator
- Request to Book action

### Availability Calendar

The artist profile includes a month-view availability calendar.

The current availability data model stores booked dates as an array of date strings:

```
availability.bookedDates
```

The calendar:

- Allows month navigation.
- Disables past dates.
- Disables dates marked as booked in the artist data.
- Allows selecting an available future date.
- Updates the estimated price based on the selected date.
- Enables "Request to Book" only after a valid date is selected.

### Dynamic Pricing

The estimated booking price is calculated using:

```
Base Price × Weekday / Weekend Multiplier × Event Type Multiplier
```

Supported event types:

- Wedding
- Corporate
- College Fest
- Private Party

The multipliers are part of each artist's mock data.

### Multi-Step Booking Flow

The booking flow contains three steps.

**Step 1 — Event Details**

- Event date
- Event type
- Event city
- Expected audience size
- Event name

Validation includes:
- Date must be valid and available.
- Event type must be selected.
- City is required.
- Audience size must be a positive whole number.
- Event name is required.

**Step 2 — Contact Details**

- Name
- Email
- Phone

Client-side validation includes:
- Required field validation
- Email format validation
- 10-digit phone validation

**Step 3 — Review & Confirm**

Before submitting, the user sees:
- Artist
- Event details
- Contact details
- Selected date
- Event type
- Calculated estimated price

### Simulated API

There is no real backend in the current implementation.

Artist and booking services use artificial delays to simulate network latency. Booking submission can also simulate an API failure.

The booking UI handles:
- Loading state
- Success state
- Error state
- Retry action

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js | React framework and routing |
| TypeScript | Type-safe application development |
| React | UI/component architecture |
| Tailwind CSS | Styling and responsive layouts |
| Zustand | Shared booking state |
| localStorage | Persisting booking state in the browser |
| Lucide React | Interface icons |
| Local JSON | Mock artist data |

### Why These Technologies?

**Next.js**
Next.js was chosen for file-based routing, dynamic artist routes, and a production-ready React application structure.

**TypeScript**
TypeScript is used throughout the project so artist, pricing, availability, review, event, and booking data have explicit types.

**Tailwind CSS**
Tailwind provides a consistent utility-based styling approach for responsive layouts, spacing, typography, interaction states, and component styling.

**Zustand**
Zustand is used for shared booking-related state. The application has relatively small shared-state requirements, so a lightweight state-management solution was appropriate.

Local UI state such as search text, filters, sorting, pagination, gallery selection, and form fields remains inside the relevant components.

**localStorage**
The Zustand booking store uses persistence so booking data can survive a browser refresh.

## Project Architecture

```
bookmyartist/
├── src/
│   ├── app/
│   │   ├── artists/
│   │   │   └── [id]/
│   │   │       ├── book/
│   │   │       │   └── page.tsx
│   │   │       └── page.tsx
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── artists/
│   │   │   ├── ArtistCard.tsx
│   │   │   ├── ArtistHero.tsx
│   │   │   ├── ArtistGallery.tsx
│   │   │   ├── ArtistAbout.tsx
│   │   │   ├── ArtistReviews.tsx
│   │   │   └── ArtistAvailability.tsx
│   │   │
│   │   └── booking/
│   │       └── BookingFlow.tsx
│   │
│   ├── data/
│   │   └── artists.json
│   │
│   ├── services/
│   │   ├── artist.service.ts
│   │   └── booking.service.ts
│   │
│   ├── store/
│   │   └── booking.store.ts
│   │
│   └── types/
│       ├── artist.ts
│       └── booking.ts
│
├── public/
├── package.json
├── tsconfig.json
└── README.md
```

## Data Flow

### Artist Listing

```
artists.json
     ↓
artist.service.ts
     ↓
getArtists()
     ↓
Listing Page
     ↓
Search → Filter → Sort → Pagination
     ↓
ArtistCard
```

### Artist Profile

```
Artist ID
   ↓
getArtistById()
   ↓
Artist Profile Page
   ↓
Hero / Gallery / About / Reviews / Availability
```

### Booking

```
Artist Profile
      ↓
Select Date + Event Type
      ↓
Request to Book
      ↓
BookingFlow
      ↓
Step 1: Event Details
      ↓
Step 2: Contact Details
      ↓
Step 3: Review
      ↓
booking.service.ts
      ↓
Simulated API Request
      ↓
Success / Error + Retry
      ↓
Zustand Booking Store
```

## Mock Data Model

Artist data is stored in:

```
src/data/artists.json
```

Each artist contains:

- id
- name
- category
- city
- basePrice
- rating
- image
- gallery
- bio
- videos
- reviews
- availability
- pricing

Availability is represented using booked date strings:

```json
{
  "availability": {
    "bookedDates": [
      "2026-09-20",
      "2026-09-25"
    ]
  }
}
```

Pricing contains:

```json
{
  "pricing": {
    "weekdayMultiplier": 1,
    "weekendMultiplier": 1.2,
    "eventTypeMultipliers": {
      "Wedding": 1.5,
      "Corporate": 1.2,
      "College Fest": 0.9,
      "Private Party": 1
    }
  }
}
```

The exact values vary by artist in the mock dataset.

## API-Like Service Layer

### Artist Service

`src/services/artist.service.ts` provides:

- `getArtists()`
- `getArtistById(id)`

Both functions include an artificial delay to simulate network latency.

### Booking Service

`src/services/booking.service.ts`:

- Receives the booking object.
- Waits for a simulated network delay.
- Can simulate an API failure.
- Returns a confirmed booking when successful.

This allows the UI to demonstrate loading, error, retry, and success states without a real backend.

## Responsive Design

The application is designed for:

- Mobile, including the assignment's 375px breakpoint
- Tablet
- Desktop

Responsive behavior is handled primarily through Tailwind CSS breakpoints.

Responsive layouts are used for:

- Artist cards
- Artist profile
- Gallery
- Availability calendar
- Booking flow
- Controls and navigation

## Accessibility

Accessibility considerations in the implementation include:

- Semantic HTML where appropriate.
- Labels for form controls.
- Descriptive image alt text.
- Accessible button labels for gallery controls.
- `aria-label` attributes where visual context alone is insufficient.
- `aria-current` for active pagination/gallery items.
- Visible interaction states.

A final keyboard and screen-reader QA pass should be performed before submission, especially for the calendar.

## Loading, Error, and Empty States

The application intentionally handles asynchronous states instead of treating mock data as immediately available.

Examples include:

- Artist data loading state
- No matching artists empty state
- Booking submission loading state
- Booking submission failure state
- Booking retry action
- Inline form validation feedback

## Design Decisions

The assignment intentionally does not provide a fixed design.

The UI uses an original visual direction rather than copying the referenced booking platforms.

The design uses:

- Dark background
- High-contrast typography
- Orange/pink gradient accents
- Subtle borders
- Editorial imagery
- Monospace metadata labels
- Responsive grids
- Hover and transition effects

The goal was to create an energetic entertainment-oriented interface while keeping the implementation original.

## Trade-offs and Scope Decisions

The assignment evaluates implementation as well as decision-making under time constraints.

### My Bookings Dashboard

The assignment asks for a "My Bookings" dashboard where users can view, cancel, and edit bookings.

The dedicated dashboard UI was intentionally not implemented in the current submission.

The booking store was still designed with booking-related operations such as:

- Add booking
- Cancel booking
- Update booking date
- Check whether a date is booked

The decision was made to prioritize the main discovery → profile → availability → booking journey rather than adding a large dashboard feature that could not be confidently explained and tested within the available time.

### Immediate Calendar Update After Confirmation

The assignment asks that a newly confirmed booking immediately update the calendar so the same date cannot be booked again.

The current implementation validates selected dates against the artist's existing booked dates and maintains booking state through Zustand.

However, the final calendar-to-booking-store synchronization that immediately reflects a newly confirmed booking in the profile calendar was intentionally not extended further.

This is documented as a known limitation rather than presented as fully implemented.

### Optional Bonus Features

The following optional features were not implemented:

- Dark mode toggle
- Unit tests for pricing and availability
- URL-synced filters
- Analytics-style logging

## Known Limitations

- My Bookings Dashboard UI is not implemented.
- Immediate calendar synchronization after a confirmed booking is not fully implemented.
- There is no real backend; JSON and simulated services are used.
- Automated unit tests for pricing and availability were not added.
- Listing filters are not currently URL-synced.
- Analytics logging was not added.

These are conscious scope decisions and are documented so they can be discussed during the demo.

## What I Would Improve With More Time

If the application were continued, I would prioritize:

- Build the My Bookings dashboard.
- Fully synchronize booking state with the availability calendar.
- Add unit tests for pricing and availability.
- Replace mock services with a real API/backend.
- Add URL-synced search and filters.
- Perform deeper accessibility testing.
- Add end-to-end tests.
- Add analytics for important user actions.
- Add backend persistence and authentication.

## AI Usage

AI tools were used as development assistants for:

- Generating the mock json data.
- Generating large components code.
- Reviewing code structure.
- Debugging issues.
- Reviewing assignment requirements and identifying implementation gaps.

AI-generated suggestions were reviewed, adapted, tested, and integrated rather than being used as an unexplained wholesale solution.

The implementation and architectural decisions were reviewed with the goal of being able to explain the code during the demo and interview.

## Getting Started

### Prerequisites

- Node.js
- npm
- Git

### Clone the repository

```bash
git clone https://github.com/surajkumarsatya/bookmyartist.git
cd bookmyartist
```

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

### Create a production build

```bash
npm run build
```

### Start the production server

```bash
npm run start
```

## Routes

| Route | Purpose |
|---|---|
| `/` | Artist discovery, search, filters, sorting, and pagination |
| `/artists/[id]` | Artist profile |
| `/artists/[id]/book` | Multi-step booking flow |

## Git History

The repository was developed using incremental commits rather than a single final commit.

The commit history shows the progression of the application, including:

- Initial project setup
- Artist data/service layer
- Artist profile
- Booking state/service layer
- Booking flow
- Listing pagination and related improvements

Repository: [github.com/surajkumarsatya/bookmyartist](https://github.com/surajkumarsatya/bookmyartist)

## Assignment Coverage

| Assignment Requirement | Status |
|---|---|
| 30+ artists | Implemented — 36 artists |
| Artist listing | Implemented |
| Search | Implemented |
| Combinable filters | Implemented |
| Sorting | Implemented |
| Pagination | Implemented |
| Empty state | Implemented |
| Artist profile | Implemented |
| Gallery/carousel | Implemented |
| Bio/category/city/base price | Implemented |
| Videos/placeholders | Implemented |
| Reviews/ratings | Implemented |
| Availability calendar | Implemented |
| Dynamic price estimator | Implemented |
| Request to Book validation | Implemented |
| Booking Step 1 | Implemented |
| Booking Step 2 | Implemented |
| Booking Step 3 | Implemented |
| Client-side validation | Implemented |
| Simulated API | Implemented |
| Loading state | Implemented |
| Error state + retry | Implemented |
| My Bookings dashboard | Not implemented |
| Cancel/edit booking UI | Not implemented |
| Immediate calendar update after confirmation | Partially implemented / limitation |
| TypeScript | Implemented |
| Responsive UI | Implemented; final QA recommended |
| Accessibility considerations | Implemented; final QA recommended |
| Meaningful commit history | Implemented |
| Dark mode bonus | Not implemented |
| Unit tests bonus | Not implemented |
| URL-synced filters bonus | Not implemented |
| Analytics logging bonus | Not implemented |

## Final User Journey

```
Discover Artists
      ↓
Search / Filter / Sort
      ↓
View Artist Profile
      ↓
Check Availability
      ↓
Select Event Details
      ↓
Estimate Price
      ↓
Request to Book
      ↓
Validate Contact Details
      ↓
Review Booking
      ↓
Submit
      ↓
Loading → Success / Error → Retry
```

The project intentionally focuses on a clear and explainable frontend architecture while documenting the features that were scoped out.