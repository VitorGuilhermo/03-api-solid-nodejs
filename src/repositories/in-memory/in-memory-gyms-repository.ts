import { Gym, Prisma } from '@prisma/client'
import { GymsRepository } from '../gyms-repository'
import { randomUUID } from 'node:crypto'


export class InMemoryGymsRepository implements GymsRepository {
	public items: Gym[] = []
    
	async create(data: Prisma.GymCreateInput) {
		const gym = {
			id: data.id ?? randomUUID(),
			title: data.title,
			description: data.description ?? null,
			phone: data.phone ?? null,
			latitude: new Prisma.Decimal( data.latitude.toString() ),
			longiture: new Prisma.Decimal( data.longiture.toString() ),
			created_at: new Date()
		}

		this.items.push(gym)

		return gym

	}
	
	async findById(id: string): Promise<Gym | null> {
		const gym = this.items.find((item) => item.id === id)

		if(!gym) 
			return null
        
		return gym
	}

	async searchMany(title: string, page: number): Promise<Gym[]> {
		return this.items
			.filter(item => item.title.includes(title))
			.slice((page - 1) * 20, page * 20)
	}
}