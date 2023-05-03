import { expect, describe, it, beforeEach } from 'vitest'
import { CreateGymUseCase } from './create-gym'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

let gymsRepository: InMemoryGymsRepository
let createGymUseCase: CreateGymUseCase

describe('Register use case', () => {
	beforeEach(() => {
		gymsRepository = new InMemoryGymsRepository()
		createGymUseCase = new CreateGymUseCase(gymsRepository)
	})

	it('should be able to register', async () => {
		const { gym } = await createGymUseCase.execute({
			title: 'JS Gym',
			description: null,
			phone: null,
			latitude: -21.7682352,
			longiture: -50.9624695
		})

		expect(gym.id).toEqual(expect.any(String))
	})
})