export class Endpoint {
  constructor(originUrl) {
    this.originUrl = originUrl
    this.originUrlUpload = originUrl + '/uploads'
    this.userAnalyst = this.handleUserAnalyst()
    this.transactionAnalyst = this.handleTransactionAnalyst()
    this.resultAnalyst = this.handleResultAnalyst()
    this.user = this.handleUser()
    this.test = this.handleTest()
    this.auth = this.handleAuth()
    this.transaction = this.handleTransaction()
    this.cloudinary = this.handleCloudinary()
    this.blog = this.handleBlog()
    this.toeicTesting = this.handleToeicTesting()
    this.toeicTestSession = this.handleToeicTestSession()
  }
  handleUserAnalyst() {
    return {
      upgrade: this.originUrl + '/api/admin/user/analyst/upgrade',
      new: this.originUrl + '/api/admin/user/analyst/new',
      progress: this.originUrl + '/api/admin/user/analyst/progress',
    }
  }
  handleTransactionAnalyst() {
    return {
      new: this.originUrl + '/api/admin/transaction/analyst/new',
      progress: this.originUrl + '/api/admin/transaction/analyst/progress',
    }
  }
  handleResultAnalyst() {
    return {
      new: this.originUrl + '/api/admin/result/analyst/new',
      progress: this.originUrl + '/api/admin/result/analyst/progress',
    }
  }
  handleUser() {
    return {
      get: this.originUrl + '/api/admin/user',
    }
  }
  handleTest() {
    return {
      create: this.originUrl + '/api/admin/test',
      get: this.originUrl + '/api/admin/test',
      getById: (id) => `${this.originUrl}/api/admin/test/${id}`,
      updateInfor: (id) => `${this.originUrl}/api/admin/test/${id}/infor`,
      updateData: (id) => `${this.originUrl}/api/admin/test/${id}/data`,
      delete: (id) => `${this.originUrl}/api/admin/test/${id}`,
    }
  }
  handleAuth() {
    return {
      login: this.originUrl + '/api/admin/auth/login',
      logout: this.originUrl + '/api/admin/auth/logout',
      currentUser: this.originUrl + '/api/admin/auth/current-user',
    }
  }
  handleTransaction() {
    return {
      get: this.originUrl + '/api/admin/transaction',
      updateStatus: this.originUrl + '/api/admin/transaction/update-status',
      getStatus: this.originUrl + '/api/admin/transaction/status',
      getLast7Years: this.originUrl + '/api/admin/transaction/last-7-years',
      getLast7Months: this.originUrl + '/api/admin/transaction/last-7-months',
      getLast7Days: this.originUrl + '/api/admin/transaction/last-7-days',
    }
  }
  handleCloudinary() {
    return {
      uploadImage: this.originUrl + '/api/admin/cloudinary/upload-image',
    }
  }
  handleBlog() {
    return {
      create: this.originUrl + '/api/admin/blog',
      get: this.originUrl + '/api/admin/blog',
      getById: this.originUrl + '/api/admin/blog',
      update: this.originUrl + '/api/admin/blog',
      delete: this.originUrl + '/api/admin/blog',
    }
  }
  handleExam() {
    return {
      get: this.originUrl + '/api/admin/exam',
      getById: (id) => `${this.originUrl}/api/admin/exam/${id}`,
      updateInfor: (id) => `${this.originUrl}/api/admin/exam/${id}/infor`,
      updateData: (id) => `${this.originUrl}/api/admin/exam/${id}/data`,
      delete: (id) => `${this.originUrl}/api/admin/exam/${id}`,
    }
  }
  handleToeicTesting() {
    return {
      getAll: this.originUrl + '/api/admin/toeic-testing',
      getById: (id) => `${this.originUrl}/api/admin/toeic-testing/${id}`,
      create: this.originUrl + '/api/admin/toeic-testing',
      createMany: this.originUrl + '/api/admin/toeic-testing/batch',
      getByFilter: this.originUrl + '/api/admin/toeic-testing/filter/all',
      update: (id) => `${this.originUrl}/api/admin/toeic-testing/${id}`,
      delete: (id) => `${this.originUrl}/api/admin/toeic-testing/${id}`,
    }
  }
  handleToeicTestSession() {
    return {
      create: this.originUrl + '/api/admin/toeic-test-session',
    }
  }
}
