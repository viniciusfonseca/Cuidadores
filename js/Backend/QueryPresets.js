export const PRESETS_ID = {
    USER_EXISTS:    "user_exists",
    CREATE_USER:    "create_user",
    RETRIEVE_USER:  "retrieve_user",
    AUTHENTICATION: "authentication",
    CUIDADORES:     "cuidadores",
    DEPENDENTES:    "dependentes",
    ESPECIALIDADES: "especialidades"
}
const presets = [
    {
        "id": PRESETS_ID.USER_EXISTS,
        "base": `SELECT EXISTS(
                    SELECT 1 
                    FROM USUARIO 
                    WHERE USUARIO.email = '<email>') AS R`
    },
    {
        "id": PRESETS_ID.CREATE_USER,
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
        "id": PRESETS_ID.RETRIEVE_USER,
        "base": `SELECT * FROM USUARIO WHERE USUARIO.Email = <email>`
    },
    {
        "id": PRESETS_ID.AUTHENTICATION,
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
        id: PRESETS_ID.CUIDADORES,
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
        id: PRESETS_ID.DEPENDENTES,
        base: `SELECT DEPENDENTE.Nome,
                    DEPENDENTE.Localidade,
                    RESPONSAVEL.Telefone
                FROM DEPENDENTE
                INNER JOIN RESPONSAVEL
                    ON DEPENDETE.CodigoDependente = RESPONSAVEL.CodigoResponsavel`
    },
    {
        id: PRESETS_ID.ESPECIALIDADES,
        base: `SELECT * FROM ESPECIALIDADE`
    }
]
export default presets