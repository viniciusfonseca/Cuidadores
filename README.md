# Cuidadores
Encontre pessoas especializadas em cuidar de pessoas. Aplicativo desenvolvido como projeto de IHC

# Ambiente de desenvolvimento
Antes de tudo é necessário instalar o Node.js (links p/ Windows, Linux & Mac):
https://nodejs.org/en/download/

Depois faça o setup do Java 8, Android SDK e React Native como descrito neste link (tutoriais p/ Windows, Linux & Mac):
https://facebook.github.io/react-native/docs/getting-started.html

Para testar, certifique-se que as variáveis de ambiente `JAVA_HOME` e `ANDROID_HOME` estão apontando para os caminhos de instalação corretos. Certifique-se também de que algum dispositivo Android (ou emulador, que pode ser do Android SDK ou Genymotion) está conectado à sua máquina. Para isso, abra o CMD se estiver no Windows ou o BASH se estiver em um ambiente Linux/Unix, e rode o comando:

`$ adb devices`

para obter uma lista de dispositivos conectados. Lembre-se de que se estiver usando um dispositivo real, precisa habilitar o modo desenvolvedor e permitir a depuração via USB.
Em seguida, rode o comando:

`$ react-native run-android`

para iniciar o servidor Node e compilar o projeto. Assim que terminar o processo de compilação, o aplicativo será instalado no dispositivo e será iniciado automaticamente.

# Ferramentas opcionais de desenvolvimento

Para editar o código, recomendo usar o Visual Studio Code:
https://code.visualstudio.com/

Assim que instalar o VSCode, abra a pasta do projeto usando o VSCode ou rode o comando `$ code <caminho_da_pasta_do_projeto>`.

Para manutenção do banco de dados SQLite, recomendo usar o SQLiteStudio:
https://sqlitestudio.pl/index.rvt

Depois de baixar o SQLiteStudio, abra o arquivo `./db/db.db` para ter acesso ao schema.
