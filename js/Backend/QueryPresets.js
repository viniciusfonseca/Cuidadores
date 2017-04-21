export const presets = [
    {
        id: "cuidadores",
        base: "SELECT * FROM USUARIO WHERE USUARIO.TIPO = 'cuidador'",
        filters: [
            {
                "name": "especialidade",
                "SQL": ""
            }
        ]
    }
]