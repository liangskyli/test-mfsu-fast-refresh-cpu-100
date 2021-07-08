import type { FC } from 'react';

type IconProps = {
  name: string;
  className?: string;
  [key: string]: any;
};

export default function create(): FC<IconProps> {
  const Iconfont: FC<IconProps> = () => {
    return <div>iconfont</div>;
  };

  Iconfont.displayName = 'Iconfont';

  return Iconfont;
}
