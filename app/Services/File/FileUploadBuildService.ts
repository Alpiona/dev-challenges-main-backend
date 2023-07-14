import Application from '@ioc:Adonis/Core/Application'
import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'
import { schema } from '@ioc:Adonis/Core/Validator'
import { DefaultValidatorMessages } from 'App/Constants/DefaultValidatorMessages'
import { FileDirectories } from 'App/Constants/FileDirectories'
import { OperatingSystems } from 'App/Constants/OperatingSystems'
import GameBuild from 'App/Models/GameBuild'
import BaseService from '../BaseService'

export default class FileUploadBuildService implements BaseService<Input, Output> {
  public async execute({ file, operatingSystem, version }: Input): Promise<Output> {
    const { extname: fileExtension, size } = file
    const sizeFormatted = Math.floor(size / 1000000) + 'MB'
    const gameBuild = await GameBuild.create({
      fileExtension,
      operatingSystemId: OperatingSystems[operatingSystem],
      size: sizeFormatted,
      version,
    })

    const fileName = `${gameBuild.id}.${fileExtension}`

    const path = Application.tmpPath(FileDirectories.GAME_BUILD)
    await file.move(path, { name: fileName })

    const url = `http://localhost:3333/files/download?fileName=${fileName}&type=GAME_BUILD`

    return { fileName, url, size: sizeFormatted, operatingSystem, version }
  }

  public schemaValidator = {
    schema: schema.create({
      file: schema.file(),
      version: schema.string(),
      operatingSystem: schema.enum(Object.keys(OperatingSystems)),
    }),
    messages: DefaultValidatorMessages,
  }
}

type Input = {
  file: MultipartFileContract
  version: string
  operatingSystem: string
}

type Output = {
  fileName: string
  url: string
  size: string
  operatingSystem: string
  version: string
}
