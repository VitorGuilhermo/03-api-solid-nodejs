import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { makeValidateCheckInUseCase } from '@/uses-cases/factories/make-validate-check-in-use-case'

export async function validate(req: FastifyRequest, res: FastifyReply) {
	const validateCheckInParamsSchema = z.object({
		checkInId: z.string().uuid(),
	})

	const { checkInId } = validateCheckInParamsSchema.parse(req.query)

	const validateCheckInUseCase = makeValidateCheckInUseCase()

	await validateCheckInUseCase.execute({ 
		checkInId, 
	})

	return res.status(204).send()
}