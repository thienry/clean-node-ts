import { HttpResponse, httpRequest } from './http.protocol'

export interface Controller {
  handle: (httpRequest: httpRequest) => HttpResponse
}
