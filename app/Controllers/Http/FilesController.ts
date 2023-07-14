import Application from '@ioc:Adonis/Core/Application'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { FileDirectories } from 'App/Constants/FileDirectories'
import FileUploadBuildService from 'App/Services/File/FileUploadBuildService'
import FileUploadService from 'App/Services/File/FileUploadService'

export default class FilesController {
  public async uploadFile({ request, response }: HttpContextContract) {
    const service = new FileUploadService()

    const input = await request.validate(service.schemaValidator)

    const output = await service.execute(input)

    return response.created({ data: output, errors: [] })
  }

  public async uploadBuildFile({ request, response }: HttpContextContract) {
    const service = new FileUploadBuildService()

    const input = await request.validate(service.schemaValidator)

    const output = await service.execute(input)

    return response.created({ data: output, errors: [] })
  }

  //Essa rota existe para criar uma URL que será utilizado pelo front para ter acesso direto aos arquivos
  //É recomendado que seja substituído por URL (talvez presigned, por motivos de segurança)
  //de algum serviço em nuvem, como S3 da AWS
  public async downloadFile({ request, response }: HttpContextContract) {
    const { fileName, type } = request.qs()

    const relativeFilePath = `${FileDirectories[type]}/${fileName}`
    const filePath = Application.tmpPath(relativeFilePath)

    if (['GAME_IMAGE', 'GAME_COVER_IMAGE'].includes(type)) {
      response.append('Content-type', 'image/jpeg')
    }
    return response.download(filePath)
  }
}
