export default class ApiResponse<T> {
  success: boolean;
  message: string;
  statusCode?: number;
  data?: T;

  constructor(success: boolean,statusCode: number, message: string, data?: T) {
    this.success = success;
    this.statusCode = statusCode;
    this.message = message;
    if (data) this.data = data;
  }
}