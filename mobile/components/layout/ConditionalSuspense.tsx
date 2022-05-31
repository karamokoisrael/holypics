type Props = {
  condition: boolean;
  children: JSX.Element;
  fallBack?: JSX.Element;
};


type RenderProps = {
  condition: boolean;
  component: JSX.Element;
  fallBack?: JSX.Element;
};

export const ConditionalSuspense = ({
  condition,
  children,
  fallBack,
}: Props) => {
  if (condition) return children;
  return fallBack != undefined ? fallBack : null;
};


export const ConditionalRender = ({
  condition,
  component,
  fallBack,
}: RenderProps) => {
  if (condition) return component;
  return fallBack != undefined ? fallBack : null;
};
