import { Injectable } from '@angular/core';
import * as S3 from 'aws-sdk/clients/s3';
import 'rxjs';
import { environment } from 'src/environments/environment';
import { LoaderService } from './loader.service';

const bucket = new S3(
  {
      accessKeyId: environment.accessKeyId,
      secretAccessKey: environment.secretAccessKey,
      region: environment.region
  }
);

@Injectable({
  providedIn: 'root'
})
export class UploadService { 
  constructor(
    public loaderService: LoaderService,
  ) { }
  
findFileName(file){
    var fName = file.split('.')[0];
    var ext = file.split('.').pop();
    var random = Math.floor(Math.random() * 900000000000000000);
    return fName+"___"+random + '.' + ext;
  }

  uploadFile(file,filename) {
    const contentType = file.type;
      const params = {
          Bucket: environment.Bucket,
          Key: filename,
          Body: file,
          ACL: 'public-read',
          ContentType: contentType
      };
      bucket.upload(params, function (err, data) {
          if (err) {
              return false;
          }
          return true;
      });
  }

  async fileExist(bucketName,fileName) {
    var params = {
      Bucket:  bucketName,
      Key:fileName
    };
    try {
          await bucket.headObject(params).promise()
          return true;
      } catch (err) {
          return err.code;
    }
  }
  async uploadFileSync(fileArr,fileKeyDyn) {
    let storedArr= [];
    for(var i=0;i<fileArr.length;i++){
      if(fileArr[i]!=undefined){
        const contentType = fileArr[i].type;
        const params = {
          Bucket: environment.Bucket,
          Key: fileKeyDyn[i],
          Body: fileArr[i], 
          ACL: 'public-read',
          ContentType: contentType
        };
        try {
          const stored = await bucket.upload(params).promise()
          storedArr.push(stored);
        } catch (err) {
          storedArr.push(err);
        }
      }
    }
    return storedArr;
  }  
}