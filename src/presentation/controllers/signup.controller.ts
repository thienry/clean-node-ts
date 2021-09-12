import { badRequest } from '../helpers/http.helper'
import { Controller } from '../protocols/controller.protocol'
import { MissingParamError } from '../errors/missing-param.error'
import { HttpResponse, httpRequest } from '../protocols/http.protocol'

export class SignUpController implements Controller {
  handle(httpRequest: httpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

    for (const field of requiredFields) {
      if (!httpRequest.body[field]) return badRequest(new MissingParamError(field))
    }

    return { statusCode: 200 }
  }
}
