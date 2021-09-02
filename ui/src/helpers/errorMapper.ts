
enum ServerErrorMessage {
  UNAUTHORIZED = 'UNAUTHORIZED',
  DUPLICATE_ENTRY = 'DUPLICATE_ENTRY'
}

const errorMapper = (errorMessage : ServerErrorMessage) => {
  console.log(errorMessage);
  switch (errorMessage) {
    case ServerErrorMessage.UNAUTHORIZED:
      return 'Username or password is incorrect';
    case ServerErrorMessage.DUPLICATE_ENTRY:
      return 'User with this E-Mail or Username already exists';
    default:
      return 'Unknown Error';
  }
};

export default errorMapper;
