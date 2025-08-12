export const useImagePath = () => {
  const config = useRuntimeConfig();

  const getImgPath = (filename) => {
    const baseURL = config.app.baseURL || "/";
    return `${baseURL}imgs/${filename}`.replace(/\/+/g, "/");
  };

  return {
    getImgPath,
  };
};
