import { ImagePairResponse } from '../../image/image.model';
import Button from '../component/button.comp';
import ImageDropZone from '../component/dropzone.comp';
import ImageCard from '../component/image.compt';
import PendingImageCard from '../component/pendingImage.comp';

export default function ImagePage({ images }: { images: ImagePairResponse[] }) {
  return (
    <>
      <h1 class={'mb-4'}>Upload Your Image</h1>
      <p class={'mb-6'}>Upload sebanyak mungkin foto untuk absensi MyPelindo</p>

      <div>
        <ImageDropZone id="dropzone-file" />
        <div>
          <h3 class={'text-slate-300'}>Pending image upload</h3>
          <div id="pending-container">
            <PendingImageCard id="1" />
            <PendingImageCard id="2" />
            <PendingImageCard id="3" />
            <PendingImageCard id="4" />
            <PendingImageCard id="5" />
            <Button buttonName="upload" placeholder="Upload" />
          </div>
        </div>
      </div>

      <h3 class={'text-slate-300'}>Your Image Galery</h3>

      <div class={'flex flex-wrap flex-col md:flex-row'} id="image-galery">
        {images.map((i, counter) => (
          <ImageCard
            id={String(counter + 1)}
            clock_in_path={i.clock_in_image_path}
            clock_out_path={i.clock_out_image_path}
          />
        ))}
      </div>
    </>
  );
}
