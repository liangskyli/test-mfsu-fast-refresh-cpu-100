import { memo } from 'react';
import styles from './Foo.less';
import Bar from "./Bar";

const Foo = memo(
  (props) => {
    return <div className={styles.a}>
      <div>Foo</div>
      <Bar />
    </div>
  },
  () => {
    return true;
  },
);
export default Foo;