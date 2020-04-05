package org.ideakat.webapp.auth.configuration;

public final class Routes {
    public static final String HOME = "/";

    public static final String API = "/api";

    public static final String PUBLIC_API = "/public/api";
    public static final String ALL_PUBLIC_API_ROUTES = PUBLIC_API + "/**";

    public static final String ALL_STATIC_APP_RESOURCES = "/app/**";
    public static final String FAVICON = "/favicon.png";

    public static final String LOGIN_API =  PUBLIC_API + "/login";
    public static final String LOGIN_SUCCESS = LOGIN_API + "/login-success";
    public static final String LOGIN_FAIL =  LOGIN_API + "/login-fail";

    public static final String PASSWORD_RESET_REQUEST = PUBLIC_API + "/request-reset";
    public static final String PASSWORD_RESET = PUBLIC_API + "/reset-password";

    public static final String REGISTER_API = PUBLIC_API + "/register";
    public static final String REGISTER_VALIDATE_ORG_DETAILS = REGISTER_API + "/validate/org";
    public static final String REGISTER_VALIDATE_PROFILE_DETAILS = REGISTER_API + "/validate/profile";
    public static final String REGISTER_TEAM = REGISTER_API + "/team";

    public static final String ADMIN_REGISTRATION_CONFIRMATION = REGISTER_API + "/confirm/admin";
    public static final String INVITE_REGISTRATON_CONFIRMATION = REGISTER_API + "/invite/confirm";

    public static final String CONFIRMATION_CODE_URL_PARAM_NAME = "code";
    public static final String CONFIRMATION_CODE_URL_PATH_VARIABLE = "/{" + CONFIRMATION_CODE_URL_PARAM_NAME + "}";

    public static final String INVITE_REGISTRATON_COMPLETE = REGISTER_API + "/invite/complete";

    public static final String ADMIN_API = "/admin/api";
    public static final String ALL_ADMIN_ROUTES = ADMIN_API + "/**";
    public static final String ADMIN_INVITE = ADMIN_API + "/invite";

    public static final String USER_API = API + "/user";
    public static final String USER_GET_PROFILE = USER_API + "/profile";
    public static final String USER_EDIT_PROFILE = USER_API + "/edit";

    public static final String UI_ROUTES = "/#";
    public static final String UI_LOGIN = UI_ROUTES + "/login";
    public static final String UI_INVITE_REGISTRATION = UI_ROUTES + "/join";
    public static final String UI_EXPIRED_EMAIL_CONFIRMATION = UI_ROUTES + "/expired-email";
    public static final String UI_PASSWORD_RESET_ROUTE = UI_ROUTES + "/reset";

    public static final String UI_SHOW_HELP_DIALOG_URL_PARAM = "showHelpModal=true";

    private Routes(){}
}
