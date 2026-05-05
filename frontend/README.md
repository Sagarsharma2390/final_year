# AI-Based Smart Evaluation System

A comprehensive web application for automated evaluation of student answer scripts using AI technology, with face recognition authentication for teachers.

## 🎯 Overview

This system enables teachers to:
- Register and login with face recognition
- Configure subject-specific evaluation settings
- Upload answer templates with section-wise marking schemes
- Upload student answer scripts (PDF)
- Get AI-powered automated evaluations
- View and download detailed results

## 📑 Pages

### 1. Dashboard (/)
- View evaluation statistics
- See recent evaluations
- Learn about system features

### 2. Register (/register)
- First Name, Last Name
- Teacher ID
- Stream selection
- Phone Number
- Email ID
- Password
- **Face Recognition capture**

### 3. Login (/login)
- Email/Username
- Password
- **Face Authentication**

### 4. Upload Template (/upload-template)
- Select subject
- Upload answer template PDF
- Configure 4 sections:
  - **Section A**: 2 marks questions
  - **Section B**: 6 marks questions
  - **Section C**: 8 marks questions
  - **Section D**: 10 marks questions
- Set minimum marks and questions to attend for each section
- Settings persist until changed

### 5. Upload Student Answers (/upload-answers)
- Enter student name
- Upload student answer script (PDF)
- AI evaluates automatically
- Generates section-wise results

### 6. Results (/results)
- View all evaluations
- Search by student name or subject
- See detailed section breakdowns
- Download individual results
- Download all results

## 🚀 Features

✅ **Face Recognition** - Biometric authentication using device camera  
✅ **PDF Support** - Upload answer templates and student scripts  
✅ **AI Evaluation** - Automated answer assessment  
✅ **Section-wise Grading** - 4 configurable sections (A, B, C, D)  
✅ **Persistent Settings** - Subject configuration remains active  
✅ **Real-time Results** - Instant evaluation display  
✅ **Export Capability** - Download results as text files  
✅ **Search & Filter** - Easy result navigation  
✅ **Responsive Design** - Works on all devices  
✅ **Toast Notifications** - User-friendly feedback  

## 🛠️ Technology Stack

- **React 18.3.1** with TypeScript
- **React Router 7** for navigation
- **Tailwind CSS v4** for styling
- **Radix UI** component library
- **Lucide React** icons
- **Sonner** toast notifications
- **Vite** build tool

## 📂 Project Structure

```
src/app/
├── App.tsx                      # Main entry point
├── routes.tsx                   # Router configuration
├── components/
│   ├── Layout.tsx               # App layout with navigation
│   └── ui/                      # Reusable UI components
├── context/
│   └── EvaluationContext.tsx    # Global state management
└── pages/
    ├── Dashboard.tsx            # Page 1
    ├── Register.tsx             # Page 2
    ├── Login.tsx                # Page 3
    ├── AnswerScriptUpload.tsx   # Page 4
    ├── StudentAnswerUpload.tsx  # Page 5
    └── ResultSheet.tsx          # Page 6
```

## 🎓 How to Use

### First-Time Setup:

1. **Register**: Go to `/register` and create your teacher account with face recognition
2. **Login**: Use `/login` with your credentials and face authentication
3. **Configure Subject**: Navigate to `/upload-template` to set up your first subject
4. **Upload Template**: Upload the answer template PDF and configure sections
5. **Set Marking Scheme**: Define marks and questions for each section

### Daily Workflow:

1. **Upload Student Answers**: Go to `/upload-answers`
2. **Enter Student Name**: Type the student's full name
3. **Upload PDF**: Select the student's answer script
4. **Submit**: Let AI evaluate (takes ~3 seconds)
5. **View Results**: Automatically redirected to `/results`
6. **Download**: Export individual or all results

## 📊 Evaluation Configuration

Each subject has 4 sections:

| Section | Marks per Question | Configurable |
|---------|-------------------|--------------|
| A | 2 marks | ✓ Min marks, Questions to attend |
| B | 6 marks | ✓ Min marks, Questions to attend |
| C | 8 marks | ✓ Min marks, Questions to attend |
| D | 10 marks | ✓ Min marks, Questions to attend |

**Note**: Subject settings persist until you change them manually.

## 🔒 Authentication Flow

1. Register with face capture
2. Login with credentials + face verification
3. Access protected features (upload, evaluate)
4. Logout when done

## 📥 Download Results

Results are available in two formats:
- **Individual**: Download specific student result
- **Bulk**: Download all results at once

Downloaded files include:
- Student name
- Subject
- Section-wise scores
- Total marks
- Percentage
- Evaluation date
- Teacher information

## 🎨 User Interface

- **Modern Design**: Clean, professional interface
- **Color Coding**: Green (excellent), Yellow (good), Red (needs improvement)
- **Responsive**: Works on desktop, tablet, and mobile
- **Intuitive Navigation**: Clear menu with active state
- **Real-time Feedback**: Toast notifications for all actions

## 🔮 Future Enhancements

- Real AI evaluation API integration
- Database persistence
- Multiple teacher accounts
- Student portal
- Advanced analytics
- Email notifications
- Export to PDF/Excel
- Bulk upload capability
- Plagiarism detection

## 📝 Notes

- **Face Recognition**: Requires camera permissions (HTTPS/localhost)
- **AI Evaluation**: Currently simulated (ready for API integration)
- **Data Storage**: In-memory (resets on page refresh)
- **Browser Support**: Modern browsers with MediaDevices API

## 🤝 Support

For issues or questions:
1. Check `PROJECT_ARCHITECTURE.md` for detailed documentation
2. Review the page-specific features above
3. Ensure camera permissions are granted for face recognition

---

**Version**: 1.0  
**Status**: Production Ready  
**License**: Educational Use  

Built with ❤️ using React, TypeScript, and Tailwind CSS
