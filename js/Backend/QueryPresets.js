export const PRESETS_ID = {
    USER_EXISTS:          "user_exists",
    CREATE_USER:          "create_user",
    RETRIEVE_USER:        "retrieve_user",
    AUTHENTICATION:       "authentication",

    __DEBUG__PASS_RECOVERY: "PASS_RECOVERY",

    CUIDADORES:           "cuidadores",
    ESPECIALIDADES:       "especialidades",
    USER_VIEW:            "USER_VIEW",

    DEPENDENTES:          "DEPENDENTES",
    CREATE_DEPENDENTE:    "CREATE_DEPENDENTE",
    UPDATE_DEPENDENTE:    "UPDATE_DEPENDENTE",
    DELETE_DEPENDENTE:    "DELETE_DEPENDENTE",

    ADD_ESPECIALIDADE:    "ADD_ESPECIALIDADE",
    REMOVE_ESPECIALIDADE: "REMOVE_ESPECIALIDADE"

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
                    '<Email>', 
                    '<Senha>', 
                    '<CPF>', 
                    '<Telefone>', 
                    '<Nome>',
                    '<DataNascimento>',
                    '<Estado>',
                    '<Cidade>',
                    '<Tipo>'
                )`
    },
    {
        "id": PRESETS_ID.RETRIEVE_USER,
        "base": `SELECT * FROM USUARIO WHERE USUARIO.Email = '<email>' AND USUARIO.Senha = '<pass>'`
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
        "id": PRESETS_ID.__DEBUG__PASS_RECOVERY,
        "base": `SELECT USUARIO.Senha FROM USUARIO WHERE Usuario.Email='<email>'`
    },


    {
        "id": PRESETS_ID.USER_VIEW,
        "base": `SELECT USUARIO.Nome AS Nome,
                    USUARIO.Telefone AS Telefone, 
                    Usuario.Cidade || ', ' || Usuario.Estado AS Localizacao,
                    Usuario.Tipo AS Tipo,
                    --------------------------
                    CASE WHEN Usuario.Tipo = 0 
                    THEN ''
                    WHEN Usuario.Tipo = 1 THEN '[' || (
                        SELECT
                            GROUP_CONCAT('{' ||                                
                                '"CodigoEspecialidade"'    || ': ' || ESPECIALIDADE.CodigoEspecialidade    || ' ' || "," ||
                                '"DescricaoEspecialidade"' || ':"' || ESPECIALIDADE.DescricaoEspecialidade || '"' ||
                            '}')
                        FROM ESPECIALIDADE
                        INNER JOIN CUIDADOR_ESPECIALIDADE
                            ON ESPECIALIDADE.CodigoEspecialidade = CUIDADOR_ESPECIALIDADE.CodigoEspecialidade
                        WHERE CUIDADOR_ESPECIALIDADE.CodigoUsuario = USUARIO.CodigoUsuario
                    ) || ']' 
                    END AS Especialidades,
                    ---------------------------
                    CASE WHEN USUARIO.Tipo = 0
                    THEN '[' || (
                        SELECT 
                            GROUP_CONCAT('{' ||
                                '"CodigoDependente"' || ': ' || DEPENDENTES.CodigoDependente           || ' ' || "," ||
                                '"NomeDependente"'   || ':"' || IFNULL(DEPENDENTES.NomeDependente, '') || '"' || "," ||
                                '"Observacoes"'      || ':"' || IFNULL(DEPENDENTES.Observacoes, '')    || '"' || "," ||
                                '"Prescricoes"'      || ':[' || IFNULL(DEPENDENTES.Prescricoes, '')    || ']' ||
                            '}')
                        FROM (
                            SELECT DEPENDENTE.CodigoDependente,
                                DEPENDENTE.NomeDependente,
                                DEPENDENTE.Observacoes,
                                GROUP_CONCAT('{' ||
                                    '"CodigoPrescricao"' || ': '  || PRESCRICAO.CodigoPrescricao             || ' ' || "," ||
                                    '"NomeMedico"'       || ':"'  || IFNULL(PRESCRICAO.NomeMedico, '')       || '"' || "," ||
                                    '"CRM"'              || ':"'  || IFNULL(PRESCRICAO.CRM, '')              || '"' || "," ||
                                    '"DataPrescricao"'   || ':"'  || IFNULL(PRESCRICAO.DataPrescricao, '')   || '"' || "," ||
                                    '"Procedimentos"'    || ':['  || IFNULL(PROCEDIMENTOS.Procedimentos, '') || ']' ||
                                '}') AS Prescricoes
                            FROM DEPENDENTE
                            LEFT JOIN PRESCRICAO
                                ON PRESCRICAO.CodigoDependente = DEPENDENTE.CodigoDependente
                            LEFT JOIN (
                                SELECT PROCEDIMENTO.CodigoPrescricao,
                                GROUP_CONCAT('{' ||
                                    '"CodigoProcedimento"'    || ': ' || PROCEDIMENTO.CodigoProcedimento                || ' ' || "," ||
                                    '"DescricaoProcedimento"' || ':"' || IFNULL(PROCEDIMENTO.DescricaoProcedimento, '') || '"' || "," ||
                                    '"CodigoPrescricao"'      || ': ' || IFNULL(PROCEDIMENTO.CodigoPrescricao, '')      || ' ' || "," ||
                                    '"FrequenciaDia"'         || ': ' || IFNULL(PROCEDIMENTO.FrequenciaDia, '')         || ' ' || "," ||
                                    '"DuracaoDias"'           || ': ' || IFNULL(PROCEDIMENTO.DuracaoDias, '')           || ' ' || 
                                '}') AS Procedimentos
                                FROM PROCEDIMENTO
                            ) AS PROCEDIMENTOS
                                ON PROCEDIMENTOS.CodigoPrescricao = PRESCRICAO.CodigoPrescricao
                            WHERE DEPENDENTE.CodigoUsuario = USUARIO.CodigoUsuario
                            GROUP BY DEPENDENTE.CodigoDependente
                            ORDER BY DEPENDENTE.CodigoDependente DESC
                        ) AS DEPENDENTES
                    ) || ']'
                    WHEN Usuario.Tipo = 1 THEN ''
                    END AS Dependentes,
                    ---------------------------
                    ( -- TODO: Contratos
                        '[' /*||
                            GROUP_CONCAT('{' || 
                                '"CodigoUsuario"' || ':"' || USUARIO.CodigoUsuario || '"' || "," ||
                                '"Nome"'          || ':"' || USUARIO.Nome          || '"' ||
                            '}')*/ ||
                        ']'
                    ) AS Contratos
                FROM USUARIO
                WHERE USUARIO.CodigoUsuario = <CodigoUsuario>`
    },
    {
        id: PRESETS_ID.CUIDADORES,
        base: `SELECT CUIDADOR.CodigoUsuario AS CodigoUsuario,
                      CUIDADOR.Nome AS Nome,
                      CUIDADOR.Telefone AS Telefone,
                      GROUP_CONCAT(ESPECIALIDADE.DescricaoEspecialidade,' ,') AS Especialidades 
                FROM CUIDADOR
                INNER JOIN CUIDADOR_ESPECIALIDADE
                ON CUIDADOR.CodigoUsuario = CUIDADOR_ESPECIALIDADE.CodigoUsuario
                INNER JOIN ESPECIALIDADE
                ON ESPECIALIDADE.CodigoEspecialidade = CUIDADOR_ESPECIALIDADE.CodigoEspecialidade
                WHERE <especialidades>
                GROUP BY CUIDADOR.CodigoUsuario`,
        filters: [
            {
                "name": "especialidades",
                "SQL": `ESPECIALIDADE.CodigoEspecialidade IN (<?>)`
            }
        ]
    },
    {
        id: PRESETS_ID.ESPECIALIDADES,
        base: `SELECT ESPECIALIDADE.CodigoEspecialidade, 
                    ESPECIALIDADE.DescricaoEspecialidade 
                FROM ESPECIALIDADE`
    },

    {
        id: PRESETS_ID.DEPENDENTES,
        base: `SELECT DEPENDENTE.CodigoDependente,
                    DEPENDENTE.NomeDependente
                FROM DEPENDENTE
                WHERE DEPENDENTE.CodigoUsuario = <CodigoUsuario>
                    AND DEPENDENTE.NomeDependente <> ''
                ORDER BY DEPENDENTE.CodigoDependente DESC`
    },
    {
        id: PRESETS_ID.CREATE_DEPENDENTE,
        base: `INSERT INTO DEPENDENTE(
            NomeDependente, CodigoUsuario, Observacoes
        )
        VALUES (
            '<NomeDependente>', <CodigoUsuario>, '<Observacoes>'
        )`
    },
    {
        id: PRESETS_ID.UPDATE_DEPENDENTE,
        base: `UPDATE DEPENDENTE 
                SET 
                    NomeDependente = '<NomeDependente>'
                WHERE DEPENDENTE.CodigoDependente = '<CodigoDependente>'`
    },
    {
        id: PRESETS_ID.DELETE_DEPENDENTE,
        base: `DELETE FROM DEPENDENTE WHERE DEPENDENTE.CodigoDependente = <CodigoDependente>`
    },
    {
        id: PRESETS_ID.ADD_ESPECIALIDADE,
        base: `INSERT OR REPLACE INTO CUIDADOR_ESPECIALIDADE (CodigoUsuario, CodigoEspecialidade)
                VALUES (<CodigoUsuario>, <CodigoEspecialidade>)`
    },
    {
        id: PRESETS_ID.REMOVE_ESPECIALIDADE,
        base: `DELETE FROM CUIDADOR_ESPECIALDIADE
                WHERE CUIDADOR_ESPECIALIDADE.CodigoUsuario = <CodigoUsuario>
                    AND CUIDADOR_ESPECIALIDADE.CodigoEspecialidade = <CodigoEspecialidade>`
    }
]
export default presets