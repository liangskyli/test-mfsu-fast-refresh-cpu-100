import { memo } from 'react';

const Dar = memo(
  (props) => {
    return <div>Dar</div>
  },
  () => {
    return true;
  },
);

export default Dar;