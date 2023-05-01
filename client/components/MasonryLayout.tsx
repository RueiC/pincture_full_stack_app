import Masonry from 'react-masonry-css';
import { ConfirmModal } from './index';
import Pin from './Pin';
import { PinItem } from '../types/types';

import { useStateContext } from '../store/stateContext';

interface Props {
  pins: PinItem[];
  session: any;
}

const breakpointColumnsObj = {
  default: 1,
  5000: 3,
  1200: 3,
  990: 2,
  768: 1,
};

const MasonryLayout = ({ pins, session }: Props) => {
  const { toggleDeleteWindow } = useStateContext();

  return (
    <>
      {toggleDeleteWindow ? <ConfirmModal /> : null}

      <Masonry
        className='flex w-auto gap-[24px]'
        breakpointCols={breakpointColumnsObj}
      >
        {pins.map((pin) => (
          <Pin pin={pin} key={pin._id} session={session} />
        ))}
      </Masonry>
    </>
  );
};

export default MasonryLayout;
