import React from "react";
import CustomErrorFallback from "../../components/custom/Error";
export default function Error() {
  return (
    <CustomErrorFallback error={{} as Error} resetError={() => null} />
  );
}
