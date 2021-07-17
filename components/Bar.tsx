import { memo } from 'react';

const Bar = memo(
  (props) => {
    return <div>Bar</div>
  },
  () => {
    return true;
  },
);

export default Bar;