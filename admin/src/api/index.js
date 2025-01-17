export const originUrlUser = 'http://localhost:4000/api/user'
export const originUrlAdmin = 'http://localhost:4000/api/admin'
export const originUrlPub = 'http://localhost:4000/api/pub'
export const originUrl = 'http://localhost:4000'
export const originUrlUpload = 'http://localhost:4000/uploads'
const userAnalyst = {
  upgrade: `${originUrlAdmin}/user/analyst/upgrade`,
  new: `${originUrlAdmin}/user/analyst/new`,
  progress: `${originUrlAdmin}/user/analyst/progress`,
}
const transactionAnalyst = {
  new: `${originUrlAdmin}/transaction/analyst/new`,
  progress: `${originUrlAdmin}/transaction/analyst/progress`,
}
const result = {
  new: `${originUrlAdmin}/result/analyst/new`,
  progress: `${originUrlAdmin}/result/analyst/progress`,
}
const user = {
  get: `${originUrlAdmin}/user`,
}
const test = {
  create: `${originUrlAdmin}/test`,
  get: `${originUrlAdmin}/test`,
  getById: (id) => `${originUrlAdmin}/test/${id}`,
  updateInfor: (id) => `${originUrlAdmin}/test/${id}/infor`,
  updateData: (id) => `${originUrlAdmin}/test/${id}/data`,
  delete: (id) => `${originUrlAdmin}/test/${id}`,
}
const auth = {
  login: `${originUrlAdmin}/auth/login`,
  logout: `${originUrlAdmin}/auth/logout`,
  currentUser: `${originUrlAdmin}/auth/current-user`,
}
const transaction = {
  get: `${originUrlAdmin}/transaction`,
  updateStatus: `${originUrlAdmin}/transaction/update-status`,
  getStatus: `${originUrlAdmin}/transaction/status`,
}
const cloudinary = {
  uploadImage: `${originUrlAdmin}/cloudinary/upload-image`,
}
const blog = {
  create: `${originUrlAdmin}/blog`,
  get: `${originUrlAdmin}/blog`,
  getById: `${originUrlAdmin}/blog`,
  update: `${originUrlAdmin}/blog`,
  delete: `${originUrlAdmin}/blog`,
}
export const endpoint = {
  userAnalyst,
  transactionAnalyst,
  result,
  user,
  test,
  auth,
  transaction,
  cloudinary,
  blog,
}
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
}
