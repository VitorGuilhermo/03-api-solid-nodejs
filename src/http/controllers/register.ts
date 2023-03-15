import { FastifyRequest, FastifyReply } from 'fastify'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { registerUseCase } from '@/uses-cases/register'

export async function register(req: FastifyRequest, res: FastifyReply) {
	const registerBodySchema = z.object({
		name: z.string(),
		email: z.string().email(),
		password: z.string().min(6),
	})

	const { name, email, password } = registerBodySchema.parse( req.body )

	try {
		await registerUseCase({ name, email, password })
	}
	catch(err) {
		return res.status(409).send()
	}

	return res.status(201).send()
}