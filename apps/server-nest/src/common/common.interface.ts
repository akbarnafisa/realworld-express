export interface ResponseErrorInterface {
  success: boolean;
  data: any | null;
  errors: {
    errorMsg?: string;
    errorCode?: string;
    fieldError?: {
      [fieldname: string]: string[];
    };
  };
}
