export const presets = [
    {
        "id": "authentication",
        "base": "SELECT EXISTS(SELECT 1 FROM USUARIO WHERE <email> AND <pass>) AS R",
        "filters": [
            {
                "name": "email",
                "SQL": "USUARIO.Email = '<?>'",
                "flags": ["negate"]
            },
            {
                "name": "pass",
                "SQL": "USUARIO.Senha = '<?>'",
                "flags": ["negate"]
            }
        ]
    },
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