import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let checkInUseCase: CheckInUseCase

describe('Check-in use case', () => {
	beforeEach(() => {
		checkInsRepository = new InMemoryCheckInsRepository()
		gymsRepository = new InMemoryGymsRepository()
		checkInUseCase = new CheckInUseCase(checkInsRepository, gymsRepository)

		gymsRepository.items.push({
			id: 'gym-01',
			title: 'JS Gym',
			description: 'JS Gym',
			phone: '0',
			latitude: new Decimal(-21.7954059),
			longiture: new Decimal(-50.8705807),

		})

		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('should be able to check in', async () => {
		const { checkIn } = await checkInUseCase.execute({
			gymId: 'gym-01',
			userId: 'user-01',
			userLatitude: -21.7954059,
			userLongitude: -50.8705807
		})

		expect(checkIn.id).toEqual(expect.any(String))
	})

	it('should not be able to check in twice in the same day', async () => {
		vi.setSystemTime(new Date(2022, 3, 19, 8, 0, 0))

		await checkInUseCase.execute({
			gymId: 'gym-01',
			userId: 'user-01',
			userLatitude: -21.7954059,
			userLongitude: -50.8705807
		})

		await expect(() => checkInUseCase.execute({
			gymId: 'gym-02',
			userId: 'user-02',
			userLatitude: -21.7954059,
			userLongitude: -50.8705807
		})).rejects.toBeInstanceOf(Error)
	})

	it('should not be able to check in twice but in different days', async () => {
		vi.setSystemTime(new Date(2022, 3, 19, 8, 0, 0))

		await checkInUseCase.execute({
			gymId: 'gym-01',
			userId: 'user-01',
			userLatitude: -21.7954059,
			userLongitude: -50.8705807
		})

		vi.setSystemTime(new Date(2022, 3, 20, 8, 0, 0))

		const { checkIn } = await checkInUseCase.execute({
			gymId: 'gym-02',
			userId: 'user-02',
			userLatitude: -21.7682352,
			userLongitude: -50.9624695
		})

		expect(checkIn.id).toEqual(expect.any(String))
	})

	it('should not be able to check in on distance gym', async () => {
		gymsRepository.items.push({
			id: 'gym-02',
			title: 'JS Gym',
			description: 'JS Gym',
			phone: '0',
			latitude: new Decimal(-21.7954059),
			longiture: new Decimal(-50.8705807),

		})

		await expect(() => checkInUseCase.execute({
			gymId: 'gym-02',
			userId: 'user-01',
			userLatitude: -21.7682352,
			userLongitude: -50.9624695
		})).rejects.toBeInstanceOf(Error)
	})
})