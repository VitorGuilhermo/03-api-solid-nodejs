import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { compare } from 'bcryptjs'
import { expect, describe, it } from 'vitest'
import { RegisterUseCase } from './register'

describe('Register use case', () => {
	it('should hash user password upon registration', async () => {
		const usersRepository = new InMemoryUsersRepository()
		const registerUseCase = new RegisterUseCase(usersRepository)

		const { user } = await registerUseCase.execute({
			name: 'John Doe',
			email: 'john_doe@gmail.com',
			password: '123456'
		})

		const isPasswordCorrectlyHashed = await compare(
			'123456',
			user.password_hash
		)

		expect(isPasswordCorrectlyHashed).toBe(true)
	})
})