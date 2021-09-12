import { badRequest } from '../helpers/http.helper'
import { Controller } from '../protocols/controller.protocol'
import { InvalidParamError } from '../errors/invalid-param.error'
import { MissingParamError } from '../errors/missing-param.error'
import { EmailValidator } from '../protocols/email-validator.protocol'
import { HttpResponse, httpRequest } from '../protocols/http.protocol'

export class SignUpController implements Controller {
  constructor(private readonly emailValidator: EmailValidator) {}

  handle(httpRequest: httpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

    for (const field of requiredFields) {
      if (!httpRequest.body[field]) return badRequest(new MissingParamError(field))
    }

    const isValid = this.emailValidator.isValid(httpRequest.body.email)

    if (!isValid) return badRequest(new InvalidParamError('email'))

    return { statusCode: 200 }
  }
}
