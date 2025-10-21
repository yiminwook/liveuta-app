export class CustomServerError extends Error {
  public readonly isCustomError = true;
  
  constructor(
    message = '에러가 발생했습니다.', 
    public readonly status = 499, 
    public readonly name = 'CustomError'
  ) {
    super(message);
  }
}

export class BadRequestError extends CustomServerError {
  constructor(message = '잘못된 요청입니다.') {
    super(message, 400, 'BadRequestError');
  }
}

export class UnauthorizedError extends CustomServerError {
  constructor(message = '접근 권한이 없습니다.') {
    super(message, 401, 'UnauthorizedError');
  }
}

export class ForbiddenError extends CustomServerError {
  constructor(message = '접근 권한이 없습니다.') {
    super(message, 403, 'ForbiddenError');
  }
}

export class NotFoundError extends CustomServerError {
  constructor(message = '리소스를 찾을 수 없습니다.') {
    super(message, 404, 'NotFoundError');
  }
}


export class InternalServerError extends CustomServerError {
  constructor(message = '서버 에러가 발생했습니다.') {
    super(message, 500, 'InternalServerError');
  }
}

export class ServiceUnavailableError extends CustomServerError {
  constructor(message = '서비스를 사용할 수 없습니다.') {
    super(message, 503, 'ServiceUnavailableError');
  }
}