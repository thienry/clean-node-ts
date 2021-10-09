import { AccountModel, AddAccountModel, AddAccount, Encrypter, AddAccountRepo } from './db-add-account.protocols'

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly encrypter: Encrypter,
    private readonly addAccountRepo: AddAccountRepo
  ) {}

  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(accountData.password)
    await this.addAccountRepo.add({ ...accountData, password: hashedPassword })
    return await new Promise(resolve => resolve({
      id: '',
      name: '',
      email: '',
      password: ''
    }))
  }
}
