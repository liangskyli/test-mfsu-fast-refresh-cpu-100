import create from './IconFont';
import { memo } from 'react';

export type Props = {
  name: string;
  style?: any;
  className?: string;
  size?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg';
};

export default memo(
  (props: Props) => {
    const { name, size = '', className = '' } = props;

    const MyIcon = create();

    return <MyIcon className={className} name={name} size={size} />;
  },
  (prevProps, nextProps) => {
    return (
      prevProps.name === nextProps.name &&
      prevProps.style === nextProps.style &&
      prevProps.className === nextProps.className &&
      prevProps.size === nextProps.size
    );
  },
);
