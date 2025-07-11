import React, { useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CButton,
  CAlert,
  CFormFeedback,
} from '@coreui/react'
import axios from 'axios'
import { useEffect } from 'react'
import { useEndpoint } from '../../../wrapper/EndpointContext'
import instance from '../../../configs/axios.instance'
import ProtectRouter from '../../../wrapper/ProtectRouter'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
const ExamCreate = () => {
  const { endpoint } = useEndpoint()
  const { testId } = useParams()
  const [examData, setExamData] = useState({
    title: '',
    type: '',
    difficulty: 'intermediate',
    isPublished: false,
    duration: 0,
  })

  const [touched, setTouched] = useState({
    title: false,
    difficulty: false,
    status: false,
    numberOfQuestions: false,
    duration: false,
  })
  const [errors, setErrors] = useState({})

  const [isValid, setIsValid] = useState(false)
  const [error, setError] = useState(null)
  const [uploadError, setUploadError] = useState(null)
  const [validationMessage, setValidationMessage] = useState('')
  const validateForm = () => {
    const newErrors = {}

    // Validate title
    if (!examData.title.trim()) {
      newErrors.title = 'Title is required'
    }

    // Validate difficulty
    if (!examData.difficulty) {
      newErrors.difficulty = 'Difficulty is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setExamData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Tắt lỗi khi trường đã có lỗi được nhập dữ liệu
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }))
    }
  }

  const handleBlur = (field) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }))
  }

  const handleTypeChange = (e) => {
    setExamData((prev) => ({
      ...prev,
      type: e.target.value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Xóa lỗi trước khi xác thực
    setErrors({})
    setValidationMessage('')

    // Kiểm tra các trường bắt buộc
    const newErrors = {}
    if (!examData.title.trim()) {
      newErrors.title = 'Exam Title là bắt buộc'
    }
    if (!examData.difficulty) {
      newErrors.difficulty = 'Difficulty Level là bắt buộc'
    }

    if (!examData.type) {
      newErrors.type = 'Test Type là bắt buộc'
    }
    if (!examData.duration) {
      newErrors.duration = 'Duration là bắt buộc'
    }
    if (examData.duration <= 0) {
      newErrors.duration = 'Duration phải lớn hơn 0'
    }
    if (isNaN(examData.duration)) {
      newErrors.duration = 'Duration phải là số'
    }
    setErrors(newErrors)

    // Nếu có lỗi, hiển thị thông báo
    if (Object.keys(newErrors).length > 0) {
      setIsValid(false)
      setValidationMessage(Object.values(newErrors)[0])
      return
    }
    const { data } = await instance.patch(endpoint.test.updateInfor(testId), examData)
    if (data) {
      toast.success('Update exam information successfully')
    } else {
      toast.error('Update exam information failed')
    }
  }
  useEffect(() => {
    const fetchExamData = async () => {
      const { data } = await instance.get(endpoint.test.getById(testId))
      setExamData(data)
    }
    fetchExamData()
  }, [testId])
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Edit Information Exam</strong>
          </CCardHeader>
          <CCardBody>
            {uploadError && (
              <CAlert color="danger" onClose={() => setUploadError(null)} dismissible>
                {uploadError}
              </CAlert>
            )}
            {validationMessage && (
              <CAlert color={isValid ? 'success' : 'danger'} dismissible>
                {validationMessage}
              </CAlert>
            )}
            <CForm>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel htmlFor="examTitle">Exam Title</CFormLabel>
                  <CFormInput
                    id="examTitle"
                    name="title"
                    value={examData.title}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('title')}
                    placeholder="Enter exam title"
                    invalid={touched.title && errors.title}
                  />
                  {touched.title && errors.title && (
                    <CFormFeedback invalid>{errors.title}</CFormFeedback>
                  )}
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="difficulty">Difficulty Level</CFormLabel>
                  <CFormSelect
                    id="difficulty"
                    name="difficulty"
                    value={examData.difficulty}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('difficulty')}
                    invalid={touched.difficulty && errors.difficulty}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </CFormSelect>
                  {touched.difficulty && errors.difficulty && (
                    <CFormFeedback invalid>{errors.difficulty}</CFormFeedback>
                  )}
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel htmlFor="testType">Test Type</CFormLabel>
                  <CFormSelect
                    id="testType"
                    name="type"
                    value={examData.type}
                    onChange={handleInputChange}
                  >
                    <option value="" disabled>
                      Select a test type
                    </option>
                    <option value="exam">Exam</option>
                    <option value="miniexam">Mini Exam</option>
                  </CFormSelect>
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="duration">Duration (minutes)</CFormLabel>
                  <CFormInput
                    id="duration"
                    name="duration"
                    value={examData.duration}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('duration')}
                    invalid={touched.duration && errors.duration}
                  />
                  {touched.duration && errors.duration && (
                    <CFormFeedback invalid>{errors.duration}</CFormFeedback>
                  )}
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel htmlFor="isPublished">Publish</CFormLabel>
                  <CFormSelect
                    id="isPublished"
                    name="isPublished"
                    value={examData.isPublished}
                    onChange={handleInputChange}
                  >
                    <option value={true}>True</option>
                    <option value={false}>False</option>
                  </CFormSelect>
                </CCol>
              </CRow>
              <div style={{ marginTop: '10px' }}>
                <CButton type="submit" color="primary" onClick={handleSubmit}>
                  Save Exam
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}
const ProtectedExamCreate = () => {
  return (
    <ProtectRouter>
      <ExamCreate />
    </ProtectRouter>
  )
}
export default ProtectedExamCreate
