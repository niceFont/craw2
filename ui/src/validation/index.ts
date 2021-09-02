import * as Yup from 'yup';


export const LoginSchema = Yup.object().shape({
  username: Yup.string().required('Username is required.'),
  password: Yup.string().min(8, 'Password is too short.')
      .max(255, 'Password limit reached.')
      .required('Password is required.'),
});
