let presets = [
    {
        "id": "user_exists",
        "base": `SELECT EXISTS(
                    SELECT 1 
                    FROM USUARIO 
                    WHERE USUARIO.email = '<email>')`
    },
    {
        "id": "create_user",
        "base": `INSERT INTO USUARIO (
                    Email, 
                    Senha, 
                    CPF, 
                    Telefone, 
                    Nome, 
                    DataNascimento, 
                    Estado, 
                    Cidade, 
                    Tipo
                )
                VALUES (
                    '<email>', 
                    '<pass>', 
                    '<cpf>', 
                    '<telefone>', 
                    '<nome>',
                    '<datanasc>',
                    '<estado>',
                    '<cidade>',
                    '<tipo>'
                )`
    },
    {
        "id": "retrieve_user",
        "base": `SELECT * FROM USUARIO WHERE USUARIO.Email = <email>`
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
        base: `SELECT CUIDADOR.CodigoUsuario,
                      CUIDADOR.Nome,
                      CUIDADOR.Telefone,
                GROUP_CONCAT(
                    (SELECT ESPECIALIDADE.DescricaoEspecialidade 
                    FROM ESPECIALIDADE
                    INNER JOIN CUIDADOR_ESPECIALIDADE
                    ON CUIDADOR_ESPECIALIDADE.CodigoEspecialidade = ESPECIALIDADE.CodigoEspecialidade
                    INNER JOIN CUIDADOR
                    ON CUIDADOR.CodigoUsuario = CUIDADOR_ESPECIALIDADE.CodigoUsuario)
                ,' ,') AS Especialidades 
                FROM CUIDADOR
                WHERE <especialidade>`,
        filters: [
            {
                "name": "especialidade",
                "SQL": "1"
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
export default presets