export interface Project {
  id: number
  title: string
  description: string
  image: string
  technologies: string
  githubUrl: string
  createdAt: string
}

export interface BlogPostSummary {
  id: number
  title: string
  slug: string
  category: string
  tags: string
  viewCount: number
  createdAt: string
}

export interface BlogPost extends BlogPostSummary {
  content: string
  updatedAt: string
}

export interface PaginatedResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export interface ContactFormData {
  name: string
  email: string
  message: string
}

export interface ApiError {
  status: number
  message: string
  timestamp: string
}
