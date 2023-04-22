import { CheckIn } from '@prisma/client'
import { CheckInsRepository } from '@/repositories/check-ins-repository'

interface CheckInUseCaseRequest {
    userId: string
    gymId: string
}

interface CheckInUseCaseResponse {
    checkIn: CheckIn
}


export class CheckInUseCase {
	private checkInsRepository: CheckInsRepository

	constructor(checkInsRepository: CheckInsRepository) {
		this.checkInsRepository = checkInsRepository
	}

	async execute({userId, gymId}: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
		const checkIn = await this.checkInsRepository.create({
			user_id: userId,
			gym_id: gymId,
		})

		return {
			checkIn
		}
	}   
}