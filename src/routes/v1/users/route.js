import { Router } from "express";
import * as userController from "./controller.js";
import { METHOD, PATH, ROLE } from "../../../constants/index.js";
import { verifyJWT, authorizeRoles } from "../../../middlewares/index.js";
import {
  isAuthenticatedUser,
  // authorizeRoles,
} from "../../../middlewares/auth.js";

const router = Router();

const userRoutes = [
  {
    method: METHOD.GET,
    roles: [ROLE.ADMIN],
    middleware: [isAuthenticatedUser],
    handler: userController.getAllUsers,
  },
  {
    method: METHOD.GET,
    path: PATH.DELETED,
    roles: [ROLE.ADMIN],
    middleware: [isAuthenticatedUser],

    handler: userController.getAllUsersDeleted,
  },
  {
    method: METHOD.POST,
    path: PATH.LOGIN,
    handler: userController.loginUser,
  },
  {
    method: METHOD.GET,
    path: PATH.LOGOUT,
    handler: userController.logoutUser,
  },
  {
    method: METHOD.GET,
    path: PATH.ID,
    roles: [ROLE.ADMIN],
    middleware: [isAuthenticatedUser],
    handler: userController.getSingleUser,
  },
  {
    method: METHOD.POST,
    handler: userController.createNewUser,
  },
  {
    method: METHOD.PATCH,
    path: PATH.EDIT,
    roles: [ROLE.ADMIN, ROLE.CUSTOMER],
    middleware: [isAuthenticatedUser],

    handler: userController.updateUser,
  },
  {
    method: METHOD.DELETE,
    path: PATH.DELETE,
    roles: [ROLE.ADMIN],
    middleware: [isAuthenticatedUser],

    handler: userController.deleteUser,
  },
  {
    method: METHOD.PUT,
    path: PATH.RESTORE,
    roles: [ROLE.ADMIN],
    middleware: [isAuthenticatedUser],

    handler: userController.restoreUser,
  },
  {
    method: METHOD.DELETE,
    path: PATH.FORCE_DELETE,
    roles: [ROLE.ADMIN],
    middleware: [isAuthenticatedUser],

    handler: userController.forceDeleteUser,
  },
  {
    method: METHOD.PATCH,
    path: PATH.CHANGE_PASSWORD,
    middleware: [isAuthenticatedUser],

    roles: [ROLE.ADMIN, ROLE.CUSTOMER],
    handler: userController.changeUserPassword,
  },
  {
    method: METHOD.POST,
    path: PATH.EMAIL_OTP,
    handler: userController.sendUserEmailOTP,
  },
  {
    method: METHOD.PATCH,
    path: PATH.RESTORE_PASSWORD,
    handler: userController.resetUserEmailPassword,
  },
  {
    method: METHOD.GET,
    path: PATH.USER_PROFILE,
    middleware: [isAuthenticatedUser],
    roles: [ROLE.ADMIN, ROLE.CUSTOMER],
    handler: userController.getUserProfile,
  },
];

userRoutes.forEach((route) => {
  const { method, path = "", roles = [], middleware = [], handler } = route;
  router[method](path, middleware.concat(authorizeRoles(...roles)), handler);
});

export default router;
