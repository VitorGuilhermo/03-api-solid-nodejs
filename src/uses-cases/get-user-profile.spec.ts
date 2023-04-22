import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { expect, describe, it, beforeEach } from 'vitest'
import { GetUserProfileUseCase } from './get-user-profile'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let usersRepository: InMemoryUsersRepository
let getUserProfileUseCase: GetUserProfileUseCase //sut -> system under test

describe('Get User Profile use case', () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository()
		getUserProfileUseCase = new GetUserProfileUseCase(usersRepository) 
	})

	it('should be able to get user profile', async () => {
		const createdUser = await usersRepository.create({
			name: 'John Doe',
			email: 'john_doe@gmail.com',
			password_hash: await hash('123456', 6)
		})

		const { user } = await getUserProfileUseCase.execute({
			userId:  createdUser.id
		})

		expect(user.name).toEqual('John Doe')
	})

	it('should not be able to get user profile with wrong id', async () => {
		expect(() => 
			getUserProfileUseCase.execute({
				userId: 'non-existing-id'
			})
		).rejects.toBeInstanceOf(ResourceNotFoundError)
	})
})