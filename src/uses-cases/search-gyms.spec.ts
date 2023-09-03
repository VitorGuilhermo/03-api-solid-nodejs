import { expect, describe, it, beforeEach } from 'vitest'
import { SearchGymsUseCase } from './search-gyms'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

let gymsRepository: InMemoryGymsRepository
let gymsUseCase: SearchGymsUseCase

describe('Search Gyms Use Case', () => {
	beforeEach(async () => {
		gymsRepository = new InMemoryGymsRepository()
		gymsUseCase = new SearchGymsUseCase(gymsRepository)
	})

	it('should be able to search for gyms', async () => {
		await gymsRepository.create({
			title: 'gym-01',
			description: null,
			phone: null,
			latitude: -21.7682352,
			longiture: -50.9624695
		})

		await gymsRepository.create({
			title: 'user-02',
			description: null,
			phone: null,
			latitude: -21.7682352,
			longiture: -50.9624695
		})

		const { gyms } = await gymsUseCase.execute({ query: '01', page: 1 })

		expect(gyms).toHaveLength(1)
		expect(gyms).toEqual([
			expect.objectContaining({ title: 'gym-01' }),
		])
	})

	it('should be able to fetch paginated gym search', async () => {
		for (let i = 1; i <= 22; i++) {
			await gymsRepository.create({
				title: `gym-${i}`,
				description: null,
				phone: null,
				latitude: -21.7682352,
				longiture: -50.9624695
			})
		}

		const { gyms } = await gymsUseCase.execute({
			query: 'gym',
			page: 2
		})

		expect(gyms).toHaveLength(2)
		expect(gyms).toEqual([
			expect.objectContaining({ title: 'gym-21' }),
			expect.objectContaining({ title: 'gym-22' })
		])
	})
})