import React, {useState} from 'react';
import {useFormik} from 'formik';
import {LoginSchema} from './validation';
import clsx from 'clsx';
import {useHistory, useLocation} from 'react-router-dom';
import errorMapper from './helpers/errorMapper';
import Alert, {AlertTypes} from './components/Alert';
import {useSetRecoilState} from 'recoil';
import {getSession} from './helpers/user';
import {userAtom} from './store/atoms';

interface LocationState {
  from: {
    pathname: string;
  }
}

const Login = () => {
  const history = useHistory();
  const location = useLocation<LocationState>();
  const [error, setError] = useState<string>();
  const setSession = useSetRecoilState(userAtom);
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      remember: false,
    },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      const response = await fetch(process.env.REACT_APP_AUTH_API + '/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
        mode: 'cors',
        credentials: 'include',
      });

      if (!response.ok) {
        const err = (await response.json())?.message;
        setError(errorMapper(err));
      } else {
        const session = await getSession();
        setSession(session);
        const {from} = location.state || {from: {pathname: '/'}};
        history.push(from);
      }
    },
  });
  return (
    <div className="align-center flex flex-col justify-center w-[800px] lg:w-[600px] sm:m-auto mx-5 mb-5 space-y-8">
      <form onSubmit={formik.handleSubmit}>
        <div className="flex flex-col bg-white p-12 rounded-lg shadow space-y-6">
          <h1 className="font-bold text-xl text-center">
          Sign in to your account
          </h1>
          { !!error && <Alert message={error} type={AlertTypes.ERROR} /> }
          <div className="flex flex-col space-y-1">
            <label htmlFor="username">Username:</label>
            <input
              onChange={formik.handleChange}
              id="username"
              type="text"
              name="username"
              placeholder="Username"
              onBlur={formik.handleBlur}
              className={clsx('border-2 rounded px-3 py-2 w-full focus:outline-none focus:shadow', formik.touched.username && formik.errors.username ? 'border-red-300 placeholder-red-400 focus:border-red-400' : 'focus:border-blue-400') }
            />
            <span className="text-red-600 text-sm">
              {formik.touched.username && formik.errors.username}
            </span>
          </div>
          <div className="flex flex-col space-y-1">

            <label htmlFor="password">Password:</label>
            <input
              onChange={formik.handleChange}
              id="password"
              type="password"
              name="password"
              placeholder="Password"
              onBlur={formik.handleBlur}
              className={clsx('border-2 rounded px-3 py-2 w-full focus:outline-none  focus:shadow', formik.touched.password && formik.errors.password ? 'border-red-300 placeholder-red-400 focus:border-red-400' : 'focus:border-blue-400') }
            />
            <span className="text-red-600 text-sm">
              {formik.touched.password && formik.errors.password}
            </span>
          </div>
          <div className="relative">
            <input
              type="checkbox"
              name="remember"
              id="remember"
              onChange={formik.handleChange}
              className="inline-block align-middle"
            />
            <label
              className="ml-2 inline-block align-middle"
              htmlFor="remember">
              Remember me
            </label>
          </div>
          <div
            className="flex flex-col-reverse sm:flex-row sm:justify-between items-center"
          >
            <a
              href="#"
              className="inline-block text-blue-500 hover:text-blue-800 hover:underline"
            >
            Forgot your password?
            </a>
            <button
              type="submit"
              className="bg-blue-500 text-white font-bold px-5 py-2 rounded focus:outline-none shadow hover:bg-blue-700 transition-colors"
            >
            Log In
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
