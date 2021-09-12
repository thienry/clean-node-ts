import { badRequest } from '../helpers/http.helper'
import { MissingParamError } from '../errors/missing-param.error'
import { HttpResponse, httpRequest } from '../protocols/http.protocol'

export class SignUpController {
  handle(httpRequest: httpRequest): HttpResponse {
    if (!httpRequest.body.name) return badRequest(new MissingParamError('name'))
    if (!httpRequest.body.email) return badRequest(new MissingParamError('email'))

    return { statusCode: 200 }
  }
}
