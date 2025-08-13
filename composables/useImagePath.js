import { pgwWrap } from "./usePgw.js";

export const useImagePath = (imageName) => {
  return pgwWrap(`/imgs/${imageName}`);
};
