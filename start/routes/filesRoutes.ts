import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/files/upload', 'FilesController.uploadFile')

  Route.post('/files/upload/build', 'FilesController.uploadBuildFile')

  Route.get('/files/download', 'FilesController.downloadFile')
})
