const messageFactory = (messages: string[]) => {
    return [{
        country: "pt",
        message: messages[0],
    }, {
        country: "en",
        message: messages[1],
    }, {
        country: "es",
        message: messages[2],
    }, {
        country: "fr",
        message: messages[3],
    }];
}
const messages: any = {
    1: messageFactory([
        "Sucesso durante cadastro",
        "Sucess during user register",
        "Éxito durante el registro",
        "Succès lors de l'inscription",
    ]),
    2: messageFactory([
        "Logado com sucesso",
        "Successfully logged in",
        "Ha iniciado sesión correctamente",
        "Connecté avec succès",
    ]),
    3: messageFactory([
        "Sucesso na redefinição de senha",
        "Success in password reset",
        "Éxito en restablecer la contraseña",
        "Réinitialisation du mot de passe",
    ]),
    4: messageFactory([
        "Conta desativada com sucesso",
        "Account disabled successfully",
        "Cuenta deshabilitada exitosamente",
        "Compte désactivé avec succès",
    ]),
}

export const successMessage = (code: any) => {
    return messages[code];
}