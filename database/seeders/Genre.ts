import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Genre from 'App/Models/Genre'

export default class extends BaseSeeder {
  public async run() {
    await Genre.createMany([
      { name: 'Adventure' },
      { name: 'RPG' },
      { name: 'Shooter' },
      { name: 'Visual Novel' },
      { name: 'Horror' },
    ])
  }
}
