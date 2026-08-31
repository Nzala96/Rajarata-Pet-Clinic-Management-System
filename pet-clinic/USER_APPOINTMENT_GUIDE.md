# User Appointment Management Guide

## Overview
This guide explains the new user appointment management functionality that allows normal users to manage their pet's veterinary appointments.

## Features

### 1. View Appointments
- Users can view all their appointments in a modern card-based layout
- Each appointment card shows:
  - Date and time
  - Pet details (name, breed, age)
  - Doctor information
  - Appointment status (pending, confirmed, completed, cancelled)
  - Reason for visit
  - Additional notes

### 2. Create New Appointments
- Users can book new appointments through a comprehensive form
- Required fields:
  - Appointment date and time
  - Pet name
  - Doctor selection
- Optional fields:
  - Pet breed and age
  - Contact number
  - Appointment type (check-up, vaccination, surgery, etc.)
  - Reason for visit
  - Additional notes

### 3. Edit Appointments
- Users can edit pending or confirmed appointments
- Cannot edit completed or cancelled appointments
- All fields can be updated except status (admin-only)

### 4. Cancel Appointments
- Users can cancel pending or confirmed appointments
- Cannot cancel completed appointments
- Confirmation modal prevents accidental cancellations

### 5. Search and Filter
- Search appointments by pet name, doctor, or reason
- Filter by appointment status
- Clear filters option

## Access

### For Normal Users
1. Log in to the application
2. Navigate to the sidebar menu
3. Click on "Appointment" → "My Appointments"
4. Or directly visit `/my-appointments`

### Navigation
The new "My Appointments" link has been added to the client sidebar under:
- Appointment → My Appointments

## Technical Implementation

### Components Created
1. **UserAppointmentsComponent** (`src/app/components/user-appointments/`)
   - Main component for user appointment management
   - Handles CRUD operations
   - Responsive design with Bootstrap

2. **UserAppointmentService** (`src/app/services/user-appointment.service.ts`)
   - Service for API communication
   - Handles appointment data operations
   - Error handling and fallbacks

### Files Created
- `src/app/components/user-appointments/user-appointments.component.ts`
- `src/app/components/user-appointments/user-appointments.component.html`
- `src/app/components/user-appointments/user-appointments.component.scss`
- `src/app/services/user-appointment.service.ts`

### Files Modified
- `src/app/app.module.ts` - Added component declaration
- `src/app/app-routing.module.ts` - Added route `/my-appointments`
- `src/app/components/client-sidebar/client-sidebar.component.html` - Added navigation link

## API Endpoints Used

The service uses the following API endpoints:
- `GET /api/user/appointments/{email}` - Get user's appointments
- `GET /api/appointments/{id}` - Get specific appointment
- `POST /api/appointments` - Create new appointment
- `PUT /api/appointments/{id}` - Update appointment
- `GET /api/doctors` - Get available doctors

## User Experience Features

### Visual Design
- Modern card-based layout
- Color-coded status badges
- Hover effects and animations
- Responsive design for mobile devices

### User-Friendly Features
- Form validation with helpful error messages
- Loading states with spinners
- Success/error notifications using Toastr
- Confirmation modals for destructive actions
- Empty state with call-to-action

### Accessibility
- Proper ARIA labels
- Keyboard navigation support
- Screen reader friendly
- High contrast color scheme

## Security Considerations

### User Permissions
- Users can only view their own appointments
- Users can only edit/cancel their own appointments
- Status changes are restricted (admin-only)
- Form validation prevents invalid data

### Data Validation
- Client-side validation for immediate feedback
- Server-side validation for security
- Date/time validation ensures future appointments
- Required field validation

## Future Enhancements

Potential improvements for future versions:
1. Calendar view for appointments
2. Appointment reminders and notifications
3. Integration with pet medical history
4. Online payment integration
5. Video consultation support
6. Appointment rescheduling with doctor availability
7. Pet profile management
8. Appointment history and analytics

## Troubleshooting

### Common Issues
1. **Appointments not loading**: Check API connectivity and user authentication
2. **Form validation errors**: Ensure all required fields are filled
3. **Date/time issues**: Verify appointment is scheduled for future date/time
4. **Permission errors**: Ensure user is logged in and has proper permissions

### Debug Information
- Check browser console for JavaScript errors
- Verify API endpoints are accessible
- Confirm user authentication status
- Check network connectivity

## Support

For technical support or feature requests, please contact the development team or create an issue in the project repository. 