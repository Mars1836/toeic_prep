import React from 'react'

// Core pages
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

// TOEIC Admin Components
const ToeicUsers = React.lazy(() => import('./views/toeic/users/Users'))
const UserDetail = React.lazy(() => import('./views/toeic/users/UserDetail'))

// Test Management
const ToeicTestList = React.lazy(() => import('./views/toeic/tests/ExamList.js'))
const ToeicTestCreate = React.lazy(() => import('./views/toeic/tests/ExamCreate.js'))
const ToeicTestUpload = React.lazy(() => import('./views/toeic/tests/ExamUpload.js'))
const TestEdit = React.lazy(() => import('./views/toeic/tests/ExamEdit.js'))
const TestEditData = React.lazy(() => import('./views/toeic/tests/ExamEditData.js'))
// Blog Management
const ToeicBlogPosts = React.lazy(() => import('./views/toeic/blog/Posts'))
const ToeicBlogCreate = React.lazy(() => import('./views/toeic/blog/CreatePost.js'))
const ToeicBlogCategories = React.lazy(() => import('./views/toeic/blog/Categories'))
const EditPost = React.lazy(() => import('./views/toeic/blog/EditPost'))
const ToeicExams = React.lazy(() => import('./views/toeic/exams/ExamList'))
const ToeicExamsCreate = React.lazy(() => import('./views/toeic/exams/ExamCreate'))
const ExamAction = React.lazy(() => import('./views/toeic/exams/ExamAction'))
// Flashcard Management
const FlashCardSets = React.lazy(() => import('./views/toeic/flashcards/FlashCardSets'))
const FlashCards = React.lazy(() => import('./views/toeic/flashcards/FlashCards'))

// Other
const ToeicRevenue = React.lazy(() => import('./views/toeic/revenue/Revenue'))

//Login
const Login = React.lazy(() => import('./views/pages/login/Login'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },

  // User Management
  { path: '/toeic/users', name: 'Users Management', element: ToeicUsers },
  { path: '/toeic/users/:userId', name: 'User Detail', element: UserDetail },

  // Exam Routes
  { path: '/toeic/tests/list', name: 'Test List', element: ToeicTestList },
  { path: '/toeic/tests/create', name: 'Create Test', element: ToeicTestCreate },
  { path: '/toeic/tests/upload', name: 'Upload Test', element: ToeicTestUpload },
  { path: '/toeic/tests/edit/:testId', name: 'Edit Test', element: TestEdit },
  { path: '/toeic/tests/upload/:testId', name: 'Edit Exam Data', element: TestEditData },

  // Blog Routes
  { path: '/toeic/blog/posts', name: 'Blog Posts', element: ToeicBlogPosts },
  { path: '/toeic/blog/create', name: 'Create Post', element: ToeicBlogCreate },
  { path: '/toeic/blog/categories', name: 'Blog Categories', element: ToeicBlogCategories },
  { path: '/toeic/blog/edit/:id', name: 'Edit Post', element: EditPost },

  // Flashcard Routes
  { path: '/toeic/flashcards/sets', name: 'Flashcard Sets', element: FlashCardSets },
  { path: '/toeic/flashcards/:id', name: 'Flashcards', element: FlashCards },

  // Exam Routes
  { path: '/toeic/exams/list', name: 'Exams', element: ToeicExams },
  { path: '/toeic/exams/create', name: 'Create Exam', element: ToeicExamsCreate },
  { path: '/toeic/exams/action/:toeicTestId', name: 'Exam Action', element: ExamAction },
  // Analytics
  { path: '/toeic/revenue', name: 'Revenue', element: ToeicRevenue },

  // Login
  { path: '/login', name: 'Login', element: Login },
]

export default routes
