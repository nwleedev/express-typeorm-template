import { check } from 'express-validator';

export const validateID = [check('id', 'ID is not number').isInt().toInt(10)];

export const validateRegister = [
  check('email', 'Invalid email address')
    .trim()
    .isEmail()
    .isLength({
      min: 8,
    })
    .notEmpty(),
  check('username', 'Invalid username')
    .trim()
    .isString()
    .isLength({
      min: 4,
      max: 12,
    })
    .notEmpty(),
  check('password', 'The password too weak')
    .trim()
    .isString()
    .isLength({
      min: 8,
    })
    .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
    .notEmpty(),
  check('password_confirm', "Passwords don't match")
    .trim()
    .notEmpty()
    .custom((value, { req }) => value !== req.body.password),
];

export const validateEmail = [
  check('email', 'Invalid Email Address')
    .isEmail()
    .notEmpty()
    .withMessage('Invalid Email Address'),
];

export const validateEmailToken = [
  check('email', 'Invalid Email Address').isEmail().notEmpty(),
  check('token').notEmpty(),
];

export const validateLogin = [
  check('email', 'Invalid Email Address').notEmpty().isEmail(),
  check('password', 'The password is too weak.')
    .notEmpty()
    .isLength({ min: 8 }),
];

export const validatePassword = [
  check('password', 'The password too weak')
    .trim()
    .isString()
    .isLength({
      min: 8,
    })
    .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
    .notEmpty(),
  check('password_confirm', "Passwords don't match")
    .trim()
    .notEmpty()
    .custom((value, { req }) => value !== req.body.password),
];

export const validateCheckPassword = [
  check('email', 'Invalid email address')
    .trim()
    .isEmail()
    .isLength({
      min: 8,
    })
    .notEmpty(),
  check('password', 'The password too weak')
    .trim()
    .isString()
    .isLength({
      min: 8,
    })
    .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
    .notEmpty(),
  check('password_confirm', "Passwords don't match")
    .trim()
    .notEmpty()
    .custom((value, { req }) => value !== req.body.password),
];
