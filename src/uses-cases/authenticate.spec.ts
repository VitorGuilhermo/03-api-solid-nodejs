import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { expect, describe, it, beforeEach } from 'vitest'
import { AuthenticateUseCase } from './authenticate'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let usersRepository: InMemoryUsersRepository
let authenticateUseCase: AuthenticateUseCase //sut -> system under test

describe('Authenticate use case', () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository()
		authenticateUseCase = new AuthenticateUseCase(usersRepository) 
	})

	it('should be able to authenticate', async () => {
		await usersRepository.create({
			name: 'John Doe',
			email: 'john_doe@gmail.com',
			password_hash: await hash('123456', 6)
		})

		const { user } = await authenticateUseCase.execute({
			email: 'john_doe@gmail.com',
			password: '123456'
		})

		expect(user.id).toEqual(expect.any(String))
	})

	it('should not be able to authenticate with wrong email', async () => {
		await expect(() => 
			authenticateUseCase.execute({
				email: 'john_doe@gmail.com',
				password: '123456'
			})
		).rejects.toBeInstanceOf(InvalidCredentialsError)
	})

	it('should not be able to authenticate with wrong password', async () => {
		await usersRepository.create({
			name: 'John Doe',
			email: 'john_doe@gmail.com',
			password_hash: await hash('123456', 6)
		})

		await expect(() => 
			authenticateUseCase.execute({
				email: 'john_doe@gmail.com',
				password: '654321'
			})
		).rejects.toBeInstanceOf(InvalidCredentialsError)
	})
})