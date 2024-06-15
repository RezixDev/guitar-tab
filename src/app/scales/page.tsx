import ScaleViewer from '../components/ScaleViewer';
import { majorScale } from '../utils/noteUtils';

export default function Page() {
  return (
    <>
      <div className='app'>
        <h1 className='text-2xl font-bold mb-4'>Scale Viewer</h1>
        <ScaleViewer width={800} height={300} scale={majorScale} />
      </div>
    </>
  );
}
