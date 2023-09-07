import fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'
import { ZodError } from 'zod'
import { env } from './env'
import { appRoutes } from './http/routes'

export const app = fastify()

app.register(fastifyJwt, {
	secret: env.JWT_SECRET
})

app.register(appRoutes)


app.setErrorHandler((error, _, res) => {
	if(error instanceof ZodError) {
		return res.status(400).send({mesage: 'Valdation Error.', issues: error.format()})
	}

	if(env.NODE_ENV !== 'production') {
		console.log(error)
	}
	else {
		//TODO: Here we should log to an external tool like DataDog/NewRelic/Sentry
	}

	return res.status(500).send({ message: 'Internal server error.' })
})