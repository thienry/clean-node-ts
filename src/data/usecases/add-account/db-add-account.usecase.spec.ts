import { DbAddAccount } from './db-add-account.usecase'
import { AccountModel, AddAccountModel, AddAccountRepo, Encrypter } from './db-add-account.protocols'

interface SutTypes {
  sut: DbAddAccount
  encrypterStub: Encrypter
  addAccountRepoStub: AddAccountRepo
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(password: string): Promise<string> {
      return await new Promise(resolve => resolve('hashed_password'))
    }
  }
  return new EncrypterStub()
}

const makeAddAccountRepo = (): AddAccountRepo => {
  class AddAccountRepoStub implements AddAccountRepo {
    async add(accountData: AddAccountModel): Promise<AccountModel> {
      return await new Promise(resolve => {
        const fakeAccount = {
          id: 'valid_id',
          name: 'valid_name',
          email: 'valid_email@mail.com',
          password: 'hashed_password'
        }
        resolve(fakeAccount)
      })
    }
  }
  return new AddAccountRepoStub()
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()
  const addAccountRepoStub = makeAddAccountRepo()

  const sut = new DbAddAccount(encrypterStub, addAccountRepoStub)

  return { sut, encrypterStub, addAccountRepoStub }
}

const accountData = {
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password'
}

describe('DbAddAccount Usecase', () => {
  test('Should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    await sut.add(accountData)

    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })

  test('Should throw an error if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.add(accountData)

    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepoStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepoStub, 'add')
    await sut.add(accountData)

    expect(addSpy).toHaveBeenCalledWith({ ...accountData, password: 'hashed_password' })
  })

  test('Should throw an error if AddAccountRepo throws', async () => {
    const { sut, addAccountRepoStub } = makeSut()
    jest.spyOn(addAccountRepoStub, 'add')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.add(accountData)

    await expect(promise).rejects.toThrow()
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.add(accountData)

    expect(account).toEqual({ ...accountData, id: 'valid_id', password: 'hashed_password' })
  })
})
