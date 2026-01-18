import { GraphQLError } from 'graphql';

export class AuthenticationError extends GraphQLError {
  constructor(message: string = 'You must be logged in to perform this action') {
    super(message, {
      extensions: {
        code: 'UNAUTHENTICATED',
      },
    });
  }
}

export class ForbiddenError extends GraphQLError {
  constructor(message: string = 'You are not authorized to perform this action') {
    super(message, {
      extensions: {
        code: 'FORBIDDEN',
      },
    });
  }
}

export class NotFoundError extends GraphQLError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, {
      extensions: {
        code: 'NOT_FOUND',
      },
    });
  }
}

export class ValidationError extends GraphQLError {
  constructor(message: string) {
    super(message, {
      extensions: {
        code: 'BAD_USER_INPUT',
      },
    });
  }
}

export class DatabaseError extends GraphQLError {
  constructor(message: string = 'A database error occurred') {
    super(message, {
      extensions: {
        code: 'INTERNAL_SERVER_ERROR',
      },
    });
  }
}
