type Props = {
  data: Array<any>;
  render: (value: any, index: number, array: any[]) => any;
};

export const MapList = ({ data, render }: Props) => <>{data.map(render)}</>;
