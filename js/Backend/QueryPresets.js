export const presets = [
    {
        "id": "user_exists",
        "base": `SELECT EXISTS(
                    SELECT 1 
                    FROM USUARIO 
                    WHERE USUARIO.email = '<email>')`
    },
    {
        "id": "create_user",
        "base": `INSERT INTO USUARIO (Email, Senha)
                    VALUES(ROWID, '<email>', '<pass>')`
    },
    {
        "id": "create_person",
        "base": `INSERT INTO <tipo> VALUES()`
    },
    {
        "id": "authentication",
        "base": `SELECT EXISTS(
                    SELECT 1 
                    FROM USUARIO 
                    WHERE <email> AND <pass>) AS R`,
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
        base: `SELECT CUIDADOR.Nome, 
                GROUP_CONCAT(
                    SELECT ESPECIALIDADE.Nome 
                    FROM ESPECIALIDADE
                    INNER JOIN CUIDADOR_ESPECIALIDADE
                    ON CUIDADOR_ESPECIALIDADE.CodigoEspecialidade = ESPECIALIDADE.CodigoEspecialidade
                    INNER JOIN CUIDADOR
                    ON CUIDADOR.CodigoCuidador = CUIDADOR_ESPECIALIDADE.CodigoCuidador
                ,' ,') AS Especialidades FROM CUIDADOR`,
        filters: [
            {
                "name": "especialidade",
                "SQL": ""
            }
        ]
    },
    {
        id: "dependentes",
        base: `SELECT DEPENDENTE.Nome,
                    DEPENDENTE.Localidade,
                    RESPONSAVEL.Telefone
                FROM DEPENDENTE
                INNER JOIN RESPONSAVEL
                    ON DEPENDETE.CodigoDependente = RESPONSAVEL.CodigoResponsavel`
    },
    {
        id: "especialidades",
        base: `SELECT * FROM ESPECIALIDADE`
    }
]