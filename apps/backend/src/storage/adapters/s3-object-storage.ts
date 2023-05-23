import {
  CreateBucketCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
  waitUntilBucketExists,
} from '@aws-sdk/client-s3'
import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import type { ConfigType } from '@nestjs/config'
import { InjectAws } from 'aws-sdk-v3-nest'
import { Readable } from 'stream'
import { v4 } from 'uuid'
import { InjectObjectStorageConfig, objectStorageConfig } from '../../configs/object-storage.config.js'
import { IObjectStorage } from './object-storage.js'

@Injectable()
export class S3ObjectStorage implements IObjectStorage, OnModuleInit {
  private readonly logger = new Logger(S3ObjectStorage.name)

  constructor(
    @InjectObjectStorageConfig() private readonly config: ConfigType<typeof objectStorageConfig>,
    // @ts-ignore
    @InjectAws(S3Client) readonly s3: S3Client,
  ) {}

  async onModuleInit() {
    const { bucket } = this.config.s3

    if (this.config.provider === 's3') {
      try {
        await waitUntilBucketExists({ client: this.s3, maxWaitTime: 6 }, { Bucket: bucket })
        this.logger.log('bucket %s exists, skipping creation...', bucket)
      } catch (error) {
        this.logger.log('bucket %s not exists, creating...', bucket)
        await this.s3.send(new CreateBucketCommand({ Bucket: bucket }))
        this.logger.log('bucket %s created', bucket)
      }
    }
  }

  async put(
    buffer: Buffer,
    originalname: string,
    mimetype: string,
  ): Promise<{ url: string; token: string; id: string }> {
    const bucket = this.config.s3.bucket
    const id = v4()
    const name = id + '_' + originalname
    const metadata = {
      'Content-Type': mimetype,
    }

    const reply = await this.s3.send(
      new PutObjectCommand({ Bucket: bucket, Body: buffer, Key: name, Metadata: metadata }),
    )

    return {
      url: `/api/attachment/${name}`,
      token: reply.ETag ?? '',
      id,
    }
  }

  async get(name: string): Promise<{ data: Readable; metaData: any }> {
    const bucket = this.config.s3.bucket
    const output = await this.s3.send(new GetObjectCommand({ Bucket: bucket, Key: name }))
    const data = output.Body as Readable
    return { data, metaData: output.Metadata }
  }
}
