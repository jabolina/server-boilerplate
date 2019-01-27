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
        "Erro durante cadastro",
        "Error during user register",
        "Error durante el registro",
        "Erreur lors de l'inscription",
    ]),
    2: messageFactory([
        "Login inváliado",
        "Invalid login",
        "Inicio de sesión no válido",
        "Connexion invalide"
    ]),
    3: messageFactory([
        "Erro ao redefinir a senha",
        "Error while resetting password",
        "Error al restablecer la contraseña",
        "Erreur lors de la réinitialisation du mot de passe",
    ]),
    4: messageFactory([
        "Erro ao desativar a conta",
        "Error while disabling account",
        "Error al desactivar la cuenta",
        "Erreur lors de la désactivation du compte",
    ]),
}

export const errorMessage = (code: any) => {
    return messages[code];
}