function authenticationCheckRedirect(redirect, authenticationTarget) {
    return async (req, res, next) => {
        let authenticationStatus = !!(req.session && req.session.user);
        if (authenticationStatus === authenticationTarget) {
            next();
        } else {
            res.redirect(redirect);
        }
    };
}

module.exports = { authenticationCheckRedirect };
