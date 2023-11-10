export interface ResponseFormatType {
  success: boolean;
  data: any;
  error: {
    errorMsg: string;
    errorCode?: string;
  };
}

export const responseFormat = ({ success, data, error }: ResponseFormatType): ResponseFormatType => {
  return {
    success,
    data,
    error,
  };
};
