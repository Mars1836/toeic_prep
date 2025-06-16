import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
  CBadge,
  CFormSelect,
  CInputGroup,
  CFormInput,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilFile,
  cilPencil,
  cilSearch,
  cilTrash,
  cilClock,
  cilCalendar,
  cilDollar,
  cilMediaPlay,
} from '@coreui/icons'
import { useNavigate } from 'react-router-dom'
import instance from '../../../configs/axios.instance'
import { offset } from '@popperjs/core'
import ProtectRouter from '../../../wrapper/ProtectRouter'
import { formatDate } from '../../../utils/formatDate'
import { toast } from 'react-toastify'
import { useEndpoint } from '../../../wrapper/EndpointContext'

const ExamList = () => {
  const { endpoint } = useEndpoint()
  const [exams, setExams] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const examsPerPage = 10
  const navigate = useNavigate()

  const fetchExams = async () => {
    try {
      const { data } = await instance.get(endpoint.toeicTesting.getAll, {
        params: {
          page: currentPage,
          limit: examsPerPage,
          status: statusFilter || undefined,
          difficulty: difficultyFilter || undefined,
          type: typeFilter || undefined,
          search: searchTerm || undefined,
        },
      })
      setExams(data.data)
      setTotalPages(data.pagination.totalPages)
    } catch (error) {
      toast.error('Failed to fetch exams')
      console.error('Error fetching exams:', error)
    }
  }

  useEffect(() => {
    fetchExams()
  }, [currentPage, statusFilter, difficultyFilter, typeFilter, searchTerm])

  const handleDeleteExam = async (examId) => {
    if (window.confirm('Are you sure you want to delete this exam?')) {
      try {
        await instance.delete(endpoint.toeicTesting.delete(examId))
        toast.success('Exam deleted successfully')
        fetchExams() // Refresh the list
      } catch (error) {
        toast.error('Failed to delete exam')
        console.error('Error deleting exam:', error)
      }
    }
  }

  const handleViewDetails = (examId) => {
    navigate(`/toeic/exams/details/${examId}`)
  }

  const handleEditInforExam = (examId) => {
    navigate(`/toeic/exams/edit/${examId}`)
  }
  const handleEditFileExam = (examId) => {
    navigate(`/toeic/exams/upload/${examId}`)
  }
  const handleViewTemplate = () => {
    const url =
      'https://docs.google.com/spreadsheets/d/1tjjUiuK8n0lrAtFEaD5GraqLo9bcGrJ3pbiRMwtI3b4/edit?gid=1818801142#gid=1818801142' // sau có thể lấy từ DB, biến,....
    window.open(url, '_blank') // Mở liên kết trong tab mới
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <div className="d-flex justify-content-between">
              <strong>TOEIC Test Management</strong>
              <div>
                <CButton
                  color="primary"
                  className="me-2"
                  onClick={() => navigate('/toeic/exams/create')}
                >
                  Create New Test
                </CButton>
                <CButton
                  color="success"
                  style={{ color: 'white' }}
                  className="me-2"
                  onClick={handleViewTemplate}
                >
                  View Template
                </CButton>
              </div>
            </div>
          </CCardHeader>
          <CCardBody>
            <div className="mb-4 d-flex gap-3 flex-wrap">
              <CInputGroup style={{ maxWidth: '300px' }}>
                <CFormInput
                  placeholder="Search tests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <CButton color="primary" type="button">
                  <CIcon icon={cilSearch} />
                </CButton>
              </CInputGroup>

              <CFormSelect
                style={{ maxWidth: '200px' }}
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
              >
                <option value="">All Difficulties</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </CFormSelect>

              <CFormSelect
                style={{ maxWidth: '200px' }}
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="miniexam">Mini Exam</option>
                <option value="exam">Full Test</option>
              </CFormSelect>

              <CFormSelect
                style={{ maxWidth: '150px' }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="ONGOING">Ongoing</option>
                <option value="COMPLETED">Completed</option>
              </CFormSelect>
            </div>

            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Test Center</CTableHeaderCell>
                  <CTableHeaderCell>Time</CTableHeaderCell>
                  <CTableHeaderCell>Duration</CTableHeaderCell>
                  <CTableHeaderCell>Price</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Created At</CTableHeaderCell>
                  <CTableHeaderCell>Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {exams.map((exam) => (
                  <CTableRow key={exam.id}>
                    <CTableDataCell>
                      <div className="fw-bold">{exam.testCenter || 'Not Set'}</div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div className="d-flex flex-column">
                        <div className="d-flex align-items-center mb-1">
                          <CIcon icon={cilCalendar} className="me-2" />
                          <span>{formatDate(exam.timeStart)}</span>
                        </div>
                        <div className="d-flex align-items-center text-muted small">
                          <CIcon icon={cilClock} className="me-2" />
                          <span>
                            {new Date(exam.timeStart).toLocaleTimeString()} -{' '}
                            {new Date(exam.timeEnd).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div className="d-flex align-items-center">
                        <CIcon icon={cilClock} className="me-2" />
                        {Math.round(
                          (new Date(exam.timeEnd) - new Date(exam.timeStart)) / (1000 * 60),
                        )}{' '}
                        min
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div className="d-flex align-items-center">
                        <CIcon icon={cilDollar} className="me-2" />
                        {exam.price?.toLocaleString('vi-VN')} VNĐ
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CBadge
                        color={
                          !exam.status
                            ? 'secondary'
                            : exam.status === 'PENDING'
                              ? 'warning'
                              : exam.status === 'ONGOING'
                                ? 'info'
                                : 'success'
                        }
                      >
                        {exam.status || 'Not Set'}
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div className="text-muted">
                        {exam.createdAt ? formatDate(exam.createdAt) : 'N/A'}
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div className="d-flex gap-2">
                        <CButton
                          color="primary"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditInforExam(exam.id)}
                          title="Edit Test"
                        >
                          <CIcon icon={cilPencil} />
                        </CButton>
                        <CButton
                          color="danger"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteExam(exam.id)}
                          title="Delete Test"
                        >
                          <CIcon icon={cilTrash} />
                        </CButton>
                        <CButton
                          color="success"
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/toeic/exams/action/${exam.id}`)}
                          title="Start Test"
                        >
                          <CIcon icon={cilMediaPlay} />
                        </CButton>
                      </div>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>

            <div className="mt-3">
              {Array.from({ length: totalPages }, (_, i) => (
                <CButton
                  className="me-1"
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  color={currentPage === i + 1 ? 'primary' : 'secondary'}
                >
                  {i + 1}
                </CButton>
              ))}
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

const ProtectedExamList = () => {
  return (
    <ProtectRouter>
      <ExamList />
    </ProtectRouter>
  )
}

export default ProtectedExamList
