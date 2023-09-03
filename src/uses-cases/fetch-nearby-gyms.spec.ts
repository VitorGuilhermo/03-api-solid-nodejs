import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let gymsUseCase: FetchNearbyGymsUseCase

describe('Search Gyms Use Case', () => {
	beforeEach(async () => {
		gymsRepository = new InMemoryGymsRepository()
		gymsUseCase = new FetchNearbyGymsUseCase(gymsRepository)
	})

	it('should be able to fetch nearby gyms', async () => {
		await gymsRepository.create({
			title: 'Near Gym',
			description: null,
			phone: null,
			latitude: -21.7682352,
			longiture: -50.9624695
		})

		await gymsRepository.create({
			title: 'Far Gym',
			description: null,
			phone: null,
			latitude: -21.7682352,
			longiture: -52.9624695
		})

		const { gyms } = await gymsUseCase.execute({
			userLatitude: -21.7954059,
			userLongitude: -50.8705807,
		})

		expect(gyms).toHaveLength(1)
		expect(gyms).toEqual([
			expect.objectContaining({ title: 'Near Gym' }),
		])
	})
})