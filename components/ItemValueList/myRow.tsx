import { memo } from 'react';

type Props = {
  rowHtml: JSX.Element;
};

const MyRow = memo(
  (rowProps: Props) => {
    const { rowHtml } = rowProps;

    const { props } = rowHtml;
    const { className, style, ...restProps } = props;

    const html = (
      <div aaa="aaa" className={className} style={style} {...restProps}>
        {props.children &&
          (props.children as any).map((cell: any, index: number) => {
            if (cell && cell.key === 'fieldRow-item') {
              return (
                <div key={index} bbb="bbb" {...cell.props}>
                  {cell.props.children &&
                    cell.props.children.map((cell2: any, index2: number) => {
                      if (cell2 && cell2.key === 'fieldRow-cf') {
                        return (
                          <div key={index2} ccc="ccc" {...cell2.props}>
                            {cell2.props.children &&
                              cell2.props.children.map(
                                (cell3: any, index3: number) => {
                                  if (cell3 && cell3.key === 'fieldRow-drag') {
                                    return (
                                      <div
                                        key={index3}
                                        ddd="ddd"
                                        {...cell3.props}
                                      >
                                        {cell3.props.children}
                                      </div>
                                    );
                                  }
                                  return cell3;
                                },
                              )}
                          </div>
                        );
                      }
                      return cell2;
                    })}
                </div>
              );
            }
            return cell;
          })}
      </div>
    );

    return html;
  } /* ,
  () => {
    return false;
  }, */,
);

export default MyRow;
