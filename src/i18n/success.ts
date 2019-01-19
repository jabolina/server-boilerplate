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
}

export const successMessage = (code: any) => {
    return messages[code];
}