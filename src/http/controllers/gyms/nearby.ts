import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { makeFetchNearbyGymsUseCase } from '@/uses-cases/factories/make-fetch-nearby-gyms-use-case'

export async function nearby(req: FastifyRequest, res: FastifyReply) {
	const nearbyGymsQuerySchema = z.object({
		latitude: z.coerce.number().refine(value => {
			return Math.abs(value) <= 90
		}),
		longitude: z.coerce.number().refine(value => {
			return Math.abs(value) <= 180
		}),
	})

	const { latitude, longitude } = nearbyGymsQuerySchema.parse( req.query )

	const fetchNearbyGymUseCase = makeFetchNearbyGymsUseCase()

	const { gyms } = await fetchNearbyGymUseCase.execute({ 
		userLatitude: latitude,
		userLongitude: longitude
	})
	
	return res.status(200).send({
		gyms
	})
}