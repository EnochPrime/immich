import { assetStub, newAssetRepositoryMock, newJobRepositoryMock, newStorageRepositoryMock } from '@test';
import { constants } from 'fs/promises';
import { IAssetRepository, WithoutProperty, WithProperty } from '../asset';
import { IJobRepository, JobName } from '../job';
import { IStorageRepository } from '../storage';
import { MetadataService } from './metadata.service';

describe(MetadataService.name, () => {
  let sut: MetadataService;
  let assetMock: jest.Mocked<IAssetRepository>;
  let jobMock: jest.Mocked<IJobRepository>;
  let storageMock: jest.Mocked<IStorageRepository>;

  beforeEach(async () => {
    assetMock = newAssetRepositoryMock();
    jobMock = newJobRepositoryMock();
    storageMock = newStorageRepositoryMock();

    sut = new MetadataService(assetMock, jobMock, storageMock);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  describe('handleQueueSidecar', () => {
    it('should queue assets with sidecar files', async () => {
      assetMock.getWith.mockResolvedValue({ items: [assetStub.sidecar], hasNextPage: false });

      await sut.handleQueueSidecar({ force: true });

      expect(assetMock.getWith).toHaveBeenCalledWith({ take: 1000, skip: 0 }, WithProperty.SIDECAR);
      expect(assetMock.getWithout).not.toHaveBeenCalled();
      expect(jobMock.queue).toHaveBeenCalledWith({
        name: JobName.SIDECAR_SYNC,
        data: { id: assetStub.sidecar.id },
      });
    });

    it('should queue assets without sidecar files', async () => {
      assetMock.getWithout.mockResolvedValue({ items: [assetStub.image], hasNextPage: false });

      await sut.handleQueueSidecar({ force: false });

      expect(assetMock.getWithout).toHaveBeenCalledWith({ take: 1000, skip: 0 }, WithoutProperty.SIDECAR);
      expect(assetMock.getWith).not.toHaveBeenCalled();
      expect(jobMock.queue).toHaveBeenCalledWith({
        name: JobName.SIDECAR_DISCOVERY,
        data: { id: assetStub.image.id },
      });
    });
  });

  describe('handleSidecarSync', () => {
    it('should not error', async () => {
      await sut.handleSidecarSync();
    });
  });

  describe('handleSidecarDiscovery', () => {
    it('should skip hidden assets', async () => {
      assetMock.getByIds.mockResolvedValue([assetStub.livePhotoMotionAsset]);
      await sut.handleSidecarDiscovery({ id: assetStub.livePhotoMotionAsset.id });
      expect(storageMock.checkFileExists).not.toHaveBeenCalled();
    });

    it('should skip assets with a sidecar path', async () => {
      assetMock.getByIds.mockResolvedValue([assetStub.sidecar]);
      await sut.handleSidecarDiscovery({ id: assetStub.sidecar.id });
      expect(storageMock.checkFileExists).not.toHaveBeenCalled();
    });

    it('should do nothing when a sidecar is not found ', async () => {
      assetMock.getByIds.mockResolvedValue([assetStub.image]);
      storageMock.checkFileExists.mockResolvedValue(false);
      await sut.handleSidecarDiscovery({ id: assetStub.image.id });
      expect(assetMock.save).not.toHaveBeenCalled();
    });

    it('should update a image asset when a sidecar is found', async () => {
      assetMock.getByIds.mockResolvedValue([assetStub.image]);
      assetMock.save.mockResolvedValue(assetStub.image);
      storageMock.checkFileExists.mockResolvedValue(true);
      await sut.handleSidecarDiscovery({ id: assetStub.image.id });
      expect(storageMock.checkFileExists).toHaveBeenCalledWith('/original/path.jpg.xmp', constants.R_OK);
      expect(assetMock.save).toHaveBeenCalledWith({
        id: assetStub.image.id,
        sidecarPath: '/original/path.jpg.xmp',
      });
    });

    it('should update a video asset when a sidecar is found', async () => {
      assetMock.getByIds.mockResolvedValue([assetStub.video]);
      assetMock.save.mockResolvedValue(assetStub.video);
      storageMock.checkFileExists.mockResolvedValue(true);
      await sut.handleSidecarDiscovery({ id: assetStub.video.id });
      expect(storageMock.checkFileExists).toHaveBeenCalledWith('/original/path.ext.xmp', constants.R_OK);
      expect(assetMock.save).toHaveBeenCalledWith({
        id: assetStub.image.id,
        sidecarPath: '/original/path.ext.xmp',
      });
    });
  });
});
