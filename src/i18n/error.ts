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
}

export const errorMessage = (code: any) => {
    return messages[code];
}