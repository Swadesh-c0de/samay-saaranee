# SamaySaaranee - A timetable management webApp

A modern, responsive web application for school administrators to manage teachers, classes, and educational resources. Built with React and styled using Tailwind CSS with a focus on clean design and user experience.

## 🌟 Features

- **Teacher Management**
  - View all teachers in an elegant card-based interface
  - Add new teachers to the system
  - Edit existing teacher information
  - Delete teachers with confirmation dialog
  - View teacher details including department, contact information, and subjects
  
- **Responsive Design**
  - Full desktop experience with optimized layouts
  - Mobile-friendly interface with bottom sheet modals
  - Smooth animations and transitions
  - Dark/light mode support

- **Visual Feedback**
  - Interactive UI elements with hover and tap animations
  - Beautiful gradient accents
  - Loading states for asynchronous operations

## 🚀 Technologies Used

- **Frontend**
  - React.js
  - Framer Motion for animations
  - Tailwind CSS for styling
  - React Icons
  - React Portals for modal management

- **UI/UX Features**
  - Backdrop blur effects
  - Glassmorphism design elements 
  - Responsive layouts for all screen sizes
  - Accessible design patterns

## 📋 Project Structure

The project follows a component-based architecture with key components:

- **Teacher Components**
  - `TeacherCard.jsx`: Displays individual teacher information
  - `EditTeacherModal.jsx`: Modal for editing teacher details
  - `DeleteTeacherModal.jsx`: Confirmation modal for teacher deletion

## 🛠️ Setup and Installation

1. **Clone the repository**
   ```
   git clone [<repository-url>](https://github.com/Swadesh-c0de/samay-saaranee.git)
   cd school-management-system
   ```

2. **Install dependencies**
   ```
   npm install
   ```

3. **Start the development server**
   ```
   npm run dev
   ```

4. **Build for production**
   ```
   npm run build
   ```

## 📱 UI Components

### Teacher Cards
Each teacher is displayed in a card showing:
- Profile information with name and department
- Contact details (email, phone)
- Subjects taught
- Statistics (classes, years of experience, students)
- Status indicator (active/inactive)
- Edit and delete actions

### Edit Modal
A comprehensive form with:
- Basic information fields
- Subject management
- Statistics fields
- Active status toggle
- Save and cancel actions

### Delete Confirmation
A user-friendly confirmation dialog with:
- Clear warning message
- Teacher name confirmation
- Cancel and confirm options
- Animated transitions

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 🙏 Acknowledgements

- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [React Icons](https://react-icons.github.io/react-icons/) 
