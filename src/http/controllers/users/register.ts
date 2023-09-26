import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { UserAlreadyExistsError } from '@/uses-cases/errors/user-already-exists-error'
import { makeRegisterUseCase } from '@/uses-cases/factories/make-register-use-case'

export async function register(req: FastifyRequest, res: FastifyReply) {
	const registerBodySchema = z.object({
		name: z.string(),
		email: z.string().email(),
		password: z.string().min(6),
	})

	const { name, email, password } = registerBodySchema.parse( req.body )

	try {
		const registerUseCase = makeRegisterUseCase()

		await registerUseCase.execute({ name, email, password })
	}
	catch(err) {
		if(err instanceof UserAlreadyExistsError) {
			return res.status(409).send()
		}

		throw err
	}

	return res.status(201).send()
}