import {
  CreateBucketCommand,
  GetObjectCommand,
  HeadBucketCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import type { OnModuleInit } from '@nestjs/common'
import { Injectable, Logger } from '@nestjs/common'
import { type ConfigType } from '@nestjs/config'
import { InjectAws } from 'aws-sdk-v3-nest'
import type { Readable } from 'stream'
import { v4 } from 'uuid'
import type { objectStorageConfig } from '../../configs/object-storage.config.js'
import { InjectObjectStorageConfig } from '../../configs/object-storage.config.js'
import type { IObjectStorage } from './object-storage.js'

@Injectable()
export class S3ObjectStorage implements IObjectStorage, OnModuleInit {
  private readonly logger = new Logger(S3ObjectStorage.name)

  constructor(
    @InjectObjectStorageConfig() private readonly config: ConfigType<typeof objectStorageConfig>,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    @InjectAws(S3Client) readonly s3: S3Client,
  ) {}

  async onModuleInit() {
    const { bucket } = this.config.s3

    if (this.config.provider === 's3') {
      try {
        await this.s3.send(new HeadBucketCommand({ Bucket: bucket }) as any)
        this.logger.log('bucket %s exists, skipping creation...', bucket)
      } catch (error) {
        this.logger.log('bucket %s not exists, creating...', bucket)
        await this.s3.send(new CreateBucketCommand({ Bucket: bucket }) as any)
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
      new PutObjectCommand({ Bucket: bucket, Body: buffer, Key: name, Metadata: metadata }) as any,
    )

    return {
      url: `/api/attachment/${name}`,
      // @ts-ignore
      token: reply.ETag ?? '',
      id,
    }
  }

  async get(name: string): Promise<{ data: Readable; metaData: any }> {
    const bucket = this.config.s3.bucket
    const output = (await this.s3.send(new GetObjectCommand({ Bucket: bucket, Key: name }) as any)) as any
    const data = output.Body as Readable
    return { data, metaData: output.Metadata }
  }
}
