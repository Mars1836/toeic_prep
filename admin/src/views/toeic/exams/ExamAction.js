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
  CSpinner,
  CFormCheck,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilMediaPlay, cilSearch, cilClock } from '@coreui/icons'
import { useNavigate, useParams } from 'react-router-dom'
import instance from '../../../configs/axios.instance'
import ProtectRouter from '../../../wrapper/ProtectRouter'
import { formatDate } from '../../../utils/formatDate'
import { toast } from 'react-toastify'
import { useEndpoint } from '../../../wrapper/EndpointContext'

const ExamAction = () => {
  const { endpoint } = useEndpoint()
  const { toeicTestId } = useParams()
  const navigate = useNavigate()
  const [tests, setTests] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTest, setSelectedTest] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const testsPerPage = 10

  const fetchTests = async () => {
    try {
      setLoading(true)
      const { data } = await instance.get(endpoint.test.get, {
        params: {
          page: currentPage,
          limit: testsPerPage,
          search: searchTerm || undefined,
        },
      })
      setTests(data)
      setTotalPages(Math.ceil(data.length / testsPerPage))
    } catch (error) {
      toast.error('Failed to fetch tests')
      console.error('Error fetching tests:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTests()
  }, [currentPage, searchTerm])

  const handleStartTest = async () => {
    if (!selectedTest) {
      toast.error('Please select a test to start')
      return
    }

    try {
      await instance.post(endpoint.toeicTestSession.create, {
        testId: selectedTest,
        toeicTestId: toeicTestId,
      })
      toast.success('Test session started successfully')
      navigate('/toeic/exams')
    } catch (error) {
      toast.error('Failed to start test session')
      console.error('Error starting test session:', error)
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <div className="d-flex justify-content-between align-items-center">
              <strong>Select Test to Start</strong>
              <CButton color="success" onClick={handleStartTest} disabled={!selectedTest}>
                Start Selected Test
              </CButton>
            </div>
          </CCardHeader>
          <CCardBody>
            <div className="mb-4">
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
            </div>

            {loading ? (
              <div className="text-center">
                <CSpinner />
              </div>
            ) : (
              <>
                <CTable hover responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Select</CTableHeaderCell>
                      <CTableHeaderCell>Title</CTableHeaderCell>
                      <CTableHeaderCell>Type</CTableHeaderCell>
                      <CTableHeaderCell>Difficulty</CTableHeaderCell>
                      <CTableHeaderCell>Questions</CTableHeaderCell>
                      <CTableHeaderCell>Duration</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {tests.map((test) => (
                      <CTableRow key={test.id}>
                        <CTableDataCell>
                          <CFormCheck
                            type="radio"
                            name="testSelection"
                            checked={selectedTest === test.id}
                            onChange={() => setSelectedTest(test.id)}
                          />
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="fw-bold">{test.title || 'Untitled'}</div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={test.type === 'exam' ? 'primary' : 'info'}>
                            {test.type === 'exam' ? 'Full Test' : 'Mini Test'}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CBadge
                            color={
                              !test.difficulty
                                ? 'secondary'
                                : test.difficulty === 'beginner'
                                  ? 'success'
                                  : test.difficulty === 'intermediate'
                                    ? 'warning'
                                    : 'danger'
                            }
                          >
                            {test.difficulty
                              ? test.difficulty.charAt(0).toUpperCase() + test.difficulty.slice(1)
                              : 'Not Set'}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="d-flex align-items-center">
                            <CIcon icon={cilMediaPlay} className="me-2" />
                            {test.numberOfQuestions || 0} questions
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="d-flex align-items-center">
                            <CIcon icon={cilClock} className="me-2" />
                            {test.duration || 0} min
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
              </>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

const ProtectedExamAction = () => {
  return (
    <ProtectRouter>
      <ExamAction />
    </ProtectRouter>
  )
}

export default ProtectedExamAction
