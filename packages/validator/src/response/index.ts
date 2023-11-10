export interface ResponseFormatType {
  success: boolean;
  data: any | null;
  error: {
    errorMsg: string;
    errorCode?: string;
  } | null;
}

export const responseFormat = ({ success, data, error }: ResponseFormatType): ResponseFormatType => {
  return {
    success,
    data,
    error,
  };
};
