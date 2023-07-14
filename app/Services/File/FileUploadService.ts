import { Exception } from '@adonisjs/core/build/standalone'
import Application from '@ioc:Adonis/Core/Application'
import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'
import { schema } from '@ioc:Adonis/Core/Validator'
import { DefaultValidatorMessages } from 'App/Constants/DefaultValidatorMessages'
import { FileDirectories } from 'App/Constants/FileDirectories'
import GameImage from 'App/Models/GameImage'
import { v4 as uuidv4 } from 'uuid'
import BaseService from '../BaseService'

export default class FileUploadService implements BaseService<Input, Output> {
  public async execute({ file, type }: Input): Promise<Output> {
    switch (type) {
      case 'GAME_IMAGE':
        return await this.handleGameImageUpload(file)
      case 'GAME_COVER_IMAGE':
        return await this.handleGameCoverImageUpload(file)
      default:
        throw new Exception('Invalid upload type')
    }
  }

  private async handleGameImageUpload(file: MultipartFileContract) {
    const { extname: fileExtension } = file
    const image = await GameImage.create({ fileExtension })
    const fileName = `${image.id}.${fileExtension}`

    const path = Application.tmpPath(FileDirectories.GAME_IMAGE)
    await file.move(path, { name: fileName })

    const url = `http://localhost:3333/files/download?fileName=${fileName}&type=GAME_IMAGE`

    return { fileName, url }
  }

  private async handleGameCoverImageUpload(file: MultipartFileContract) {
    let fileName = `${uuidv4()}.${file.extname}`

    const path = Application.tmpPath(FileDirectories.GAME_COVER_IMAGE)
    await file.move(path, { name: fileName })

    const url = `http://localhost:3333/files/download?fileName=${fileName}&type=GAME_COVER_IMAGE`

    return { fileName, url }
  }

  public schemaValidator = {
    schema: schema.create({
      file: schema.file(),
      type: schema.enum(Object.keys(FileDirectories)),
    }),
    messages: DefaultValidatorMessages,
  }
}

type Input = {
  file: MultipartFileContract
  type: string
}

type Output = {
  fileName: string
  url: string
  size?: string
  originalFileName?: string
}
